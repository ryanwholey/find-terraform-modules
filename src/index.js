const core = require('@actions/core')

const findUniqueDirs = require('./find-unique-dirs')

async function main () {
  try {
    const dirs = await findUniqueDirs({
      patterns: core.getInput('patterns').split(',').filter(p => !!p)
    })
    core.setOutput('directories', JSON.stringify(dirs))
  } catch (error) {
    core.setFailed(error.message)
  }
}

main()
