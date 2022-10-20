const { default: axios } = require('axios')
const chalk = require('chalk')

//getGraphTokenReducedScope
const fs = require('fs')
const { argv } = require('yargs')
const { evalLists } = require('../../plugins/evallIst')
const { getGraphTokenReducedScope } = require('./tokenHandler')
const v8 = require('v8')




async function nTerminatedPolicyConditionsLookupFull(perm, refPol) {
    const ret = []
    var count = 0
    for await (let pol of perm) {
        //console.log(pol)
        const { toProcessingPipeline } = pol
        /*       let innerPol = refPol.filter(p => p?.id !== pol?.policy?.id ) */
        let innerPol = refPol

        for await (let indiv of toProcessingPipeline) {
            if (argv.debug) {

                let hstats = v8.getHeapStatistics()
                console.log((`Memory usage at: ${hstats.used_heap_size/(1024*1024)} for nTerminatedPolicyConditionsLookupFull`))
                console.log('heap size: ',hstats.heap_size_limit/(1024*1024))
                console.log('heap used: ',hstats.used_heap_size/(1024*1024))

            }

            count++
            console.log('checking main key', indiv?.rootItem, count, ' of ', toProcessingPipeline?.length)

            let lineage = ""
            let terminations = await iterPols(indiv, innerPol, pol, [], lineage)
            await terminations.forEach(p => ret.push(p))
        }
    }

    if (argv.allTerminations) {
        return ret

    }
    return ret.filter(s => s?.terminated?.length == 0)

}


var cd = 0
async function iterPols(item, innerPol, pol, collections, lineage) {
    cd++
    
    if (cd % 100 == 0) {
        
    }

    lineage += `${item.rootItem} -> `

    /* if (lineage.match('users:4c9ad188-5620-4523-b761-6293802db8a6')) {
        console.log()
    } */

   /*  console.log(lineage) */

    let terminated = await evalLists(item?.rootItem, innerPol, pol?.policy)

    /*  if (lineage.match('users:c66aad40-1dee-43c2-810b-77532250bfc8 ->')) {
         console.log()
     } */



    collections.push({
        policy: `all`,
        lineage,
        lookup: item?.rootItem,
        terminated
    })

    if (item?.subItems?.length > 0 && terminated.length > 0) {

        for await (let sub of item?.subItems) {
            await iterPols(sub, terminated, pol, collections, lineage)
        }

    }

    return collections

}


async function TerminatedPolicyConditionsLookupFull(perm, refPol) {

    let termArra = []

    for await (let pol of perm) {
        const { toProcessingPipeline } = pol

        // Filter the policy itself out of innerPolicies
        let innerPol = refPol.filter(p => p?.id !== pol?.policy?.id)

        for await (let indiv of toProcessingPipeline) {
            let sectionArray = []



            let iter = await evalLists(indiv?.rootItem, innerPol, pol?.policy)




            for await (let sub of indiv.subItems.filter(s => s?.match(':'))) {



                let subTerminated = await evalLists(sub, iter, pol?.policy)
                sectionArray.push({
                    name: pol?.policy?.displayName,
                    policy: pol?.policy,
                    rootPermutation: indiv?.rootItem,
                    SubPermutation: sub,
                    terminated: subTerminated
                })

            }

            if (sectionArray.length == 0) {

                sectionArray.push({
                    name: pol?.policy?.displayName,
                    policy: pol?.policy,
                    rootPermutation: indiv?.rootItem,
                    SubPermutation: "no sub permutations, this is the root permutation",
                    terminated: iter
                })

            }

            termArra.push(sectionArray)
        }

    }

    return termArra.flat()


}

function TerminatedPolicyConditionsLookup(lookup, policies, filter) {

    if (Array.isArray(lookup)) {
        const matches = []
        for (look of lookup) {
            let rootKey = Object.keys(look)[0]
            let subkey = Object.keys(look[rootKey])[0]
            let value = look[rootKey][subkey]
            //  console.log(rootKey)
            matches.push(policies.filter(policy => policy?.conditions?.[rootKey]?.[subkey]?.includes(value)))

        }
        if (filter) {
            const filtered = []
            for (look of filter) {

                let rootKey = Object.keys(look)[0]
                let subkey = Object.keys(look[rootKey])[0]
                let value = look[rootKey][subkey]
                //  console.log(rootKey)
                matches.flat().filter(policy => !policy?.conditions?.[rootKey]?.[subkey]?.includes(value)).forEach(filt => filtered.push(filt))
            }
            return filtered.flat()
        }
        return matches.flat()
    }
    // Plain version with single object
    if (typeof (lookup) == "object") {
        let rootKey = Object.keys(lookup)[0]
        let subkey = Object.keys(lookup[rootKey])[0]
        let value = lookup[rootKey][subkey]
        //  console.log(rootKey)
        let matches = policies.filter(policy => policy?.conditions?.[rootKey]?.[subkey]?.includes(value))
        console.log(matches)
        return matches
    }

}


