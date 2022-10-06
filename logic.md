1. Pure exclusions : Try to find exact matching policies that include exclusion
2. Exclusions by inclusion: Try to find exact match for the exclusion created by inclusion (in order for mutations to be created these exclusions like apps and locations, need to be injected in the pipeline)
3. Try to find catch-all policy when 1,2 cannot satisfy the pipeline


<!-- # Progress
 sd
Amount of permutations can be more than just consisting two conditions (increase these)
The lookups need to understand this too -->


# Progress
There can be situation, where the gap is created by combination of policies, in these cases the all permutations need to be used to do lookup of matches. 

## Gap detection done!


## Other
Ensure policies that target just devices are /can be filtered out
Remove Security Information registration policies


## Ensure auth works 
add AZ CLI "piggyback"

## map ID's in report to actual names 
Done 

