const unPopulated = require("./findEmptySub")

/* unPopulated test */


var globalExit
var recursiondepth = 1
var globalList = []

async function getPermutations (g) {

    // Sort is placed to ensure certain termination order
    g.sort((a,b) => {
       
        if (a.toLowerCase()< b.toLowerCase()) {
            return -1
        }
    
        if (a.match('users:') ) {
            return -1
        }

       /*  if (a.match('clientAppTypes:') && !b.match('users:') && !b.match('locations:') ) {
            return -1
        } */

    })
    rcPerm(g)
    return globalList
}


function rcPerm(list, subItem) {

    if (globalExit) {
        return globalList
    }
    // new set here is redundant, (for uniqueness, but keeping this for documentation)
    for (let item of new Set(list.map(s => s.split(':')[0]))) {

        if (globalExit) {
            return 
        }

        if (subItem) {
            recursiondepth++
            console.log(recursiondepth)
            let nested = list.filter(subItem => subItem.match(item)).map(rootItem => {
                return {
                    rootItem,
                    subItems: []
                }
            })
            let outerList = list.filter(subItem => !subItem.match(item))
            
            if (nested.length > 0 ) {
                if (recursiondepth == 4) {
                    console.log()
                }
                let altSub = unPopulated(subItem,nested)
              /*   subItem.map(ins => ins.subItems = nested) */

              if (outerList.length == 0) {
                globalExit=true
                globalList=altSub
                return 
            }
            
                rcPerm(outerList, altSub)
            
               

            }
            
        } else {
            if (globalExit) {
                return 
            }
         //   console.log(globalExit)
            let innerList = list.filter(subItem => subItem.match(item))
            let outerList = list.filter(subItem => !subItem.match(item))

            if (innerList.length > 0 && !globalExit) {

                let goForward = innerList.map(rootItem => {
                    return {
                        rootItem,
                        subItems: []
                    }
                })


                rcPerm(outerList, goForward)

            }
        
        }



    }

return ;
}


module.exports={getPermutations}


















