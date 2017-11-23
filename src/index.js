import fs from 'fs'
import globby from 'globby'
import createFile from 'babel-file';
import generate from 'babel-generator';

module.exports = babel => {
  var t = babel.types;
  let variableDeclarators = []

  return {
    name: "s2s-redux-actions-reducers-manager",
    visitor: {
      VariableDeclarator(path,state){
        variableDeclarators.push(path.node.id.name)
      },
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
        },

        exit(path, state){
          const { output } = state.opts

          const inputFilePath = state.file.opts.filename
          const inputFileName = inputFilePath.split("/").pop()

          const outputDirPath = output.split("/").reverse().slice(1).reverse().join("/")
          const outputFilePath = outputDirPath + "/" + inputFileName

          let outputFile
          let actionNameArray = []
          let objectPropertyArray = []

          fs.readFile(outputFilePath, (err, data) => {
            const outputFileSrc = data.toString();
            outputFile = createFile(outputFileSrc, {
              filename: outputFilePath
            })

            outputFile.path.traverse({
              MemberExpression(path){
                if(path.node.object.name != "actions"){
		              return
                }
                actionNameArray.push(path.node.property.name)
              }
            })

            variableDeclarators.forEach((val,index,ar) => {
              if (actionNameArray.indexOf(val) == -1){
                outputFile.path.traverse({
                  ObjectExpression(path){
                    if(path.parent.type != "CallExpression"){
                      return
                    }
                    path.node.properties.push(
                      t.ObjectProperty(
                        t.Identifier(val),
                        t.Identifier(val),
                        false,true
                      )
                    )
                  }
                })
                const resultSrc = generate(outputFile.ast).code
                fs.writeFile(outputFilePath, resultSrc, (err) => { if(err) {throw err} });
              }
            });

            if(actionNameArray.length > variableDeclarators.length){
              actionNameArray.forEach((val,index,ar) => {
                if (variableDeclarators.indexOf(val) == -1){
                  outputFile.path.traverse({
                    ObjectProperty(path){
                      if(path.node.key.type != "MemberExpression"){
                        return
                      }
                      if(path.node.key.property.name == val){
                        path.remove()
                      }
                    }
                  })
                }
              })
              const resultSrc = generate(outputFile.ast).code
              fs.writeFile(outputFilePath, resultSrc, (err) => { if (err) { throw err} })
            }

            actionNameArray = []
            variableDeclarators = []
          })
        }
      }
    }
  }
}
