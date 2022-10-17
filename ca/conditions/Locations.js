
// Handle all evaluator conditions

const { getLocations, iteratePolicyKeys } = require("../mainPlugins/getPol")

/* 
1. Case one, just excluded location for trusted
2. 
*/
module.exports=async function (policy,conditions,plugin) {

   //console.log('policy being checked',policy?.displayName)
   if (conditions?.length == 0) {
      return []
   }

    let results = []
    let locations = await getLocations()
    let included = iteratePolicyKeys('includeLocations',policy,[])[0]?.includeLocations?.filter(s => locations.find(d => d?.id == s && !d?.isTrusted))
    let excluded = iteratePolicyKeys('excludeLocations',policy,[])[0]?.excludeLocations?.filter(s => locations.find(d => d?.id == s && !d?.isTrusted))

     // check evaluators for incomplete inclusions
  
     if (!included?.includes('All') && (included?.length > 0)) {
      // exclude also the included for later stage review
      
      included.forEach( s=> results.push(s))
      results.push('All')
      //included?.forEach(s => results.push(s))
      excluded?.forEach(s => results.push(s))


     } else  {
      excluded?.forEach(s => results.push(s))
     }

   return results.map(item => `${plugin}:${item}`)
    

    }                