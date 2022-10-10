const { iteratePolicyKeys } = require("../mainPlugins/getPol")

// Handle all clientApp conditions
/*  */

module.exports=async function (policy,conditions,plugin) {

    if (conditions.length == 0) {
        return []
    }

  let def=  [
        "android",
        "iOS",
        "windows",
        "windowsPhone",
        "macOS",
        "linux",
      ]

      let included = iteratePolicyKeys('includePlatforms',policy,[])[0]?.includePlatforms

      if (included.includes('all')) {
        included = def
      } 

    let excluded = iteratePolicyKeys('excludePlatforms',policy,[])[0]?.excludePlatforms
    let results = []
    

   let iteration = def.filter( def => !included.includes(def))
   excluded?.filter(e => !iteration.includes(e)).forEach(r => iteration.push(r))
/*    included.forEach(is => iteration.push(is))
 */
   //console.log(iteration)




   return iteration.map(item => `${plugin}:${item}`)
    

    }