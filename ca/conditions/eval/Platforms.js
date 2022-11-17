


module.exports= function (lookup, innerPol,currentPolicy) {


  if (currentPolicy) {

 
    }
    // Count stage 1 policies
    let stage1 = innerPol.filter(p => ( p?.conditions?.platforms == null))

    res = innerPol.filter(p =>  p?.conditions !== null)
    .filter(p =>  p?.conditions?.platforms?.includePlatforms?.includes('all')  || p?.conditions?.platforms?.includePlatforms.includes(lookup[1]) )
    .filter(p => !p?.conditions?.platforms?.excludePlatforms?.includes(lookup[1]) )
    

  // if there were events in stage1 flat
    stage1.forEach(s => res.push(s))

   return res = res.flat()

}
    


