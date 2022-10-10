
const { randomUUID } = require("crypto");

randomUUID()


let existing = require('./inMemoryResults.json')

for (let i = 0; i < 140000; i++) {
    existing.push(`${randomUUID()}:${randomUUID()}`)
}

console.log(existing)

require('fs').writeFileSync('inMemoryResults.json',JSON.stringify(existing))

