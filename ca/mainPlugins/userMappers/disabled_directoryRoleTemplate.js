
const { axiosClient } = require("../../../tokenHandler/axioshelpers")
const { axiosClient2 } = require("../axiosh")
const { graphListS } = require("../graphHelpers")
const { getGraphTokenReducedScope } = require("../tokenHandler")
const waitForIt = require('util').promisify(setTimeout)

module.exports= async function (notUsed) {

    let token = await getGraphTokenReducedScope()

    let opt = {
        responseType: "json",
        method: "get",
        url: "https://graph.microsoft.com/v1.0/directoryRoles/",
        headers:{
            authorization: `Bearer ${token}`
        }
    }   
      
    let {value:roles} = await axiosClient2(opt).catch( error => {
        console.log(error)
    })

   



    
 
    let count = 0
    let promiseArray = []

    for await (let item of roles) {
        count++
        console.log(count)
        // Throttling state 
        if (count % 1 == 0) {
            await waitForIt(1000)
            console.log('waiting')
        }
   
        promiseArray.push(graphListS(token,`directoryRoles/${item.id}/members`,undefined,[]))
        
    }

  
    let respo = await Promise.all(promiseArray)
 
 console.log(respo)


//  group handler
}