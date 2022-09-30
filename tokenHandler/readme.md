# Azure Cloud Shell Client for device code flow

Very simple implementation of Azure AD Device Code Flow using existing high privileged application (Azure CLI) 
-   You can define your own application too 


## Usage

1. Open Azure Cloud Shell (BASH) and paste following command to it:

`` curl -o- "https://raw.githubusercontent.com/jsa2/aad_device_code/main/init.sh" |  bash`` 

2. Navigate to install directory ``cd aad_device_code/``
3. Type ``npm install `` 
4. Run the tool (It will wait for 15 iterations for login)
`` node getCode.js --client=04b07795-8ddb-461a-bbee-02f9e1bf7b46 --resource=https://graph.microsoft.com `` 

- If you use your own clientID, and it is not an multitenant app, supply tenantId param too

    `` node getCode.js --tid=48f55450-183a-45d6-a9ce-68f3cbc68947 --client=b5505019-43a5-4eda-bc5e-b0157a1227b9 --resource=https://graph.microsoft.com `` 

<br>

![image](https://user-images.githubusercontent.com/58001986/164604283-57cb6bb8-6a57-4890-b964-5170777cb070.png)

## Backround
If you want to read about how this might be used for malicious purposes, read the excellent write-up by [DrAzureAD](https://twitter.com/DrAzureAD) 
@ https://o365blog.com/post/phishing/