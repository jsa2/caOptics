
// Handle all clientApp conditions

const { iteratePolicyKeys } = require("../mainPlugins/getPol")


module.exports=async function (policy,conditions,plugin) {


    if (conditions?.length == 0) {
       return []
    }
 
     let results = []


     let included = iteratePolicyKeys('includeApplications',policy,[])[0]?.includeApplications
     let excluded = iteratePolicyKeys('excludeApplications',policy,[])[0]?.excludeApplications
 
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

      let final =[]
      new Set(results).forEach(item => final.push(`${plugin}:${item}`))
    
 
    return final

  
     
 
     }   