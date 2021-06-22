# Find Terraform Modules

A GitHub action to find Terraform module directories.

The impetus for this action is to find and pass module directories to other jobs, so they can be used in a matrix set to individually test, lint, release, etc. each module.

## Usage

```yml
jobs:
  find-modules:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - id: get-module-directories
      uses: ryanwholey/find-terraform-modules@v1
    outputs:
      matrix: ${{ steps.get-module-directories.outputs.directories }}
  check-validate:
    runs-on: ubuntu-latest
    needs: find-modules
    strategy:
      matrix:
        package: ${{ fromJson(needs.find-modules.outputs.matrix) }}
    defaults:
      run:
        working-directory: ${{ matrix.package }}
    steps:
      - uses: actions/checkout@v2
      - uses: hashicorp/setup-terraform@v1
      - run: terraform fmt -check
      - run: terraform init
      - run: terraform validate
```

### Action inputs

| Name | Description | Default |
| --- | --- | --- |
| `patterns` | Comma separated list of glob patterns (see [node-glob](https://github.com/isaacs/node-glob#glob-primer) for supported syntax) | `./**/*.tf?(.json)` |

### Action outputs

The following outputs can be used by subsequent workflow steps.

| Name | Description |
| --- | --- |
| `directories` | The matching directories |
