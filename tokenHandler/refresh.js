const {argv} = require('yargs')
const {axiosClient} = require('./axioshelpers')
const waitForIt = require('util').promisify(setTimeout)

async function rToken () {

    let refresh_token = require('./rt.json')?.refresh_token

    let data={
        client_id:argv.client || "04b07795-8ddb-461a-bbee-02f9e1bf7b46",
        scope: argv.scope ||  "Directory.AccessAsUser.All",
        refresh_token,
        grant_type:"refresh_token"
    }

    let opt = {
        method:"post",
        url:`https://${argv.altLogin || "login.microsoftonline.com"}/common/oauth2/v2.0/token`,
        data
    }

    let  {data:tokenResponse} = await axiosClient(opt,true).catch((error) => {
        console.log(error?.response?.data)
    })

    require('fs').writeFileSync('./tokenHandler/token.json',JSON.stringify(tokenResponse?.access_token))

    // when getting access token wait for a certain time before continuing
    await waitForIt(500)
    return tokenResponse?.access_token


}

module.exports={rToken}