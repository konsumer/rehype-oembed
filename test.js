/* global test expect */
import oembed from './index.js'
import { reporter } from 'vfile-reporter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import remarkStringify from 'rehype-stringify'
import { promises as fs } from 'fs'
import config from './config.js'

test('full doc', async () => {
  const contents = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(remarkGfm)
    .use(oembed, config)
    .use(remarkStringify)
    .process(await fs.readFile('test.md'))

  expect(reporter(contents, { color: false })).toBe('no issues found')
  expect(String(contents)).toMatchSnapshot()
})
