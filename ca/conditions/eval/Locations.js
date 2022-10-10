


module.exports= function (lookup, innerPol,currentPolicy) {

 res = innerPol.filter(p => ( p?.conditions.locations?.includeLocations.includes(lookup[1]) 
    || p?.conditions?.locations?.includeLocations.includes('All') || !p?.conditions?.locations)
    && !p?.conditions?.locations?.excludeLocations.includes(lookup[1]) )





return res


}
    


