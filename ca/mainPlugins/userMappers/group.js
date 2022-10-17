
const { graphListS2 } = require("../graphHelpers")
const { getGraphTokenReducedScope } = require("../tokenHandler")
const waitForIt = require('util').promisify(setTimeout)


module.exports= async function (groups) {
let all = []
for await (let group of groups.items)   {
    let depth = 0
    let rootGroup = group.id
    let respo = await IteraBl([group],[],depth)
    respo.flat().map( r =>  r.ref = rootGroup)
    all.push(respo.flat())
    
}  

let flatObjectsToInMem = require('../../../objectIds.json')


 let links = all.flat().map(item => {
   
    let itemToLink = item?.ref
    item.responseCollector.forEach(d => flatObjectsToInMem.push(d))
    return item.responseCollector.map( r => `${itemToLink}:${r?.id}` )

 }).flat()
 
 require('fs').writeFileSync('objectIds.json',JSON.stringify(flatObjectsToInMem.flat()))


    return links
//  group handler
}



async function IteraBl (groups, responseCollector,depth) {

let iter = groups

let respo = await groupHandler(iter)

responseCollector.push(respo)
if (depth < 1) {
    // limit nesting depth, as some groups can have ciruclar depedency (be members of each other)
    depth++
    for await (let sub of respo) {
    
        let groups = sub?.responseCollector.filter(s => s?.['@odata.type'] == '#microsoft.graph.group' )
        
        if (groups?.length > 0 ) {
             await IteraBl(groups,responseCollector,depth)
        }
          
     }

}


return responseCollector

}


var count = 0

async function groupHandler (groups,) {

    let token = await getGraphTokenReducedScope()
    
    let promiseArray = []

    for await (let item of groups) {
        count++
        //console.log(count)
        // Throttling state 
        if (count % 10 == 0) {
            await waitForIt(1000)
            console.log('waiting for group resolving')
        }

        console.log(item?.id,item?.description)
        if (item?.id == '85d7d239-94ea-40fb-9826-6bfa47e90398') {
            console.log()
        }
        
        // Push objects to array that shall be resolved on later stage
        promiseArray.push(graphListS2(token,`groups/${item?.id}/members?$top=999`,undefined,[]))
        

    }

    // Resolve array
    return await Promise.all(promiseArray)

}