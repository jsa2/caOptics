
// Handle all evaluator conditions

const { argv } = require("yargs")

const { iteratePolicyKeys } = require("../mainPlugins/getPol")


module.exports=async function (policy,conditions,plugin) {

  results = []

  const list = ['includeUsers','excludeUsers','includeGroups','excludeGroups','includeRoles','excludeRoles'].map(type => {
    let values = iteratePolicyKeys(type,policy,[]).map( s=> s?.[type]).flat()

    return values.filter(s => s?.length !== 0)
    
}).flat()

// Push "All" always to create proper lookup

if (!list.includes('All') && !list.includes('GuestsOrExternalUsers')) {
  list.push('GuestsOrExternalUsers')
}

list.push('All')

console.log(list)
let clean = []
new Set(list).forEach( s=> clean.push(s) )

if (argv.skipObjectId) {
  let noList = argv.skipObjectId.split(',')
  clean = clean.filter( s => !noList.find( l => s == l)) 
}


if (argv?.skip) {
  if (argv?.skip.split(',').includes('users')) {
    return;
    }
}

return clean.map(item => `${plugin}:${item}`)
  

  }

