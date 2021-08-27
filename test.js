/* global test expect */
import oembed from './index.js'
import { promises as fs } from 'fs'

import { remark } from 'remark'
import parseMarkdown from 'remark-parse'

test('full doc', async () => {
  const doc = await fs.readFile('test.md')
  const contents = await remark()
    .use(parseMarkdown)
    .use(oembed)
    .process(doc)
  console.log(contents)
})
