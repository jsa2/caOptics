module.exports=function (data) {

    // issue as per https://github.com/jsa2/caOptics/issues/4 
       return data?.value.filter(s =>
            s?.state == 'enabled'
            && s.conditions?.devices?.deviceFilter?.mode !== 'include'
            && s.conditions.applications?.includeApplications.length > 0
            && s.grantControls?.builtInControls
           // && s.conditions?.userRiskLevels == 0
            && s.conditions?.signInRiskLevels == 0
        )
    

}