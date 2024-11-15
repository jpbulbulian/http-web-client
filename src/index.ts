import qs from "qs";

const ACCESS_TOKEN = "access";
const REFRESH_TOKEN = "refresh";

export type Input = string | URL;

interface ExtraOptions {
  query?: object;
  auth?: boolean;
}

export type Options = RequestInit & ExtraOptions;

function responseType(response: Response) {
  const type = response.headers.get("Content-Type");
  if (type?.includes("json")) return response.json();
  if (type?.includes("text")) return response.text();
  if (type?.includes("form-data")) return response.formData();
  return response.blob();
}

export function isValidURL(urlString: Input) {
  try {
    return Boolean(new URL(urlString));
  } catch {
    return false;
  }
}

export default class HttpWebClient {
  /**
   * HTTP Web Client based on native browsers fetch API
   * @param _base Base URL for fetching (optional)
   * @param _refreshEndpoint Endpoint to tokens refresh (optional)
   */
  constructor(
    private readonly _base: string = "",
    private readonly _refreshEndpoint?: string,
  ) {}

  private _accessToken: string | null = localStorage.getItem(ACCESS_TOKEN);

  private _refreshToken: string | null = localStorage.getItem(REFRESH_TOKEN);

  hasAccessToken = () => Boolean(this._accessToken);

  hasRefreshToken = () => Boolean(this._refreshToken);

  setAccessToken = (accessToken: string | null) => {
    this._accessToken = accessToken;
    if (accessToken) localStorage.setItem(ACCESS_TOKEN, accessToken);
    else localStorage.removeItem(ACCESS_TOKEN);
  };

  setRefreshToken = (refreshToken: string | null) => {
    this._refreshToken = refreshToken;
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN, refreshToken);
    else localStorage.removeItem(REFRESH_TOKEN);
  };

  setTokens = ({ access, refresh }) => {
    this.setAccessToken(access);
    this.setRefreshToken(refresh);
  };

  removeTokens = (): null => {
    this.setAccessToken(null);
    this.setRefreshToken(null);
    return null;
  };

  private _fetcher<T>(input: Input, options: Options): Promise<T> {
    let { body } = options;
    const { method, headers = {}, query, auth } = options;

    if (body && !headers["Content-Type"]) {
      body = JSON.stringify(body);
      headers["Content-Type"] = "application/json";
    }

    if (auth && this.hasAccessToken())
      headers["Authorization"] = `Bearer ${this._accessToken}`;

    let url = isValidURL(input) ? input : this._base + input;
    if (query) url += `?${qs.stringify(query)}`;

    return fetch(url, { method, headers, body }).then(async (response) => {
      if (response.ok) return responseType(response);
      if (auth && response.status === 401) {
        if (this.hasAccessToken()) this.setAccessToken(null);
        if (this._refreshEndpoint && this.hasRefreshToken())
          return this._refresh().then(() => this._fetcher(input, options));
      }
      throw await responseType(response);
    });
  }

  private readonly _refresh = () =>
    fetch(this._base + this._refreshEndpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${this._refreshToken}` },
    })
      .then(async (response) => {
        if (response.ok) return responseType(response);
        if (response.status === 401) this.removeTokens();
        throw await responseType(response);
      })
      .then(({ access, refresh }) => {
        this.setAccessToken(access);
        if (refresh) this.setRefreshToken(refresh);
      });

  private readonly _method =
    (method: string, auth?: boolean) =>
    <T>(input: Input, options?: Options) =>
      this._fetcher<T>(input, { ...options, method, auth });

  private readonly _methodWithBody =
    (method: string, auth?: boolean) =>
    <T>(input: Input, body?, options?: Options) =>
      this._fetcher<T>(input, { ...options, method, body, auth });

  _get = this._method("GET", true);
  get = this._method("GET");
  _head = this._method("HEAD", true);
  head = this._method("HEAD");
  _post = this._methodWithBody("POST", true);
  post = this._methodWithBody("POST");
  _put = this._methodWithBody("PUT", true);
  put = this._methodWithBody("PUT");
  _patch = this._methodWithBody("PATCH", true);
  patch = this._methodWithBody("PATCH");
  _delete = this._method("DELETE", true);
  delete = this._method("DELETE");
  options = this._method("OPTIONS");
  connect = this._method("CONNECT");
  trace = this._method("TRACE");
}
