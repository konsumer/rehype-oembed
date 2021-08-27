import providers from './providers.json'
import { selectAll } from 'unist-util-select'
import escapRe from 'escape-string-regexp'
import { isUri } from 'valid-url'
import fetch from 'isomorphic-fetch'

import { parse } from 'parse5'
import { fromParse5 } from 'hast-util-from-parse5'

export default () => {
  // make regexes for all endpoints/schemes
  for (const provider of providers) {
    provider.matchers = provider.endpoints.map(endpoint => {
      endpoint.schemes = endpoint?.schemes || []
      return endpoint.schemes.map(pattern => new RegExp(escapRe(pattern).replace(/\\\*/g, '(.+)')))
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

  // this does the actual replacement in the AST
  return async (tree, file) => {
    const nodes = selectAll('paragraph text', tree)
    await Promise.all(nodes.map(async n => {
      if (isUri(n.value)) {
        const { endpoint } = findProviderAndEndpoint(n.value)
        if (endpoint) {
          // jam the embed-data into the node
          const oembed = await (await fetch(`${endpoint.url.replace(/\{format\}/g, 'json')}?url=${n.value}`)).json()
          if (oembed) {
            const hast = fromParse5(parse(oembed.html), tree)
            hast.oembed = oembed
            console.log(hast.children[0].children[1].children)
          }
        }
      }
    }))
    return tree
  }
}