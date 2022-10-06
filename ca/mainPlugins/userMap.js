
const { iteratePolicyKeys } = require("./getPol")
const { objectResolver, appResolver } = require("./graphHelpers")
const { newSetA } = require("./grouper")
const { inMemoryList } = require("./inMemList")
const waitForIt = require('util').promisify(setTimeout)

async function userMap (policies) {

try {
    require('../../objectIds.json')
    require('../../appIds.json')
    inMemoryList(require('../../inMemoryResults.json'))
    console.log('cache loaded from memory')
    return;
} catch (error) {
    console.log('no existing cache')
}

const oids = []


const list = ['includeUsers','excludeUsers','includeGroups','excludeGroups','includeRoles','excludeRoles'].map(type => {
    let values = iteratePolicyKeys(type,policies,[]).map( s=> s?.[type]).flat()
    values.filter(s => s !== 'GuestsOrExternalUsers' && s !== 'All').forEach(s => oids.push(s))
    return {
        type,
        values,
    }
    
})

const apps = ['includeApplications','excludeApplications'].map(type => iteratePolicyKeys(type,policies,[]).map( s=> s?.[type]).flat()).flat()

console.log(apps)

let d = await appResolver(apps)

let r = await objectResolver(oids)

require('fs').writeFileSync('objectIds.json',JSON.stringify(r.flat()))
require('fs').writeFileSync('appIds.json',JSON.stringify(d.flat()))

let gr = newSetA(r,['@odata.type'])
//stable

let promiseArray =[]
for await (plugin of gr.filter(s => s?.group == '#microsoft.graph.group')) {
   // console.log(plugin)
    let pluginType = plugin.group.split('microsoft.graph.')[1]
    var count = 0
    for (group of plugin?.items) {
        count++

        if (count % 2 == 0) {
            console.log('throttling main operations for groups')
            await waitForIt(1500)
        }

       let altItem ={
        group: "#microsoft.graph.group",
        items: [
          group
        ],
        property: "@odata.type",
      }
        promiseArray.push(require(`./userMappers/${pluginType}.js`)(altItem)) 
    }
    
        //Only for debugging 
        //require('fs').writeFileSync('link.json',JSON.stringify(gr))
       /*  results.forEach( s => require('fs').appendFileSync('link2.txt', `${s}\r\n`))
        */
        

   
}

let results = await (await Promise.all(promiseArray)).flat()

require('fs').writeFileSync('inMemoryResults.json',JSON.stringify(results))


inMemoryList(results)

return r



}

module.exports={userMap}