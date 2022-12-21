# Resolver notes

**Scenario 1**

How group and users are resolved?

    aldo.diaz@m.dewi.red

        part of Marketing
        part of Sales
        -> Sales is part of group GlobalSales

        
        Baseline policy
            excludes: 
                Marketing group
                Aldo Diaz User
        
        Sales Policy
            includes:
                GlobalSales group




**Results**
Policy  | Terminations | lookup 
 -|-|-
All|  0| users:Marketing ``❌ While there are users who are terminated in other policies belonging to marketing, no policy targets 'Marketing' directly, or via nested group assignment``
All|   1| users:All - ``✅ 'Global Policy' inlcudes all users`` 
All|   1| users:Aldo Díaz ``✅ Aldo is matched in 'Sales Policy' via belonging to group 'Global Sales' via sub group 'Sales'`` 
All|   1| users:GuestsOrExternalUsers ``✅ 'Global Policy' inlcudes all users`` 
All|   2| users:Global Sales  ``✅ 'Sales Policy' inlcudes all 'GlobalSales'``

**Scenario 2**

What if Aldo happens to be in some Azure AD Role? 
> Admin roles are always shown separately and not mapped to users and groups, this is deliberate design decisions for the time being to ensure that role inclusions and exclusions are shown explicitly. It also helps understanding situations where user might be eligible for a role, and thus showing both mapping individually should bring some clarity to results 

    aldo.diaz@m.dewi.red

        Role:Attack Simulation Administrator  
        part of Marketing
        part of Sales
        -> Sales is part of group GlobalSales

        
        Baseline policy
            excludes: 
                Marketing group
                Aldo Diaz User
                Attack Simulation Administrator Role
        
        Sales Policy
            includes:
                GlobalSales




**Results**
Policy  | Terminations | lookup 
 -|-|- 
 All|  0| users:Attack Simulation Administrator ``❌ While 'User Aldo' is part of this role, it is only shown, that this role is not terminated``
All|   0| users:Marketing ``❌ While there are users who are terminated in other policies belonging to marketing, no policy targets 'Marketing' directly, or via nested group assignment``
All|   1| users:All - ``✅ 'Global Policy' inlcudes all users`` 
All|  1| users:Aldo Díaz ``✅ Aldo is matched in 'Sales Policy' via belonging to group 'Global Sales' via sub group 'Sales'`` 
All|   1| users:GuestsOrExternalUsers ``✅ 'Global Policy' inlcudes all users`` 
All|   2| users:Global Sales  ``✅ 'Sales Policy' inlcudes all 'GlobalSales'``


**Scenario 3**

What if user is included in main exclusion group, but then handled via other group in policies that "close the gap"? In these situations when you want to explicitly show how the user/users might be terminated in other policies, you can use the [``--expand``](../readme.md#parameters) option.

Example

    aldo.diaz@m.dewi.red

        part of Marketing
        part of Sales
        -> Sales is part of group GlobalSales

        
        Baseline policy
            excludes: 
                Marketing group
                Aldo Diaz User
        
        Sales Policy
            includes:
                GlobalSales group
