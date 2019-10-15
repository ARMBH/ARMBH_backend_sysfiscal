const fs = require('fs')
const path = require('path')

const css = fs.readFileSync(path.resolve(__dirname, 'template.html'), 'utf8')

console.log(typeof css)