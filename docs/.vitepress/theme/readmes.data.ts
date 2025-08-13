import { readmes, categoryMap } from '../common'

const tags = [
  ...new Set(
    readmes
      .filter((item) => Array.isArray(item.tags))
      .reduce((acc, readme) => {
        return [...acc, ...readme.tags!];
      }, [] as string[])
  )
];

const sites = [
  {
    name: 'ChromaDB',
    url: 'https://chroma.transdocs.org'
  },
  {
    name: 'Nestjs',
    url: 'https://nestjs.transdocs.org'
  },
  {
    name: 'Langchainjs',
    url: 'https://langchainjs.transdocs.org'
  },
  {
    name: 'ta-lib-python',
    url: 'https://ta-lib-python.transdocs.org'
  }
]

export const data = {
  readmes,
  categoryMap,
  categories: Object.values(categoryMap),
  tags,
  sites
}

export default {
  load() {
    return data
  }
}
