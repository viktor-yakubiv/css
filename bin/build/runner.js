const fs = require('fs').promises
const path = require('path')
const sass = require('sass')

const SOURCE_DIR = path.join(__dirname, '../../')
const DEFAULT_DIST_DIR = SOURCE_DIR

const run = async ({ out } = {}) => {
  const outputDir = out
    ? path.resolve(process.cwd(), out)
    : DEFAULT_DIST_DIR

  const fileNames = (await fs.readdir(SOURCE_DIR))
    .filter(fileName => /^[^_.].+\.scss/i.test(fileName))

  const writes = fileNames.map(fileName => {
    const name = fileName.replace(/\.s?css$/i, '')

    const srcFile = path.join(SOURCE_DIR, fileName)
    const destFile = path.join(outputDir, `${name}.css`)

    const result = sass.compile(srcFile)

    return fs.writeFile(destFile, result.css).then(passedResult => {
      console.log(`✔ ${name}.css`)
      return passedResult
    })
  })

  await Promise.all(writes)
}

if (require.main === module) run()

module.exports = run