function getAllExclusions(item, excluded) {


    if (typeof (item) === 'object' && item !== null) {


        Object.keys(item)?.forEach(key => {

            if (key.match('excl') && item[key].length > 0) {

                let ob = {
                }
                ob[`${key}`] = item[key]

                excluded.push(ob)
                console.log(excluded)
            }

            getAllExclusions(item[key], excluded)

        })
    } else {
        return;
    }

    return excluded

}



function iteratePolicyKeyNonArray(keyWord, item, list) {


    if ((typeof (item) === 'object') && item !== null) {


        Object.keys(item)?.forEach(key => {

            if (key.match(keyWord)) {

                let ob = {
                }
                ob[`${key}`] = item[key]

                list.push(ob)
                //console.log(list)
            }

            iteratePolicyKeyNonArray(keyWord, item[key], list)

        })
    } else {
        return;
    }

    return list

}

function iteratePolicyKeys(keyWord, item, list) {


    if (typeof (item) === 'object' && item !== null) {


        Object.keys(item)?.forEach(key => {

            if (key.match(keyWord) && item[key]?.length > 0) {

                let ob = {
                }
                ob[`${key}`] = item[key]

                list.push(ob)

            }

            iteratePolicyKeys(keyWord, item[key], list)

        })
    } else {
        return;
    }

    return list

}


async function getPolicies() {

    try {
        return require('../../policies.json')
    } catch (error) {


        let tkn = await getGraphTokenReducedScope()

        let headers = {
            authorization: `bearer ${tkn}`
        }

        var opt = {
            url: "https://graph.microsoft.com/v1.0/identity/conditionalAccess/policies",
            headers
        }

        let { data } = await axios(opt).catch(error => {
            console.log(error?.response?.data || error)
        })

        let p

        if (argv.includeReportOnly) {
            p = data?.value.filter(s =>
                s.conditions?.devices?.deviceFilter?.mode !== 'include'
                && s.conditions.applications?.includeApplications.length > 0
                && s.grantControls?.builtInControls
                && s.conditions?.userRiskLevels == 0
                && s.conditions?.signInRiskLevels == 0
            )

        } else {
            p = data?.value.filter(s =>
                s?.state == 'enabled'
                && s.conditions?.devices?.deviceFilter?.mode !== 'include'
                && s.conditions.applications?.includeApplications.length > 0
                && s.grantControls?.builtInControls
                && s.conditions?.userRiskLevels == 0
                && s.conditions?.signInRiskLevels == 0
            )
        }


        // filter out device and security registration policies
        fs.writeFileSync('policies.json', JSON.stringify(p))

    }

    return await getPolicies()

}


async function getPoliciesFresh() {

    try {
        return require('../../policies.json')
    } catch (error) {


        let tkn = await getGraphTokenReducedScope()

        let headers = {
            authorization: `bearer ${tkn}`
        }

        var opt = {
            url: "https://graph.microsoft.com/v1.0/identity/conditionalAccess/policies",
            headers
        }

        let { data } = await axios(opt).catch(error => {
            console.log(error?.response?.data || error)
        })

        let p

        if (argv.includeReportOnly) {
            p = data?.value.filter(s => s.conditions?.devices?.deviceFilter?.mode == undefined && s.conditions.applications?.includeApplications.length > 0 && s.grantControls?.builtInControls)

        } else {
            p = data?.value.filter(s => s?.state == 'enabled' && s.conditions?.devices?.deviceFilter?.mode == undefined && s.conditions.applications?.includeApplications.length > 0 && s.grantControls?.builtInControls)
        }


        // filter out device and security registration policies
        fs.writeFileSync('policies.json', JSON.stringify(p))

    }

    return await getPolicies()

}



async function getLocations() {

    try {
        return require('../../namedLocations.json')
    } catch (error) {

        let tkn = await getGraphTokenReducedScope()

        let headers = {
            authorization: `bearer ${tkn}`
        }

        var opt = {
            url: "https://graph.microsoft.com/beta/conditionalAccess/namedLocations",
            headers
        }

        let { data } = await axios(opt).catch(error => {
            console.log(error?.response?.data)
        })

        fs.writeFileSync('namedLocations.json', JSON.stringify(data?.value))

    }

    return await getLocations()

}

module.exports = { getAllExclusions, getPolicies, getLocations, TerminatedPolicyConditionsLookup, iteratePolicyKeys, TerminatedPolicyConditionsLookupFull, nTerminatedPolicyConditionsLookupFull, iteratePolicyKeyNonArray, getPoliciesFresh }