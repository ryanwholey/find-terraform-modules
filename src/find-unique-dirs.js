const path = require('path')
const util = require('util')

const glob = util.promisify(require('glob'))

async function findUniqueDirs ({ patterns, options = {} }) {
  const results = (await Promise.all(patterns.map((p) => glob(p, options))))
  const files = results.reduce((acc, dirs) => ([...acc, ...dirs]), [])

  return Array.from(new Set(files.map(f => path.parse(f).dir)))
}

module.exports = findUniqueDirs
