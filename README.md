# UrnaDB JavaScript SDK

An ESM-only JavaScript SDK for UrnaDB. Node.js 18 or newer is required.

## Installation

```sh
npm install urnadb-js-sdk
```

## Usage

The main client supports both default and named imports:

```js
import UrnaDB, { ServerOptions } from "urnadb-js-sdk";

const options = new ServerOptions({
    host: "127.0.0.1",
    port: 2668,
    token: "connection-secret-token"
});

const db = UrnaDB.OpenConnection(options);
const users = db.tables("users");
```

The `Table` class is available from both the root package and the `table`
subpath:

```js
import { Table } from "urnadb-js-sdk";

// TableRowsBuilder and TableRowsPatcher are internal callback helpers.
```

CommonJS `require()` is not part of the supported public API.
