# Quick run commands reference
history 10 | cut -c 8-

```sh

node ./ca/main.js --mapping  --skipObjectId=259fcf40-ff7c-4625-9b78-cd11793f161f

node ./ca/main.js --mapping  --skipObjectId=259fcf40-ff7c-4625-9b78-cd11793f161f -clearPolicyCache

node ./ca/main.js --mapping  --skipObjectId=259fcf40-ff7c-4625-9b78-cd11793f161f -clearPolicyCache --clearTokenCache


```


# demos

## 
// should show

all| 0 | users:GuestsOrExternalUsers -> Locations:All -> Platforms:android -> clientAppTypes:browser -> Applications:Office365 ->  
all| 0 | users:GuestsOrExternalUsers -> Locations:All -> Platforms:iOS -> clientAppTypes:browser -> Applications:Office365 ->  
all| 0 | users:GuestsOrExternalUsers -> Locations:All -> Platforms:windows -> clientAppTypes:browser -> Applications:Office365 ->  
all| 0 | users:GuestsOrExternalUsers -> Locations:All -> Platforms:windowsPhone -> clientAppTypes:browser -> Applications:Office365 ->  
all| 0 | users:GuestsOrExternalUsers -> Locations:All -> Platforms:linux -> clientAppTypes:browser -> Applications:Office365 ->  
all| 0 | users:GuestsOrExternalUsers -> Locations:All -> Platforms:All -> clientAppTypes:browser -> Applications:Office365 ->  

// 
git checkout tooling

// remove current pols
node DOnotRunThis.js 

// add scene extremelyNarrow
cp demodata/extremelyNarrow.json policies.json 

// update
node rollback.js

//go back to main
git checkout "0.6.5"

// Run scan
node ./ca/main.js --mapping  --skipObjectId=259fcf40-ff7c-4625-9b78-cd11793f161f --clearPolicyCache --clearTokenCache --clearMappingCache

## 
cp demodata/policies.json policies.json 
node ./ca/main.js --mapping  --skipObjectId=259fcf40-ff7c-4625-9b78-cd11793f161f --clearTokenCache --clearMappingCache



