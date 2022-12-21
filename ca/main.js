const { getPolicies, iteratePolicyKeys, TerminatedPolicyConditionsLookupFull, nTerminatedPolicyConditionsLookupFull, getLocations } = require("./mainPlugins/getPol");
const fs = require('fs');
const { permutationList } = require("./permutationsPerPolicy");
const { rp } = require("../createReport");
const { getGraphTokenReducedScope } = require("./mainPlugins/tokenHandler");
const chalk = require("chalk");
const { userMap } = require("./mainPlugins/userMap");
const { argv } = require("yargs");
const { nonTerm } = require("./mainPlugins/uniqNonterm");
const { clearPolicyCache, clearTokenCache, clearMappingCache } = require("./mainPlugins/clearPolicyCache");
const { getPermutations } = require("./mainPlugins/getPol2");
const { rpCsv } = require("../createCSVreport");
const { rpLegacy } = require("../createReportLegacy");
const { decode } = require("jsonwebtoken");
const { inMemoryList } = require("./mainPlugins/inMemList");


main()

async function main() {

  if (argv.clearPolicyCache) {
    try {
      clearPolicyCache()
    } catch (error) {
      var msg = `no tokens to clear, or no policies to clear --> continuing: ${error.message}`
      console.log(chalk.yellow(msg))
    }

  }

  if (argv.clearTokenCache) {
    try {
      clearTokenCache()
    } catch (error) {
      var msg = `no tokens to clear, or no policies to clear --> continuing: ${error.message}`
      console.log(chalk.yellow(msg))
    }

  }

  if (argv.clearMappingCache) {
    clearMappingCache()
  }



  if (argv.clearTokenCache) {

  }

  // precheck for policies count
  try {
    await getGraphTokenReducedScope()
    await getLocations()
    const preP = await getPolicies()

    if (preP?.length == 0) {
      console.log(chalk.red('no policies, exiting'))
      return;
    }
  } catch (error) {
    console.log(chalk.red('unable to fetch policies, exiting', error?.message || 'no additional error message'))
    return;
  }


  if (argv.skipObjectId) {
    console.log(chalk.green(`Excluding certain objectID's due to provided arguments ${argv.skipObjectId}`))
  }




  try {
    console.log(chalk.green('checking pre-requisites'))
    await getGraphTokenReducedScope()
    // check login and token validity
  } catch (error) {
    console.log('failing of getting token', error)
    return;
  }

  var policies = await getPolicies()

  // remove all policies which include only legacyAuth conditions
  if (!argv.includeLegacyAuth) {
    policies = policies.filter(p => p?.conditions?.clientAppTypes.includes('all')
      || p?.conditions?.clientAppTypes.includes('browser')
      || p?.conditions?.clientAppTypes.includes('mobileAppsAndDesktopClients'))

    console.log(policies)
  }


  if (argv.mapping) {
    await userMap(policies)
  }


  console.log('user mapping done')
  const evaluationPlugins = fs.readdirSync(`${__dirname}/conditions/`).filter(s => s?.match('js'))


  const fullPermutation = []
  // For each policy handle the conditions
  // Before calculation of permutations

  for await (let policy of policies) {

    console.log('inspecting policy:', policy?.displayName)
    const perPolicyPermutations = []
    for await (let plugin of evaluationPlugins) {

      try {
        let cases = iteratePolicyKeys(`${plugin.split('.js')[0]}`, policy, [])
        let results = await require(`./conditions/${plugin}`)(policy, cases, `${plugin.split('.js')[0]}`)
        // console.log(results)
        if (results?.length > 0) {


          perPolicyPermutations.push(results)

          results.forEach(re => fullPermutation.push(re))
        }
      } catch (error) {
        console.log(plugin, 'plugin not available for', error)
      }

    }

  }

  [
    'users:GuestsOrExternalUsers',
    'users:All',
    'Applications:All',
    'Platforms:All'
  ].forEach(u => fullPermutation.push(u))


  let uniq = []
  var expandedUniq = []

  try {
  
    if (argv.mapping && argv.expand) {
      let expandedNonUniq = []
      let inMemoryObjects = inMemoryList()

      argv.expand?.split(',').forEach(grp => {
        let flGroup = []
        inMemoryObjects.filter(s => s.split(':')[0] == grp).forEach(filtered => {
          flGroup.push(`users:${filtered.split(':')[1]}`)
        })

        flGroup.splice(0,argv.expandCount || 10).forEach( r => {
          expandedNonUniq.push(r)
        })

      })

      new Set(expandedNonUniq).forEach(s => {
        uniq.push(s)
        expandedUniq.push(s)
      })
      console.log()
      
    }

  } catch (error) {

    console.log('invalid values for expander', error)
  }


  new Set(fullPermutation).forEach(s => uniq.push(s))





  console.log('inspecting cross-policy mutations')
  // const mesh = permutationList(uniq)
  let mesh

  if (argv.aggressive) {
    // keep aggressive available for historical purposes
    mesh = permutationList(uniq)
  } else {
    // non aggressive permutation generation by default
    mesh = await getPermutations(uniq)
    //console.log(mesh)
  }




  const mockForMesh = {
    policy: { displayName: "All (cross-policy)" },
    toProcessingPipeline: mesh
  }

  if (argv.dump) {
    fs.writeFileSync('mesh.json', JSON.stringify(mesh))
  }

  console.log('unique items', uniq.length)

  let mix

  if (argv.mapping && argv.expand) { 
     mix = await nTerminatedPolicyConditionsLookupFull([mockForMesh], policies,expandedUniq)
  } else {
    mix = await nTerminatedPolicyConditionsLookupFull([mockForMesh], policies)
  }

  



  if (argv.dump) {
    fs.writeFileSync('results.json', JSON.stringify(mix))
  }

  console.log('unique same key order permutations across policies', mix?.length || 0)

  if (argv.aggressive) {

    let nq = nonTerm(mix)

    rpLegacy(nq, true, true)

  } else {

    /* 
    // add userName and date to reports  
    */
    let now = new Date()
    let fileName = `report_day_${now.getDay()}_month_${now.getMonth()}_year_${now.getFullYear()}-tenant_${decode(await getGraphTokenReducedScope())?.tid}`

    console.log(chalk.green('writing report to', ` ${fileName}.csv`))
    console.log(chalk.green('writing report to', ` ${fileName}.md`))

    rp(mix, true, undefined, fileName, expandedUniq)

    rpCsv(mix, true, undefined, fileName,expandedUniq)

  }



  console.log(chalk.green('review crosstable.md for results'))

  return;



}