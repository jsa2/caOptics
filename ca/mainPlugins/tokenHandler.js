
const { exec } = require('child_process')
var fs = require('fs')
const { decode } = require("jsonwebtoken")
var path = require('path')
const { azCLI } = require('../../tokenHandler/getCode')
const { rToken } = require('../../tokenHandler/refresh')
const wexc = require('util').promisify(exec)
const chalk = require("chalk");
const { stdout } = require('process')
const { argv } = require('yargs')



async function getGraphTokenReducedScope() {

    try {

        const token = require('../../tokenHandler/token.json')
        const decoded = decode(token)
        const now = Date.now().valueOf() / 1000
        //https://stackoverflow.com/a/55706292 (not using full verification, as the token is not meant to be validated in this tool, but in Azure API)
        if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
            throw new Error(`token expired: ${JSON.stringify(decoded)}`)
        }
        if (typeof decoded.nbf !== 'undefined' && decoded.nbf > now) {
            throw new Error(`token expired: ${JSON.stringify(decoded)}`)
        }

        return token

    } catch (error) {

        var token
        try {


            try {
                token = {}
                let {stdout} = await wexc(`az2 account get-access-token --scope=https://${argv.altGraph || "graph.microsoft.com"}/Directory.AccessAsUser.All --query accessToken --output json`)
                token.access_token =""                
                token.access_token = JSON.parse(stdout)
                require('fs').writeFileSync('tokenHandler/token.json',JSON.stringify(token.access_token))
                token = token.access_token
            } catch (error) {
                console.log(chalk.red('no AZ CLI installed, or no existing session on AZ CLI - falling back to AZ CLI clientId'))
                token = await rToken()
            }
           
    
        } catch (error) {
            console.log(chalk.yellow('no existing session, please sign-in'))
           
           try {
            await azCLI()
            token = await rToken()
           } catch(error) {
            throw Error(error?.message)
           }

            
        }
        
        if (token) {
            
        } else {
            throw Error('failed at getting token')
        }
        
        return token || error

    }


}

module.exports={getGraphTokenReducedScope}