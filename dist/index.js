"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qs_1 = __importDefault(require("qs"));
const CONTENT_TYPE = { "Content-Type": "application/json" };
const ACCESS_TOKEN = "access";
const REFRESH_TOKEN = "refresh";
const withQuery = (query) => (query ? `?${qs_1.default.stringify(query)}` : "");
const isJSON = (response) => response.headers?.get("content-type")?.startsWith("application/json")
    ? response.json()
    : response.text();
class HttpWebClient {
    /**
     * HTTP Web Client based on native browsers fetch API
     * @param base Base URL for fetching
     * @param refreshPath Path to the endpoint to tokens refresh
     */
    constructor(base, refreshPath) {
        this.base = base;
        this.refreshPath = refreshPath;
        this.accessToken = localStorage.getItem(ACCESS_TOKEN);
        this.refreshToken = localStorage.getItem(REFRESH_TOKEN);
        this.hasAccessToken = () => !!this.accessToken;
        this.hasRefreshToken = () => !!this.refreshToken;
        this.setAccessToken = (_accessToken) => {
            this.accessToken = _accessToken;
            if (_accessToken)
                localStorage.setItem(ACCESS_TOKEN, _accessToken);
            else
                localStorage.removeItem(ACCESS_TOKEN);
        };
        this.setRefreshToken = (_refreshToken) => {
            this.refreshToken = _refreshToken;
            if (_refreshToken)
                localStorage.setItem(REFRESH_TOKEN, _refreshToken);
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
        this.authHeader = () => this.hasAccessToken()
            ? { Authorization: `Bearer ${this.accessToken}` }
            : {};
        this.fetcher = (resource, { method, body, query }) => fetch(this.base + resource + withQuery(query), {
            method,
            headers: {
                ...CONTENT_TYPE,
                ...this.authHeader(),
            },
            body: JSON.stringify(body),
        }).then((response) => {
            if (response.ok)
                return isJSON(response);
            if (response.status === 401) {
                if (this.hasAccessToken())
                    this.setAccessToken(null);
                if (this.hasRefreshToken())
                    return this.refresh().then(() => this.fetcher(resource, { method, body, query }));
            }
            throw Error(response.statusText);
        });
        this.refresh = () => fetch(this.base + this.refreshPath, {
            method: "POST",
            headers: {
                ...CONTENT_TYPE,
                Authorization: `Bearer ${this.refreshToken}`,
            },
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
        this.get = (resource, options) => this.fetcher(resource, { ...options, method: "GET" });
        this.post = (resource, body, options) => this.fetcher(resource, { ...options, method: "POST", body });
        this.put = (resource, body, options) => this.fetcher(resource, { ...options, method: "PUT", body });
        this.delete = (resource, options) => this.fetcher(resource, { ...options, method: "DELETE" });
    }
}
exports.default = HttpWebClient;
