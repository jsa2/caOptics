
//

var  counts = 0

const global = []
var stopAfter 
const v8 = require('v8')
const { argv } = require('yargs')



 function permutationList (list) {
  stopAfter = list.filter( s => s.match('users:'))
   list.sort((a,b) => {
    if (a.match('users:')) {
        return -1
    }
   }) 
   let top = rootLister(list,global)
  // console.log(global)
console.log('total cross condition permutations',counts)

return global
  /*  */


  let filtered = top.filter(s => s?.rootItem.match('users'))

  return filtered
}

function rootLister (list,fnl) {
/*     list = list.filter(s => !undefined) */
    for  (let rootItem of list) {

        if (global.length == stopAfter.length) {
            return;
            
        }

        let procd = rootItem.split(':')
        let rootItemType = procd[0]
        let query = {
            rootItem,
            subItems:[procd[0]]
        }
    
        list.forEach( subItem => {

            subItemType = subItem.split(":")[0]
            if (!query.subItems.includes(subItem) && subItemType !== rootItemType) {
                query.subItems.push(subItem)
            }

           
    
        })
        query.subItems = query.subItems.slice(1)
        if (query?.subItems.length > 0) {
           counts = counts+ query.subItems.length

           if (counts % 10000 == 0 && argv.debug) {
            //
            let hstats = v8.getHeapStatistics()
            console.log(counts)
            console.log('running key of', global.length, 'of / ', stopAfter.length)
            console.log((`Memory usage at: ${hstats.used_heap_size/(1024*1024)} for permutationsPerPolicy`))
            console.log('heap size: ',hstats.heap_size_limit/(1024*1024))
            console.log('heap used: ',hstats.used_heap_size/(1024*1024))
            
           }
           

           let moreSub = rootLister(query.subItems,[])
           query.subItems = moreSub
        }
        fnl.push(query)
       
    
    }
    return fnl
}





module.exports={permutationList}