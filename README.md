# rehype-oembed

This is a [rehype](https://github.com/rehypejs/rehype) plugin to embed many types of media in HTML (replacing links.)

## WIP

> This is not finished yet, and likely will be renamed. Please check back.


Plugin that does similar to [gatsby-rehype-oembed](https://github.com/raae/gatsby-rehype-oembed), but works with remark, in general, as well as Gatsby, and has more supported formats.

## usage

Install:

```sh
npm i @konsumer/rehype-oembed
```

In markdown, put your media-link on a line of it's own:

```md
https://twitter.com/Chhapiness/status/1422326068917284869?s=20
```

In HTML, put a link alone inside a `<p>`, and make sure the `href` is the same as the text in the link:

```html
<p>
  <a href="https://www.youtube.com/watch?v=K-281doxOMc">https://www.youtube.com/watch?v=K-281doxOMc</a>
</p>
```

Here is an example of parsing a markdown file to HTML, and adding the embeds:

```js
import oembed from '@konsumer/rehype-oembed'
import { promises as fs } from 'fs'
import { reporter } from 'vfile-reporter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import remarkStringify from 'rehype-stringify'

const markdownToHtml = async file => unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(remarkGfm)
  .use(oembed)
  .use(remarkStringify)
  .process(await fs.readFile(file))

markdownToHtml()
  .then(console.log)
```

## thanks

- [@wooorm](https://github.com/wooorm) mostly wrote the actual AST-processor. They rock!
- [@rae](https://github.com/raae) wrote the awesome [gatsby-remark-oembed](https://github.com/raae/gatsby-remark-oembed), which got me looking at oembed.