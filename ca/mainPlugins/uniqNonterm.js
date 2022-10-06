const chalk = require("chalk")
const v8 = require('v8')
const { argv } = require("yargs")


function nonTerm(items) {

    let unq = []
    // let c =items.filter(f => f?.terminated.length == 0)
    let cd = 0
    items.map(s => {

        cd++

        if (cd % 10000 == 0 && argv.debug) {
            console.log(`${cd} of items ${items?.length}`)
            let hstats = v8.getHeapStatistics()
            console.log((`Memory usage at: ${hstats.used_heap_size / (1024 * 1024)} for uniqNonterm.js`))
            console.log('heap size: ', hstats.heap_size_limit / (1024 * 1024))
            console.log('heap used: ', hstats.used_heap_size / (1024 * 1024))
        }

        let lineage = s?.lineage.split(' -> ').filter(s => s !== '').sort((a, b) => {
            if (a < b) {
                return -1
            }
        })

        let arrT = {
            terminated: s?.terminated?.length,
            lineage,
            policy: "All"
        }


        if (unq.includes(JSON.stringify(arrT))) {

        } else {
            unq.push(JSON.stringify(arrT))
        }

    }

    )

    return unq



}



module.exports = { nonTerm }