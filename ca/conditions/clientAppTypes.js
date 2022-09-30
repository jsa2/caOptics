
// Handle all evaluator conditions

const { argv } = require("yargs")


module.exports=async function (policy,conditions,plugin) {

    let results = []
    let evaluator = conditions[0][plugin]
     // check evaluators for incomplete inclusions
  
     if (!evaluator.includes('all')) {

       /*  if (!evaluator.includes('browser')) {
            results.push('browser')
        }
        if (!evaluator.includes('mobileAppsAndDesktopClients')) {
            results.push('mobileAppsAndDesktopClients')             
        } */

        results.push('mobileAppsAndDesktopClients')   
        results.push('browser')

        if (argv.includeLegacyAuth) {
          results.push('other')
          results.push('exchangeActiveSync')
        }
       


     }

   return results.map(item => `${plugin}:${item}`)
    

    }