import { defineConfig } from 'vitepress'
import readmes from '../../readmes.json'

const categories = readmes.readmes.map((acc, cur: any) => {
  const { categoryId } = cur

  if (!acc[categoryId]) {
    acc[categoryId] = []
  }

  acc[categoryId].push(cur)

  acc[categoryId].sort((a, b) => a.filename.localeCompare(b.filename))

  return acc
})

export default defineConfig({
  title: "TransDocs",
  description: "专注于精准翻译文档",
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Readmes',
        items: Object.keys(categories).map(category => {
          const ｛ filename: lastFilename, category: text ｝ = categories[category][0]
          return {
            text: ,
            link: `/${category}/${lastFilename}`
          }
        })
      },
    ],

    sidebar: {
      ...Object.keys(categories).reduce((acc, category) => {
        acc[`/${category}/`] = [{
          text: category,
          items: categories[category].map(item => {
            return {
              text: item.name,
              link: `/${category}/${item.filename}`
            }
          })
        }]

        return acc
      }, {})
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/transdocs-org/transdocs.org' }
    ]
  },
  lang: 'zh-CN',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    [
      'script',
      {},
      `var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?2fe1095387fd2f2c25892a4fde2f0cc2";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      })();`
    ]
  ]
})
