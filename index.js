const core = require('@actions/core')

const findTerraformModules = require('./src/find-unique-dirs')

async function main () {
  try {
    const dirs = await findTerraformModules({
      patterns: core.getInput('patterns')
    })

    core.setOutput('directories', JSON.stringify(dirs))
  } catch (error) {
    core.setFailed(error.message)
  }
}

main()
