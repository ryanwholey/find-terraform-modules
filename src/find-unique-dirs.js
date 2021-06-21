const path = require('path')

const glob = require('@actions/glob')

async function findUniqueDirsByGlob ({ includes }) {
  const globber = await glob.create(includes.replace(',', '\n'))
  const files = await globber.glob()

  return Array.from(new Set(files.map(f => path.parse(f).dir)))
}

module.exports = findUniqueDirsByGlob
