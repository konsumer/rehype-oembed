/*
Simple tool to download list of providers, in JSON.

I pre-compute this to save an HTTP request, so it should be run periodically to update the list
*/

import fetch from 'isomorphic-fetch'
import { promises as fs } from 'fs'

const r = await fetch('https://oembed.com/providers.json')
await fs.writeFile('providers.json', JSON.stringify(await r.json(), null, 2))