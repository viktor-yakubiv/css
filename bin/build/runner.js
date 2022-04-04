const fs = require('fs').promises
const path = require('path')
const sass = require('sass')

const PROJECT_ROOT = path.join(__dirname, '../../')
const SOURCE_DIR = path.join(PROJECT_ROOT, 'src')
const LIB_DIR = path.join(PROJECT_ROOT, 'lib')
const DEFAULT_DIST_DIR = PROJECT_ROOT

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

    const result = sass.compile(srcFile, {
      loadPaths: [
        // used to build properly inside the `lib` directory
        LIB_DIR,

        // building properly from the `src` directory when file names overlap
        // i.e. enables including files like `lib/scale` when `src/scale` exists
        PROJECT_ROOT,
      ],
    })

    return fs.writeFile(destFile, result.css).then(passedResult => {
      console.log(`✔ ${name}.css`)
      return passedResult
    })
  })

  await Promise.all(writes)
}

if (require.main === module) run()

module.exports = run
