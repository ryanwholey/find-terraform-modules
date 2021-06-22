const path = require('path')
const fs = require('fs')

const { expect } = require('chai')

const findUniqueDirs = require('./find-unique-dirs')

const tests = [
  {
    name: 'Basic single dir, single file case',
    filsystem: {
      foo: {
        'main.tf': ''
      }
    },
    expected: [
      './foo'
    ],
    props: {
      patterns: ['./**/*.tf']
    }
  },
  {
    name: 'Nested dir',
    filsystem: {
      foo: {
        bar: {
          'main.tf': ''
        }
      }
    },
    expected: [
      './foo/bar'
    ],
    props: {
      patterns: ['./**/*.tf']
    }
  },
  {
    name: 'Multiple patterns',
    filsystem: {
      foo: {
        'main.tf': ''
      },
      bar: {
        'main.tf.json': ''
      }
    },
    expected: [
      './foo',
      './bar'
    ],
    props: {
      patterns: ['./**/*.tf', './**/*.tf.json']
    }
  },
  {
    name: 'No match',
    filsystem: {
      foo: {
        file: ''
      }
    },
    expected: [],
    props: {
      patterns: ['./**/*.tf']
    }
  },
  {
    name: 'Parent child',
    filsystem: {
      parent: {
        child: {
          'main.tf': ''
        },
        'main.tf': ''
      }
    },
    expected: [
      './parent',
      './parent/child'
    ],
    props: {
      patterns: ['./**/*.tf']
    }
  },
  {
    name: 'No .dot files',
    filsystem: {
      '.terraform': {
        'main.tf': '',
        child: {
          'main.tf': ''
        }
      },
      foo: {
        'main.tf': ''
      }
    },
    expected: [
      './foo'
    ],
    props: {
      patterns: ['./**/*.tf']
    }
  },
  {
    name: 'Complex matching pattern',
    filsystem: {
      bar: {
        'main.tf.json': ''
      },
      foo: {
        'main.tf': ''
      }
    },
    expected: [
      './foo',
      './bar'
    ],
    props: {
      patterns: ['./**/*.tf?(.json)']
    }
  }
]

function createFs (tree, root = '/tmp') {
  Object.keys(tree).forEach((part) => {
    if (typeof (tree[part]) === 'string') {
      fs.writeFileSync(path.resolve(root, part), tree[part])
    } else {
      fs.mkdirSync(path.resolve(root, part))
      createFs(tree[part], path.resolve(root, part))
    }
  })
}

describe('findUniqueDirs', () => {
  tests
    .forEach(({ name, filsystem, props, expected }) => {
      it(name, async () => {
        const root = await fs.promises.mkdtemp('/tmp/')
        createFs(filsystem, root)

        const dirs = await findUniqueDirs({
          ...props,
          options: {
            ...props.options,
            cwd: root
          }
        })
        expect(dirs).to.have.members(expected)
      })
    })
})
