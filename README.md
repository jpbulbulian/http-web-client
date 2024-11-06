# HTTP Web Client

A `Class` to wrap the **fetch** browser API.\
Allow to manage _**access**_ and _**refresh**_ tokens for authentication. Taking them from the local storage.\
Sends every request with the access token, in case of 401 error try to refresh the access token with a request to **REFRESH_TOKEN ENDPOINT**.\
Returns `json` or `text` **data** depends on _`Content-Type`_ from server.\
Throws an `Error` in case of `Response !== ok`.

## Package.json

**Recommendation:** use the commit hash to avoid breaking changes.

```json
  "dependencies": {
    "http-web-client": "github:jpbulbulian/http-web-client"
    }
```

## Installation

```bash
npm install
```

## API

### HttpClient<T>

#### Methods

- `setAccessToken(token: string | null)`
- `setRefreshToken(token: string | null)`
- `setTokens({ access, refresh })`
- `removeTokens(): null`

- `hasAccessToken(): boolean`
- `hasRefreshToken(): boolean`

- `get(resource: string, options?)`
- `post(resource: string, body?, options?)`
- `put(resource: string, body?, options?)`
- `delete(resource: string, options?)`

#### Options

Init native **fetch** options object (excluding _**body**_ and _**method**_ fields)

##### Additional

- `query:` Object with parameters, parsed with qs library

## Usage

```typescript
import HttpWebClient from "http-web-client";

const BASE_URL = "https://example.com/api";
const REFRESH_TOKEN_ENDPOINT = "/user/refresh";

const httpClient = new HttpWebClient(BASE_URL, REFRESH_TOKEN_ENDPOINT);

// Automatically stored in localStorage["access"]
httpClient.setAccessToken("xxxxx");

// fetch("https://example.com/api/user?name=Charles", { headers: { Authorization: "Bearer xxxxx" }})
const data = await httpClient.get("/user", { query: { name: "Charles" } });
```

## License

MIT
