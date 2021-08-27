// this will generate test.md for demo page & tests

import urls from '../test-urls.json'
import { promises as fs } from 'fs'

const header = `
# Remark oEmbed

This is a library to add nice embeds for links, when processing HTML or markdown. You can find the library [here on github](https://github.com/konsumer/rehype-oembed).

This is a basic demo-page.

`

await fs.writeFile('test.md', header + '\n' + urls.map(u => '\n`' + u + '`\n\n' + u).join('\n'))

