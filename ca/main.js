const { getPolicies, iteratePolicyKeys, TerminatedPolicyConditionsLookupFull, nTerminatedPolicyConditionsLookupFull, getLocations } = require("./mainPlugins/getPol");
const fs = require('fs');
const { permutationList } = require("./permutationsPerPolicy");
const { rp } = require("../createReport");
const { getGraphTokenReducedScope } = require("./mainPlugins/tokenHandler");
const chalk = require("chalk");
const { userMap } = require("./mainPlugins/userMap");
const { argv } = require("yargs");
const { nonTerm } = require("./mainPlugins/uniqNonterm");
const { clearCache } = require("./mainPlugins/clearToken");
const { getPermutations } = require("./mainPlugins/getPol2");
const { rpCsv } = require("../createCSVreport");


main()

async function main() {

  if (argv.clearCache) {
    try {
      clearCache()
    } catch (error) {
      var msg = `no tokens to clear, or no policies to clear --> continuing: ${error.message}`
      console.log(chalk.yellow(msg))
    }

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

  for await (policy of policies) {

    console.log('inspecting policy:', policy?.displayName)
    const perPolicyPermutations = []
    for await (plugin of evaluationPlugins) {

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

/* 
If all platforms should be alt param
  if (argv.allPlatforms) {
    fullPermutation.push('Platforms:All')
  } */

  let uniq = []
  new Set(fullPermutation).forEach(s => uniq.push(s))


  console.log('inspecting cross-policy mutations')
  // const mesh = permutationList(uniq)
  const mest2 = await getPermutations(uniq)
  //console.log(mest2)

  const mockForMesh = {
    policy: { displayName: "All (cross-policy)" },
    toProcessingPipeline: mest2
  }

  if (argv.dump) {
    fs.writeFileSync('mesh.json', JSON.stringify(mest2))
  }

  console.log('unique items', uniq.length)



  const mix = await nTerminatedPolicyConditionsLookupFull([mockForMesh], policies)

  /*  let nq = nonTerm(mix) */

  if (argv.dump) {
    fs.writeFileSync('results.json', JSON.stringify(mix))
  }

  console.log('unique same key order permutations across policies', mix?.length || 0)

  rp(mix, true)

  rpCsv(mix,true)


  console.log(chalk.green('review crosstable.md for results'))

  return;



}