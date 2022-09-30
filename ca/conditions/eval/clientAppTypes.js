


module.exports= function (lookup, innerPol,currentPolicy) {

  res = innerPol.filter(p => p?.conditions.clientAppTypes?.includes(lookup[1]) || p?.conditions.clientAppTypes?.includes('all') )
          // console.log(res)

           return res
}
    


