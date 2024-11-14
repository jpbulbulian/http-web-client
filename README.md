# HTTP Web Client

A type safe `Class` to wrap the `fetch` browser API.\
Allow to manage `access` and `refresh` tokens for authentication. Taking them from the `localStorage`.\
Sends the private requests with the access token (the ones with the `_` example:`_get`), in case of 401 error try to refresh the access token with a request to **REFRESH_TOKEN_ENDPOINT**. The expected response from the server is `{ access }` or `{ access, refresh }` in case both tokens expired.\
Returns `json`, `text`, `form-data` or `blob` **data** depends on _`Content-Type`_ from server.\
Throws the **response body** in case of `Response.ok !== true`.

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

### _class_ HttpClient<T>

```typescript
import HttpWebClient from "http-web-client";
```

#### Tokens Methods

- `setAccessToken(token: string | null)`
- `setRefreshToken(token: string | null)`
- `setTokens({ access, refresh })`
- `hasAccessToken(): boolean`
- `hasRefreshToken(): boolean`
- `removeTokens(): null`

#### HTTP methods

- `get(input: URL, options?)`
- `_get(input: URL, options?)` with Authorization token
- `head(input: URL, options?)`
- `_head(input: URL, options?)` with Authorization token
- `post(input: URL, body?, options?)`
- `_post(input: URL, body?, options?)` with Authorization token
- `put(input: URL, body?, options?)`
- `_put(input: URL, body?, options?)` with Authorization token
- `patch(input: URL, body?, options?)`
- `_patch_(input: URL, body?, options?)` with Authorization token
- `delete(input: URL, options?)`
- `_delete(input: URL, options?)` with Authorization token
- `options(input: URL, options?)`
- `connect(input: URL, options?)`
- `trace(input: URL, options?)`

#### Options

Init native **fetch** options object (excluding `body` and `method` fields).

If the _**Content-Type**_ field isn't set to the `headers` object, it will be set to _**application/json**_ by the default and `JSON.stringify` will be applied to the body.

##### Additional

- `query`: Object with parameters, parsed with `qs` library.

### _function_ isValidURL

```typescript
import { isValidURL } from "http-web-client";
```

- `isValidURL(urlString: Input): boolean`

## Usage

```typescript
import HttpWebClient from "http-web-client";

const BASE_URL = "https://example.com/api"; // Optional
const REFRESH_TOKEN_ENDPOINT = "/user/refresh"; // Optional

const httpClient = new HttpWebClient(BASE_URL, REFRESH_TOKEN_ENDPOINT);

// Automatically stored in localStorage["access"]
httpClient.setAccessToken("xxxxx");

// const response = await fetch("https://example.com/api/user?name=Charles", {
//   headers: { Authorization: "Bearer xxxxx" },
// });
// const user = await response.json();
try {
  const user = await httpClient._get<User>("/user", {
    query: { name: "Charles" },
  });
} catch (error) {
  // in case response.ok !== true
  toast.error(error.message);
}

// const response = await fetch("https://example.com/api/user", {
//   method: "POST",
//   headers: {
//     Authorization: "Bearer xxxxx",
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({ name: "Alex" }),
// });
// const data = await response.json();
const data = await httpClient._post<User>("/user", { name: "Alex" });

// const response = fetch("https://example.com/api/avatar", {
//    method: "PUT",
//    headers: { Authorization: "Bearer xxxxx" },
//    body: file,
//  });
// const result = await response.json();
const result = await httpClient._put<boolean>("/avatar", file);

// If the input is a valid URL the BASE_URL it's omitted
const pokemon = await httpClient.get<Pokemon>(
  "https://pokeapi.co/api/v2/pokemon/ditto",
);
```

## License

MIT
