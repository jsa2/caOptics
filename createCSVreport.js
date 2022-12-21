
const chalk = require('chalk')
const {randomUUID} = require('crypto')
const { writeFileSync, appendFileSync, fstat, unlinkSync } = require('fs')
const { argv } = require('yargs')
const beautify = require('js-beautify').js


function rpCsv (perms,cross, unparsed,filename,expandFlags) {

  try {
    unlinkSync(`${filename}.csv`)
  } catch(error) {
console.log('')
  }

    const namedLocations = require('./namedLocations.json')
    var objectIdMap
    var appMap
    
    try { objectIdMap = require('./objectIds.json')} catch (error) {
      console.log('no user mapping')
    }

    try { appMap = require('./appIds.json')} catch (error) {
      console.log('no app mapping')
    }

    var csvReportHeader ="users,Applications,clientAppTypes,Platforms,locations,terminations, lineage \r\n"
    appendFileSync(`${filename}.csv`,csvReportHeader)
   
  

    if (unparsed) {
      perms = perms.map( g => JSON.parse(g))
      let unTerminated = perms.filter(s => s?.terminated == 0)
      console.log(chalk.red(`Unterminated permutations: ${unTerminated.length}`))
    } else {
      let unTerminated = perms.filter(s => s?.terminated == 0)
      console.log(chalk.red(`Unterminated permutations: ${unTerminated.length}`))
    }

 
    perms.map( g => g.guid = randomUUID().replace(new RegExp('-','g',),'') )
    
  
    let sorted = perms.sort((a,b) => {
      if ( (a.terminated?.length || a.terminated) < (b?.terminated.length || b.terminated)) {
        return -1
      }
    })

   // console.log(sorted)
    let cn = 0
    for (let item of sorted) {

      cn++
    if (cn % 1000 == 0) {
      console.log(cn, 'of /', sorted.length)
    }
    
      let csvBody =""
      let details = item?.lineage
  
      if (JSON.stringify(details).match('users:')) {
        let id = details.split('users:')[1].split(' ->')[0]
        let resolved = objectIdMap?.find( s=>  s?.id == id ) 
        if (resolved) {

          if (argv.expand && expandFlags?.length > 0) {

            let flagged = expandFlags.find( s => s?.split('users:')[1] == id)  

            if (flagged) {
              id = id.replace(id,`${resolved['@odata.type'].split('#microsoft.graph.')[1]}-${resolved?.displayName} -flagged via expand option`)
            } else {
              id = id.replace(id,`${resolved['@odata.type'].split('#microsoft.graph.')[1]}-${resolved?.displayName}`)
            }
          } else {
            id = id.replace(id,`${resolved['@odata.type'].split('#microsoft.graph.')[1]}-${resolved?.displayName}`)
          }

          
       
          csvBody+=`"${id}",`
        } else {  csvBody+=`"${id}",`}
      } else {
        csvBody+=","
      }

      if (JSON.stringify(details).match('Applications:')) {
        let id = details.split('Applications:')[1].split(' ->')[0]
        let resolved = appMap?.find( s=>  s?.appId == id ) 
        if (resolved) {
          id = id.replace(id,resolved?.displayName)
          csvBody+=`"${id}",`
        } else {  csvBody+=`"${id}",`}
      } else {
        csvBody+=","
      }

      if (JSON.stringify(details).match('clientAppTypes:')) {
        let id = details.split('clientAppTypes:')[1].split(' ->')[0]
          csvBody+=`"${id}",`
      } else {
        csvBody+=","
      }

      if (JSON.stringify(details).match('Platforms:')) {
        let id = details.split('Platforms:')[1].split(' ->')[0]
          csvBody+=`"${id}",`
      } else {
        csvBody+=","
      }

      if (JSON.stringify(details).match('Locations:')) {
        let id = details.split('Locations:')[1].split(' ->')[0]
        let resolved = namedLocations?.find( s=>  s?.id == id ) 
        if (resolved) {
          id = id.replace(id,resolved?.displayName)
          csvBody+=`"${id}",`
        } else {  csvBody+=`"${id}",`}
      } else {
        csvBody+=","
      }


     csvBody+=`${item?.terminated?.length},`
     csvBody+=`"${item?.lineage}"`
     csvBody+="\r\n"


     appendFileSync(`${filename}.csv`,csvBody)
     

       

    }
   
  

    
    

}

module.exports={rpCsv}