# REST API service for the Visspot Project

## Development

1. Create a .env file in the root directory with the following content. These environment variables will be used during development and automated testing

```
DATABASE_URL=<YOUR DATABASE URI>
SERVER_PORT=<YOUR SERVER PORT>


# Auth0 endpoints
AUTH0_TOKEN_URI="https://example.auth0.com/oauth/token"
AUTH0_USER_INFO_URI="https://example.auth0.com/userinfo"
AUTH0_AUTHORISATION_URI="https://example.auth0.com/authorize"


# Auth0 credentials
AUTH0_CLIENT_SECRET="YOUR CLIENT SECRET"
AUTH0_CLIENT_ID="YOUR CLIENT ID"
AUTH0_REDIRECT_URI="http://localhost:4000/login/callback"


JWT_SECRET="YOUR JWT SECRET"
```

2. Install the dependencies

```bash

npm install

```

3. Run the tests

```bash

npm test

```

4. Start the server

```bash

npm start

```
