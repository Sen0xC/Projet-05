const fs = require('fs')
const path = require('path')

module.exports = function (directory, extension, callback) {
  fs.readdir(directory, function (err, list) {
    if (err) {
      return callback(err)
    }
    
    // Filter files by extension
    const filteredList = list.filter(function (file) {
      return path.extname(file) === '.' + extension
    })
    
    callback(null, filteredList)
  })
}