
const chalk = require('chalk')
const {randomUUID} = require('crypto')
const { writeFileSync, appendFileSync } = require('fs')
const { argv } = require('yargs')
const beautify = require('js-beautify').js


function rp (perms,cross, unparsed) {

    const namedLocations = require('./namedLocations.json')
    var objectIdMap
    var appMap
    
    try { objectIdMap = require('./objectIds.json')} catch (error) {
      console.log('no user mapping')
    }

    try { appMap = require('./appIds.json')} catch (error) {
      console.log('no app mapping')
    }

   
    var table = `Policy | Terminations | lookup \r\n -|-|- \r\n`
    var details = "\r\n ## Permutations \r\n"
    var csvReportHeader ="users,Applications,clientAppTypes,Platforms,locations \r\n"

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

      let details 
      if (item.terminated.length == 0) {
          details = `${item.lineage}`
      } else {
        details = `${item.lineage}`
        //details = []
      }

      if (JSON.stringify(details).match('users:') && cross && !JSON.stringify(details).match('Guests')) {
        
        let id = details.split('users:')[1].split(' ->')[0]
        if (id !== "All") {
          
          let resolved = objectIdMap?.find( s=>  s?.id == id ) 

          if (!resolved) {
      
          } else {
            details = details.replace(id,`${resolved['@odata.type'].split('#microsoft.graph.')[1]}-${resolved?.displayName}`)
          }
        }
        
      }

      if (JSON.stringify(details).match('Applications:') && cross && appMap) {
        
        let appId = details.split('Applications:')[1].split(' ->')[0]
        if (appId !== "All") {
          
          let resolved = appMap?.find( s=>  s?.appId == appId ) 

          if (!resolved) {
      
          } else {
            details = details.replace(appId,resolved?.displayName)
          }
        }
        
      }

      if (JSON.stringify(details).match('Locations:') && cross ) {
        let id = details.split('Locations:')[1].split(' ->')[0]
        if (id !== "All") {
          
          let resolved = namedLocations?.find( s=>  s?.id == id ) 

          if (!resolved) {
      
          } else {
            details = details.replace(id,resolved?.displayName)
          }
        }
      }


     
      if (cross) {
        table+=`${item?.policy}| ${item.terminated?.length} | ${details} \r\n`
      } else if (unparsed) { 
        table+=`${item?.policy}|  ${item.terminated}| ${details.replace(new RegExp(',','g'),' -> ')} \r\n`
      } 
        else      
      {

        table+=`${item?.policy}| [${item.guid}](#${item.guid})| ${item.terminated.length || item.terminated}| ${details} \r\n`
        var sd = beautify(JSON.stringify(item),{ indent_size: 2, space_in_empty_paren: true })
        details+="\r\n"  
        details+="\r\n"
        details+=`### ${item.guid}`
        details+="\r\n"  
        details+="\r\n"
        details+=`\`\`\`json \r\n ${sd} \r\n \`\`\`\r\n`
        details+="\r\n"
        details+="\r\n"
        details+="\r\n"

      }

       

    }
   
    if (cross) {
      writeFileSync('crosstable.md',table)

    //appendFileSync('crosstable.md',details)
    } else {
      writeFileSync('table.md',table)

    appendFileSync('table.md',details)
    }

    
    

}

module.exports={rp}