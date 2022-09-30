const axios = require('axios')
const qs = require('querystring')

async function axiosClient2 (options, urlencoded, debug) {

    if (urlencoded == true) {
        options.data = qs.stringify(options.data)
    }
    if (debug) {
        //console.log(options)
    }

    var data = await axios(options).catch((error) => {
    /*     console.log(error?.Error) */
        return Promise.reject(error?.response?.data || error?.response?.status || error?.message)

    })
    
    return data?.data || data.status

}

module.exports = {axiosClient2}