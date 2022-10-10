


var initiated = [
    "dummy-ddcd-4f5c-874d-d6adabe04cca:d02de402-dd66-44af-8c48-a3ee5c1b6596"
]

function inMemoryList (items) {

  
     if(Array.isArray(items) ) {
            items.forEach( item => initiated.push(item))
    }

    return initiated
}

module.exports={inMemoryList}