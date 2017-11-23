import fs from 'fs'
import globby from 'globby'

module.exports = babel => {
  var t = babel.types;

  return {
    name: "s2s-redux-actions-reducers-manager",
    visitor: {
      Program: {
        enter(path, state) {
          const { input, output } = state.opts

          if (!input) {
            throw new Error('require input option')
          }

          if (!output) {
            throw new Error('require output option')
          }

          const inputFiles = globby.sync(input)
          const outputFiles = globby.sync(output)

          const outputDirPath = output.split("/").reverse().slice(1).reverse().join("/")

          const inputFilesName = inputFiles.map(f =>  f.split("/").pop())
          const outputFilesName = outputFiles.map(f => f.split("/").pop())

          // If there is no input directory file in the output directory, create a file
          inputFilesName.map(
            f => {
              if (outputFilesName.indexOf(f) == -1){
                fs.writeFileSync( outputDirPath+"/" + f, "")
              }
            }
          )
        }
      }
    }
  }
}
