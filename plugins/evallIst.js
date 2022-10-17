
async function evalLists (itemType, policies,currentPolicy) {

    let innerPol = policies
    let lookup =itemType.split(':') || []

    try {
   
       return await require(`../ca/conditions/eval/${lookup[0]}.js`)(lookup, policies, currentPolicy)
      
    } catch (error) {
        console.log(error)
        return []
    }


} 

module.exports={evalLists}