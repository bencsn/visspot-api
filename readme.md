# REST API service for the Visspot Project

## Development

1. Create a config file for the development environment
```bash

touch config/local.json

```

2. Add the following content to the config file
```json

{
  "server": {
    "port": 3000
  }
}

```
3. Create another config file for the test environment
```bash

touch config/test.json

```

4. Add the config for the test environment
```json

{
  "server": {
    "port": 3001
  }
}

```

5. Install the dependencies
```bash

npm install

```

6. Run the tests
```bash

npm test

```

7. Start the server
```bash

npm start

```

