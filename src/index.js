const core = require('@actions/core')

const findTerraformModules = require('./find-unique-dirs')

async function main () {
  try {
    const dirs = await findTerraformModules({
      includes: core.getInput('includes')
    })
    console.log(dirs) // eslint-disable-line no-console
    core.setOutput('directories', JSON.stringify(dirs))
  } catch (error) {
    core.setFailed(error.message)
  }
}

main()
