const axios = require('axios')
const qs = require('querystring')

async function axiosClient (options, urlencoded, debug) {

    if (urlencoded == true) {
        options.data = qs.stringify(options.data)
    }
    if (debug) {
        console.log(options)
    }

    var data = await axios(options).catch((error) => {

        return Promise.reject(error)

    })
    
    return data

}


module.exports = {axiosClient}