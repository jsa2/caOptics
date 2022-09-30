





function newSetWithSchema(data,a) {
    if (!Array.isArray(data)) {
      return new Error('not an array')
    }  
    
      //let test = groupBy(data,'recommendationDisplayName')
      function dm (data,key) {
        data.map((group) =>{
          let items
          items = groupBy(group.items, key)
          
          delete group.items
          group.items = []
  
          items.sort((a,b) => {
            
  
            if (a.group.toLowerCase() == "high"){
              return -1
            }
            if (a.group.toLowerCase() == "medium" && b.group.toLowerCase() !== "high") {
              return -1
            }
          
  
          })
          
  
          group.items.push(items)
          group.items
        //  console.log(data.length)
         var nextIndex = a.lastIndexOf(key)+1
         if (a.includes(a[nextIndex])) {
          dm(items,a[nextIndex])
         }
        })
        return data
      
      }
      var group
          group = groupBy(data,a[0]) 
          if (a.length == 1 ) {
            return group
          } else {
          return dm(group,a[1])
          }
          
          
          
         
      
    }
  
  
  function newSetA(data,a) {
      if (!Array.isArray(data)) {
        return new Error('not an array')
      }  
      
        //let test = groupBy(data,'recommendationDisplayName')
        function dm (data,key) {
          data.map((group) =>{
            let items
            items = groupBy(group.items, key)
            //console.log(key,group.items[0])
            delete group.items
            group.items = []
  
            items.sort((a,b) => {
              
              try { if (a.group.toLowerCase() < b.group.toLowerCase()) {
                return -1;
              } else {
                return 0
              }} catch (error) {
                error
              }
             
            
  
            })
            
  
            group.items.push(items)
            group.items
          //  console.log(data.length)
           var nextIndex = a.lastIndexOf(key)+1
           if (a.includes(a[nextIndex])) {
            dm(items,a[nextIndex])
           }
          })
          return data
        
        }
        var group
            group = groupBy(data,a[0]) 
            if (a.length == 1 ) {
              return group
            } else {
            return dm(group,a[1])
            }
            
            
            
           
        
      }
      
      
      
      function groupBy (source,property) {
          var categories= []
          for (const item of source) {
        
            categories.includes(item?.[property]) || categories.push(item[property])
            
          }
          
          var results = categories.map( (group,index) => {
          
            let items = source.filter((item) =>{
              return item[property] == group
            })
        
            items
        
            return {
              group,
              items,
              property
            }
        
          })
        return results
        }
      
        module.exports={newSetA}