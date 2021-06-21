const path = require('path')

const { expect } = require('chai')

const findUniqueDirsByGlob = require('./find-unique-dirs')
const fixturesDir = path.resolve(__dirname, '../test/fixtures/')

describe('findUniqueDirsByGlob', () => {
  it('should find dirs in a basic case', async () => {
    const fullDirs = await findUniqueDirsByGlob({
      includes: `${fixturesDir}/**/*.tf`
    })
    expect(fullDirs.map(d => d.replace(fixturesDir, ''))).to.include.members([
      '/foo/baz',
      '/foo',
      ''
    ])
  })

  it.only('should find files matching multiple patters', async () => {
    const fullDirs = await findUniqueDirsByGlob({
      includes: [
        `${fixturesDir}/**/*.tf`,
        `${fixturesDir}/**/*.tf.json`,
      ].join(',')
    })
    expect(fullDirs.map(d => d.replace(fixturesDir, ''))).to.include.members([
      '/parent/child',
      '/dot-json',
      '/top-level',
      '',
    ])
  })

  it('should not find dirs for patterns that do not match', async () => {
    const fullDirs = await findUniqueDirsByGlob({
      includes: 'bad/pattern/*.js',
    })
    expect(fullDirs.map(d => d.replace(fixturesDir, ''))).to.include.members([])
  })
})
