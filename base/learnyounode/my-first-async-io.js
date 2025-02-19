const fs = require('fs')

// Get the file path from command line arguments
const filePath = process.argv[2]

// Read the file asynchronously
fs.readFile(filePath, 'utf8', function (err, contents) {
  if (err) {
    return console.error(err)
  }
  // Count newlines by splitting the string and subtracting 1
  const lines = contents.split('\n')
  console.log(lines.length - 1)
})
