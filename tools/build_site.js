// build index page for github page's

import oembed from '../index.js'
import { reporter } from 'vfile-reporter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import remarkStringify from 'rehype-stringify'
import { promises as fs } from 'fs'
import config from '../config.js'
import urls from '../test-urls.json'

const contents = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(remarkGfm)
    .use(oembed, config)
    .use(remarkStringify)
    .process(await fs.readFile('test.md'))

const template = String(await fs.readFile('docs/template.html'))
await fs.writeFile('docs/index.html', template.replace('{CONTENT}', String(contents)))