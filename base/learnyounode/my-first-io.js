const fs = require('fs')

// Get the file path from command line arguments
const filePath = process.argv[2]

// Read the file synchronously
const contents = fs.readFileSync(filePath)

// Convert buffer to string and count newlines
const lines = contents.toString().split('\n')

// Since the last line doesn't have a newline, we subtract 1 from the length
console.log(lines.length - 1)