const { iteratePolicyKeys, iteratePolicyKeyNonArray } = require("../../mainPlugins/getPol")
const { inMemoryList } = require("../../mainPlugins/inMemList")
const {argv} = require("yargs");



module.exports= function (lookup, innerPol,currentPolicy) {

    const list = inMemoryList()
    let res = []
    innerPol.forEach(policy => {

     
       try {
        let terminated = false

        let nestedInclude =  iteratePolicyKeys('include',iteratePolicyKeyNonArray('users',policy,[]),[]) 
        let nestedExclude =  iteratePolicyKeys('exclude',iteratePolicyKeyNonArray('users',policy,[]),[]) 
    //    require('fs').writeFileSync('string.json',JSON.stringify(nestedInclude))
        if (JSON.stringify(nestedInclude) == JSON.stringify([{"includeUsers":["All"]}])) {
            terminated = true
        }

        if (JSON.stringify(nestedInclude).match(lookup[1])) {
            terminated = true
        }

        //keep for debugging
        /* if (lookup[1] == "All" && policy.displayName.match('Baseline')) {
            console.log()
        } */

        if (JSON.stringify(nestedExclude).match(lookup[1])) {
            terminated = false
            return res
        }

       
         // double checks via mapping if unterminated permutations 
        if (argv.mapping && (nestedInclude?.length > 0 ||nestedExclude?.length > 0 )) {

            let inLink = ['includeUsers','includeGroups','includeRoles']
            .map(type => iteratePolicyKeys(type,nestedInclude,[]).map( s=> s?.[type].map( ts => `${ts}:${lookup[1]}`) )
            .flat() )
            .flat()
              

            let unLink = ['excludeUsers','excludeGroups','excludeRoles']
            .map(type => iteratePolicyKeys(type,nestedExclude,[]).map( s=> s?.[type].map( ts => `${ts}:${lookup[1]}`) )
            .flat() )
            .flat()
                     

            

             //keep for debugging
       /*  if (lookup[1] == "c66aad40-1dee-43c2-810b-77532250bfc8" && policy.displayName.match('francies')) {
            console.log()
        } */

            if ( inLink.find( link => list.includes(link)) ) {
                terminated=true
            }

            if ( unLink.find( link => list.includes(link) ) ) {
                
                terminated=false
            }
          

        
          
        }
        
        if (terminated == true) {
            res.push(policy)
        }
        
        
       } catch(error) {
        console.log(error)
       }

    })
   

             return res
  }
      