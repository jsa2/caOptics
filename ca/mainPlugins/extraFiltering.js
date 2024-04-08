async function extraFilter(policies) {


    // Drop all conditions which don't have mfa, block or device based requirements
    policies = policies.filter(s =>
        s?.grantControls?.builtInControls?.includes('mfa') ||
        s?.grantControls?.builtInControls?.includes('block') ||
        s?.grantControls?.builtInControls?.includes('domainJoinedDevice') ||
        s?.grantControls?.builtInControls?.includes('compliantDevice') ||
        s?.grantControls?.authenticationStrength
    )
    // Policy cannot also be terminating when followed by OR and a weak condition
    policies = policies.filter(s => {
        if (s?.grantControls?.builtInControls.includes('approvedApplication')
            || s?.grantControls?.builtInControls.includes('compliantApplication')
            || s?.grantControls?.builtInControls?.termsOfUse) {
            if (s?.grantControls.operator !== "OR") {
                return s
            }

        } else {
            return s
        }
    })

    return policies

}

module.exports = { extraFilter }