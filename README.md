[![NPM Version](https://img.shields.io/npm/v/@raito-cache/client)](https://www.npmjs.com/package/@raito-cache/client)
[![Node.js CI](https://github.com/stbestichhh/raito-client/actions/workflows/node.js.yml/badge.svg)](https://github.com/stbestichhh/raito-client/actions/workflows/node.js.yml)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

# raito-expressjs

## Table of contents

* [Description](#about)
* [Getting started](#getting-started)
* [API](#api)
* [Deployment](#deployment)
* [Contributing](#contributing)
* [Changelog](#changelog)
* [Authors](#authors)
* [License](#license)

## About

**raito-client** - is an API for communicating with **[Raito](https://github.com/stbestichhh/raito-cache) cache server**.

## Getting started

> [!IMPORTANT]
> **Node.js 18.x+** version must be installed in your OS.

#### 1. Install server
  ```shell
  $ yarn add @raito-cache/client
  ```

#### 2. Connect to Raito
```typescript
import { Raito } from '@raito-cache/client';

const raito = new Raito(); // defaul connection is localhost:9180
```

## API

### Connect to Raito
```typescript
new Raito(); // Connect to localhost:9180
new Raito(7180); // localhost:7180
new Raito('raito://localhost:9180'); // localhost:9180
new Raito('raito://localhost:9180?ttl=5000'); // localhost:9180 and ttl 5s
new Raito({
  port: 9180, // Raito port
  host: 'localhost', // Raito host
  ttl: 10000, // Cache records time to live
});
```

### Usage

**Raito class**
```typescript
import { Raito } from '@raito-cache/client';

const raito = new Raito();

await raito.set('key', { data: 'some data' }); // Create new record
await raito.set('key2', 'other data', 15000); // Create new record with 15s ttl

await raito.get('key2'); // Output: { key: 'key', data: 'other data', createdAt: Date, ttl: 15000 }
await raito.clear('key'); // Deletes record

await raito.shutdown(); // Close connection
```

## Raito Deployment
1. Pull docker image:
  ```shell
  $ docker pull stbestich/raito-cache:latest
  ```
2. Run it
  ```shell
  $ docker run -e HOST=<host> -p <port>:9180 -it stbestich/raito-cache
  ```

#### Use with docker-compose
```yaml
services:
  raito-cache:
    image: stbestich/raito-cache:latest
    ports:
      - "${PORT:-9180}:${PORT:-9180}"
      - "${PORT:-9181}:${PORT:-9181" # Define second port if you need http proxy
    env_file:
      - .env
    environment:
      NODE_ENV: production
      PORT: ${PORT:-9180}
      HOST: ${HOST:-0.0.0.0}
      TTL: ${TTL}
    tty: true
    stdin_open: true
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Changelog

Project changes are writen in changelog, see the [CHANGELOG.md](CHANGELOG.md).

We use [SemVer](https://semver.org/) for versioning.
For the versions available, see the [tags](https://github.com/stbestichhh/raito-client/tags) on this repository.
For the versions supported, see the [SECURITY.md](SECURITY.md).

## Authors

- [@stbestichhh](https://www.github.com/stbestichhh)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE)
