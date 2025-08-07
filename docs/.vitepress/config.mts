import { defineConfig } from 'vitepress'
import path from 'node:path'
import { sanitizeFilename } from '../../src/utils'
import _readmes from '../../readmes.json'

const readmes = _readmes.readmes
const categories = [... new Set(readmes.map(item => item.category))]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "TransDocs",
  description: "力求 100% 还原官网内容与风格",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      ...categories.map(category => ({
        text: category,
        link: `/${category}/${sanitizeFilename(readmes.find(item => item.category === category)!.name)}`
      }))
    ],

    sidebar: [
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/transdocs-org/transdocs.org' }
    ]
  }
})
