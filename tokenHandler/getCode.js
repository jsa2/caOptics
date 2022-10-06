
const chalk = require('chalk')
const {argv} = require('yargs')
const {axiosClient} = require('./axioshelpers')
const tsto= require('util').promisify(setTimeout)


async function azCLI () {

var data={
    client_id:argv.client || "04b07795-8ddb-461a-bbee-02f9e1bf7b46",
    scope: argv.scope ||  "openid offline_access" 
}

var opt = {
    method:"post",
    url:`https://login.microsoftonline.com/${argv?.tid || "common"}/oauth2/v2.0/devicecode?api-version=1.0`,
    data
}
let errorP 
    var at = await axiosClient(opt, true).catch((error) => {
       errorP =error
    })

if (errorP) {
    console.log(errorP)
    return;
}

    console.log(chalk.green(at?.data?.message))

   // console.log(at?.data)
    var i = 0
    do {
        
        data.grant_type="device_code",
        data.code=at?.data?.device_code
        opt.url="https://login.microsoftonline.com/common/oauth2/v2.0/token"
        delete opt.data; opt.data = data
       
        i++
        var loop = await axiosClient(opt,true).catch((error) => {
            console.log(chalk.bgCyan.whiteBright(error?.response?.data?.error))
        })
        await tsto(2000)
    /*     console.log(i)
      console.log(i < 10) */
    } while ( i < 15 && !loop?.data?.access_token)

     if (!loop?.data?.access_token) {
        throw new Error('Unable to retrieve access token')
     }
    console.log('iterations done')
  //  console.log(loop?.data || 'no token')
    require('fs').writeFileSync('tokenHandler/rt.json',JSON.stringify(loop?.data))
    return loop?.data?.access_token
}

module.exports=  {azCLI}
