const fs = require('fs')
const path = require('path')


function clearPolicyCache() {
 
    try {
        fs.unlinkSync(path.resolve(__dirname,'../../policies.json'))
    } catch (error) {
        console.log('no policies to remove')
    }
    fs.unlinkSync(path.resolve(__dirname,'../../namedLocations.json'))
    try {} catch (error) {
        console.log('no locations to remove')
    }
   
    
    return;
}

function clearTokenCache() {
 
    try {
        fs.readdirSync('./tokenHandler/').filter(s => s.match(".json")).map(d => fs.unlinkSync(`./tokenHandler/${d}`))
    } catch (error) {
        console.log('no tokens to remove')
    }

    return;
}

module.exports= {clearPolicyCache,clearTokenCache}