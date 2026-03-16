Local Test Docker
---------------------------------
docker build -t blogpostapi .

docker run -p 3000:3000 `
-e PORT=3000 `
-e NODE_ENV=development `
-e "MONGODB_URI=mongodb://raju:Bhai1994@fc-b6df677d2341-000.global.mongocluster.cosmos.azure.com:10260/mcp-blog?tls=true&authMechanism=SCRAM-SHA-256&retryWrites=false" `
-e KEY_VAULT_NAME=blogpostPROD `
blogpostapi-4

docker run -p 3000:3000 `
-e PORT=3000 `
-e NODE_ENV=development `
-e "MONGODB_URI=mongodb+srv://useradmin:Raju1994@blogpost-cosmos.global.mongocluster.cosmos.azure.com/mcp-blog?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000" `
-e KEY_VAULT_NAME=blogpostPROD `
blogpostapi

docker run -p 3000:3000 `
-e PORT=3000 `
-e NODE_ENV=development `
-e "MONGODB_URI=mongodb+srv://useradmin:Raju1994@blogpost-cosmos.global.mongocluster.cosmos.azure.com/mcp-blog?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000" `
-e KEY_VAULT_NAME=blogpostPROD `
blogpostapi.azurecr.io/blogpostapi-1


////Push Image To Azure Container Registery

az login

az acr login --name blogpostapi

docker image list
->blogpostapi:latest

docker tag blogpostapi blogpostapi.azurecr.io/blogpostapi-1

docker push blogpostapi.azurecr.io/blogpostapi-1

/// PULL Image From Azure Container Registery
az login

az acr login --name blogpostapi

az acr repository list --name blogpostapi --output table
->blogpostapi-1

az acr repository show-tags --name blogpostapi --repository blogpostapi-1 --output table
->latest

docker pull blogpostapi.azurecr.io/blogpostapi-1:latest

docker images

docker run -p 3000:3000 `
>> -e PORT=3000 `
>> -e NODE_ENV=development `
>> -e "MONGODB_URI=mongodb+srv://useradmin:Raju1994@blogpost-cosmos.global.mongocluster.cosmos.azure.com/mcp-blog?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000" `
>> -e KEY_VAULT_NAME=blogpostPROD `
>> blogpostapi.azurecr.io/blogpostapi-1

//// Deploy Container Node app 
az appservice plan create  --name blogpost-plan  --resource-group MongoDB  --is-linux  --sku B1

{
  "asyncScalingEnabled": false,
  "elasticScaleEnabled": false,
  "freeOfferExpirationTime": "2026-04-12T04:08:51.0766667",
  "geoRegion": "South India",
  "hyperV": false,
  "id": "/subscriptions/339aac69-940e-4a16-bea2-2d2cf6dddf40/resourceGroups/MongoDB/providers/Microsoft.Web/serverfarms/blogpost-plan",
  "isCustomMode": false,
  "isSpot": false,
  "isXenon": false,
  "kind": "linux",
  "location": "southindia",
  "maximumElasticWorkerCount": 1,
  "maximumNumberOfWorkers": 0,
  "name": "blogpost-plan",
  "numberOfSites": 0,
  "numberOfWorkers": 1,
  "perSiteScaling": false,
  "provisioningState": "Succeeded",
  "reserved": true,
  "resourceGroup": "MongoDB",
  "sku": {
    "capacity": 1,
    "family": "B",
    "name": "B1",
    "size": "B1",
    "tier": "Basic"
  },
  "status": "Ready",
  "subscription": "339aac69-940e-4a16-bea2-2d2cf6dddf40",
  "targetWorkerCount": 0,
  "targetWorkerSizeId": 0,
  "type": "Microsoft.Web/serverfarms",
  "zoneRedundant": false
}

az webapp create  --resource-group MongoDB  --plan blogpost-plan  --name blogpost-api-prod  --deployment-container-image-name blogpostapi.azurecr.io/blogpostapi-1:latest  --assign-identity

az acr update --name blogpostapi --admin-enabled true

az acr credential show --name blogpostapi

az webapp config container set  --name blogpost-api-prod  --resource-group MongoDB  --docker-custom-image-name blogpostapi.azurecr.io/blogpostapi-1:latest  --docker-registry-server-url https://blogpostapi.azurecr.io  --docker-registry-server-user blogpostapi  --docker-registry-server-password Ci2mmw9s25c5Qjv9xsPQxRPOXHaksjkCEgGaVyiqCOqYb9AXISKgJQQJ99CCAC77bzfEqg7NAAACAZCRVxWT

az webapp restart  --name blogpost-api-prod  --resource-group MongoDB

az webapp log tail  --name blogpost-api-prod  --resource-group MongoDB


az webapp config appsettings list  --name blogpost-api-prod  --resource-group MongoDB

az webapp config container set  --name blogpost-api-prod  --resource-group MongoDB  --docker-custom-image-name blogpostapi.azurecr.io/blogpostapi-1:latest  --docker-registry-server-url https://blogpostapi.azurecr.io  --docker-registry-server-user blogpostapi  --docker-registry-server-password Ci2mmw9s25c5Qjv9xsPQxRPOXHaksjkCEgGaVyiqCOqYb9AXISKgJQQJ99CCAC77bzfEqg7NAAACAZCRVxWT