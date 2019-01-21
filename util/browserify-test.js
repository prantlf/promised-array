const { readFile, outputFile } = require('fs-extra')
const { join } = require('path')

async function generateTest () {
  console.log(`Reading "test/test-source.mjs"...`)
  const directory = join(__dirname, '../test')
  let content = await readFile(join(directory, 'test-source.mjs'), { encoding: 'utf-8' })
  content = content
    .replace('import chai from \'chai\'', '')
    .replace('const { expect } = chai', '')
  console.log(`Writing "test/test-source.js"...`)
  await outputFile(join(directory, 'test-source.js'), content)
}

generateTest().catch(error => {
  console.error(error)
  process.exitCode = 1
})
