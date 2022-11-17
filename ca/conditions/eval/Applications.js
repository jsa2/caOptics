


module.exports= function (lookup, innerPol,currentPolicy) {
    res = innerPol.filter(p => (p?.conditions.applications.includeApplications.includes(lookup[1]) 
    || p?.conditions.applications.includeApplications.includes('All')))
    .filter(p =>!p?.conditions.applications.excludeApplications.includes(lookup[1]))

    
    return res

  }
      
  
  
  