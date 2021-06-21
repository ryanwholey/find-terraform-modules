const path = require('path')

const glob = require('@actions/glob')

async function findUniqueDirsByGlob ({ patterns }) {
  const globber = await glob.create(patterns.join('\n'))
  const files = await globber.glob()

  return Array.from(new Set(files.map(f => path.parse(f).dir)))
}

module.exports = findUniqueDirsByGlob
