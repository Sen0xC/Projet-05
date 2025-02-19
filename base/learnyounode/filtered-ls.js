const fs = require('fs')
const path = require('path')

// Get directory path and extension from command line arguments
const directory = process.argv[2]
const extension = process.argv[3]

// Read directory contents asynchronously
fs.readdir(directory, function (err, list) {
  if (err) {
    return console.error(err)
  }
  
  // Filter files by extension and print them
  list.forEach(function (file) {
    if (path.extname(file) === '.' + extension) {
      console.log(file)
    }
  })
})
