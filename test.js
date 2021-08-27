/* global test expect */
import oembed from './index.js'
import { readSync } from 'to-vfile'
import { reporter } from 'vfile-reporter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import remarkStringify from 'rehype-stringify'

test('full doc', async () => {
  const contents = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(remarkGfm)
    .use(oembed)
    .use(remarkStringify)
    .process(readSync('test.md'))

  expect(reporter(contents, { color: false })).toBe('test.md: no issues found')
  expect(String(contents)).toMatchSnapshot()
})
