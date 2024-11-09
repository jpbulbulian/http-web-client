"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qs_1 = __importDefault(require("qs"));
const ACCESS_TOKEN = "access";
const REFRESH_TOKEN = "refresh";
const isJSON = (response) => response.headers?.get("Content-Type")?.startsWith("application/json")
    ? response.json()
    : response.text();
function isValidURL(urlString) {
    try {
        return Boolean(new URL(urlString));
    }
    catch {
        return false;
    }
}
class HttpWebClient {
    /**
     * HTTP Web Client based on native browsers fetch API
     * @param _base Base URL for fetching (optional)
     * @param _refreshEndpoint Endpoint to tokens refresh (optional)
     */
    constructor(_base = "", _refreshEndpoint) {
        this._base = _base;
        this._refreshEndpoint = _refreshEndpoint;
        this._accessToken = localStorage.getItem(ACCESS_TOKEN);
        this._refreshToken = localStorage.getItem(REFRESH_TOKEN);
        this.hasAccessToken = () => !!this._accessToken;
        this.hasRefreshToken = () => !!this._refreshToken;
        this.setAccessToken = (accessToken) => {
            this._accessToken = accessToken;
            if (accessToken)
                localStorage.setItem(ACCESS_TOKEN, accessToken);
            else
                localStorage.removeItem(ACCESS_TOKEN);
        };
        this.setRefreshToken = (refreshToken) => {
            this._refreshToken = refreshToken;
            if (refreshToken)
                localStorage.setItem(REFRESH_TOKEN, refreshToken);
            else
                localStorage.removeItem(REFRESH_TOKEN);
        };
        this.setTokens = ({ access, refresh }) => {
            this.setAccessToken(access);
            this.setRefreshToken(refresh);
        };
        this.removeTokens = () => {
            this.setAccessToken(null);
            this.setRefreshToken(null);
            return null;
        };
        this._refresh = () => fetch(this._base + this._refreshEndpoint, {
            method: "POST",
            headers: { Authorization: `Bearer ${this._refreshToken}` },
        })
            .then((response) => {
            if (response.ok)
                return isJSON(response);
            if (response.status === 401)
                this.removeTokens();
            throw Error(response.statusText);
        })
            .then(({ access, refresh }) => {
            this.setAccessToken(access);
            if (refresh)
                this.setRefreshToken(refresh);
        });
        this._method = (method, auth) => (input, options) => this._fetcher(input, { ...options, method, auth });
        this._methodWithBody = (method, auth) => (input, body, options) => this._fetcher(input, { ...options, method, body, auth });
        this._get = this._method("GET", true);
        this.get = this._method("GET");
        this._head = this._method("HEAD", true);
        this.head = this._method("HEAD");
        this._post = this._methodWithBody("POST", true);
        this.post = this._methodWithBody("POST");
        this._put = this._methodWithBody("PUT", true);
        this.put = this._methodWithBody("PUT");
        this._patch = this._methodWithBody("PATCH", true);
        this.patch = this._methodWithBody("PATCH");
        this._delete = this._method("DELETE", true);
        this.delete = this._method("DELETE");
        this.options = this._method("OPTIONS");
        this.connect = this._method("CONNECT");
        this.trace = this._method("TRACE");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _fetcher(input, options) {
        let { body } = options;
        const { method, headers = {}, query, auth } = options;
        if (body && !headers["Content-Type"]) {
            body = JSON.stringify(body);
            headers["Content-Type"] = "application/json";
        }
        if (auth && this.hasAccessToken())
            headers["Authorization"] = `Bearer ${this._accessToken}`;
        let url = isValidURL(input) ? input : this._base + input;
        if (query)
            url += `?${qs_1.default.stringify(query)}`;
        return fetch(url, { method, headers, body }).then((response) => {
            if (response.ok)
                return isJSON(response);
            if (auth && response.status === 401) {
                if (this.hasAccessToken())
                    this.setAccessToken(null);
                if (this._refreshEndpoint && this.hasRefreshToken())
                    return this._refresh().then(() => this._fetcher(input, options));
            }
            throw Error(response.statusText);
        });
    }
}
exports.default = HttpWebClient;
