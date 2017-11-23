var fs = require('fs');
var babel = require('babel-core');

var fileName = process.argv[2];

babel.transformFileSync(fileName, {
  plugins: [['../../lib/index.js',{
    input: 'test/builders/*.js',
    output: 'test/reducers/*.js'
  }]]
})
