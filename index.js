import providers from './providers.json'
import { visit, SKIP } from 'unist-util-visit'
import escapRe from 'escape-string-regexp'
import fetch from 'isomorphic-fetch'
import { parseFragment } from 'parse5'
import { fromParse5 } from 'hast-util-from-parse5'

export default (options = {}) => {
  // make regexes for all endpoints/schemes
  for (const provider of providers) {
    provider.matchers = provider.endpoints.map(endpoint => {
      endpoint.schemes = endpoint?.schemes || []
      return endpoint.schemes.map(pattern => new RegExp('^' + escapRe(pattern).replace(/\\\*/g, '(.+)') + '$'))
    })
  }

  // look through providers for an endpoint that matches.
  // return the first mathing provider & endpoint
  const findProviderAndEndpoint = url => {
    for (const provider of providers) {
      for (const m in provider.matchers) {
        for (const schemeRegex of provider.matchers[m]) {
          if (schemeRegex.test(url)) {
            return { provider, endpoint: provider.endpoints[m] }
          }
        }
      }
    }
    return {}
  }

  return async (tree, file, ...args) => {
    // List of `[paragraph, endpoint, url]`s.
    const pairs = []

    visit(tree, 'element', (element, _, parent) => {
      // A link on its own specifically in a paragraph, with text=href:
      if (element.tagName === 'a' && parent && parent.type === 'element' && parent.tagName === 'p' && parent.children.length === 1 && element.properties.href === element.children[0].value) {
        const url = element.properties.href
        const { endpoint, provider } = findProviderAndEndpoint(url)

        // Known endpoint.
        if (endpoint) {
          pairs.push([parent, endpoint, url, provider])
          return SKIP
        }
      }
    })

    // get info from provider for embed, and swap children out for that
    await Promise.all(pairs.map(async ([element, endpoint, url, provider]) => {
      const properties = { ...options[provider.provider_name], url, format: 'json' }
      const u = endpoint.url.replace(/\{format\}/g, 'json') + '?' + (new URLSearchParams(properties)).toString()
      const oembed = await (await fetch(u)).json()
      if (oembed && oembed.html) {
        element.children = fromParse5(parseFragment(oembed.html), tree).children
      }
    }))

    return tree
  }
}
