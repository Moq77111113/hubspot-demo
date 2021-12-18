# Hubspot Demo

This is a training server using hubspot's api.


## Configuration
```sh

# Hubspot informations :

CLIENT_ID=
CLIENT_SECRET=
SCOPE= # comma separated scopes info here : https://legacydocs.hubspot.com/docs/methods/oauth2/initiate-oauth-integration#scopes

# Express 
PORT= # Default 3000
SESSION_SECRET= # Sign the session Id cookie 
SHUTDOWN_TTL= # Time before shutting down server on sigterm & sigint
```

# Run the app

```sh
yarn install
yarn run build
yarn start

```