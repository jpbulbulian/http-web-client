import qs from "qs";

const CONTENT_TYPE = { "Content-Type": "application/json" };

const ACCESS_TOKEN = "access";
const REFRESH_TOKEN = "refresh";

const withQuery = (query) => (query ? `?${qs.stringify(query)}` : "");

const isJSON = (response: Response) =>
  response.headers?.get("content-type")?.startsWith("application/json")
    ? response.json()
    : response.text();

export default class HttpWebClient {
  /**
   * HTTP Web Client based on native browsers fetch API
   * @param base Base URL for fetching
   * @param refreshPath Path to the endpoint to tokens refresh
   */
  constructor(private base: string, private refreshPath?: string) {}

  private accessToken: string | null = localStorage.getItem(ACCESS_TOKEN);

  private refreshToken: string | null = localStorage.getItem(REFRESH_TOKEN);

  hasAccessToken = () => !!this.accessToken;

  hasRefreshToken = () => !!this.refreshToken;

  setAccessToken = (_accessToken: string | null) => {
    this.accessToken = _accessToken;
    if (_accessToken) localStorage.setItem(ACCESS_TOKEN, _accessToken);
    else localStorage.removeItem(ACCESS_TOKEN);
  };

  setRefreshToken = (_refreshToken: string | null) => {
    this.refreshToken = _refreshToken;
    if (_refreshToken) localStorage.setItem(REFRESH_TOKEN, _refreshToken);
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

  private authHeader = () =>
    this.hasAccessToken()
      ? { Authorization: `Bearer ${this.accessToken}` }
      : {};

  private fetcher = (resource: string, { method, body, query }) =>
    fetch(this.base + resource + withQuery(query), {
      method,
      headers: {
        ...CONTENT_TYPE,
        ...this.authHeader(),
      },
      body: JSON.stringify(body),
    }).then((response) => {
      if (response.ok) return isJSON(response);
      if (response.status === 401) {
        if (this.hasAccessToken()) this.setAccessToken(null);
        if (this.hasRefreshToken())
          return this.refresh().then(() =>
            this.fetcher(resource, { method, body, query }),
          );
      }
      throw Error(response.statusText);
    });

  private refresh = () =>
    fetch(this.base + this.refreshPath, {
      method: "POST",
      headers: {
        ...CONTENT_TYPE,
        Authorization: `Bearer ${this.refreshToken}`,
      },
    })
      .then((response) => {
        if (response.ok) return isJSON(response);
        if (response.status === 401) this.removeTokens();
        throw Error(response.statusText);
      })
      .then(({ access, refresh }) => {
        this.setAccessToken(access);
        if (refresh) this.setRefreshToken(refresh);
      });

  get = (resource: string, options?) =>
    this.fetcher(resource, { ...options, method: "GET" });

  post = (resource: string, body?, options?) =>
    this.fetcher(resource, { ...options, method: "POST", body });

  put = (resource: string, body?, options?) =>
    this.fetcher(resource, { ...options, method: "PUT", body });

  delete = (resource: string, options?) =>
    this.fetcher(resource, { ...options, method: "DELETE" });
}
