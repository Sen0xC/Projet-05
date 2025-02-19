const numbers = process.argv.slice(2).map(n => +n);
console.log(`The minimum of [${numbers}] is ${Math.min(...numbers)}`);
