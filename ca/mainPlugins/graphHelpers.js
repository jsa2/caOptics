const { default: axios } = require("axios")
const chalk = require("chalk")
const { argv } = require("yargs")
const { axiosClient } = require("../../tokenHandler/axioshelpers")
const { axiosClient2 } = require("./axiosh")
const { newSetA } = require("./grouper")
const { getGraphTokenReducedScope } = require("./tokenHandler")
const waitForIt = require('util').promisify(setTimeout)


async function appResolver (oids) {

    let token = await getGraphTokenReducedScope()
    let count = 0
    let promiseArray = []

    for await (let id of new Set(oids)) {
        count++
        console.log(count)
        // Throttling state 
        if (count % 30 == 0) {
            await waitForIt(1000)
            console.log('waiting')
        }
        //  Get any object in Graph by ID
        let opt = {
            url:`https://${argv.altGraph || "graph.microsoft.com"}/v1.0/serviceprincipals?$search="appId:${id}"&$select=appid,displayName,id`,
            headers:{
                authorization: `Bearer ${token}`,
                ConsistencyLevel:"eventual"
            }
        }
        // Push objects to array that shall be resolved on later stage
        promiseArray.push(getRightAxiosData(opt))
        

    }

    // Resolve array
    let respo = await Promise.all(promiseArray)
   // console.log(respo)
   // console.log('wait done')

 


    return respo?.map(s => s?.value).flat() || ['failed']
}

async function objectResolver (oids) {

    let token = await getGraphTokenReducedScope()
    let count = 0
    let promiseArray = []

    for await (let id of new Set(oids)) {
        count++
        console.log(count)
        // Throttling state 
        if (count % 30 == 0) {
            await waitForIt(1000)
            console.log('waiting')
        }
        //  Get any object in Graph by ID
        let opt = {
            url:`https://${argv.altGraph || "graph.microsoft.com"}/v1.0/directoryObjects/${id}`,
            headers:{
                authorization: `Bearer ${token}`
            }
        }
        // Push objects to array that shall be resolved on later stage
        promiseArray.push(getRightAxiosData(opt))
        

    }

    // Resolve array
    let respo = await Promise.all(promiseArray)
   // console.log(respo)
   // console.log('wait done')

 


    return respo || ['failed']
}

async function getRightAxiosData (opt) {

    try { 
        let {data} = await axios(opt) 
        return data
    } catch(error) {
        return error?.response?.data
    }
   
}

let groupOperations = 0
async function graphListS2 (token, operation, skiptoken, responseCollector) {

    var options = {
        responseType: 'json',
        "method": "get",
        url:`https://${argv.altGraph || "graph.microsoft.com"}/v1.0/${operation}`,
        headers:{
            'content-type':"application/json",
            authorization:"bearer " + token
        }
    }

    let ref = operation

    if (skiptoken) {
        options.url = skiptoken
    }

//console.log(options)

if (operation.match('e051cf')) {
    console.log()
}
    
var data = await axiosClient2(options).catch((error) => {
    console.log(error?.error?.message)
})

console.log(chalk.green(`getting results for groups ${operation} - previous result size:',${data.value.length}`))

if (data['@odata.nextLink']) {
    groupOperations++
    console.log('total group calls to graph', groupOperations)
    console.log(chalk.green(`getting results for groups ${operation} - previous result size:',${data.value.length}`))
    data.value.forEach((item) => responseCollector.push(item))
   // console.log(data['@odata.nextLink'])
    await graphListS2(token,operation,data['@odata.nextLink'],responseCollector)

}
else {
    data.value.forEach((item) => responseCollector.push(item))
}
return {ref, responseCollector:responseCollector.flat()}

}



async function graphListS (token, operation, skiptoken, responseCollector) {

    var options = {
        responseType: 'json',
        "method": "get",
        url:`https://${argv.altGraph || "graph.microsoft.com"}/v1.0/${operation}`,
        headers:{
            'content-type':"application/json",
            authorization:"bearer " + token
        }
    }

    let ref = operation

    if (skiptoken) {
        options.url = skiptoken
    }

console.log(options)
    
var data = await axiosClient2(options).catch((error) => {
    console.log(error?.error?.message)
})


if (data['@odata.nextLink']) {
    console.log('getting results:',data.value.length)
    data.value.forEach((item) => responseCollector.push(item))
   // console.log(data['@odata.nextLink'])
    await graphListS(token,operation,data['@odata.nextLink'],responseCollector)

}
else {
    data.value.forEach((item) => responseCollector.push(item))
}
return {ref, responseCollector:responseCollector.flat()}

}


module.exports={objectResolver,graphListS,graphListS2,appResolver}