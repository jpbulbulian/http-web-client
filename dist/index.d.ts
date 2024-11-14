export type Input = string | URL;
interface ExtraOptions {
    query?: object;
    auth?: boolean;
}
export type Options = RequestInit & ExtraOptions;
export declare function isValidURL(urlString: Input): boolean;
export default class HttpWebClient {
    private readonly _base;
    private readonly _refreshEndpoint?;
    /**
     * HTTP Web Client based on native browsers fetch API
     * @param _base Base URL for fetching (optional)
     * @param _refreshEndpoint Endpoint to tokens refresh (optional)
     */
    constructor(_base?: string, _refreshEndpoint?: string);
    private _accessToken;
    private _refreshToken;
    hasAccessToken: () => boolean;
    hasRefreshToken: () => boolean;
    setAccessToken: (accessToken: string | null) => void;
    setRefreshToken: (refreshToken: string | null) => void;
    setTokens: ({ access, refresh }: {
        access: any;
        refresh: any;
    }) => void;
    removeTokens: () => null;
    private _fetcher;
    private readonly _refresh;
    private readonly _method;
    private readonly _methodWithBody;
    _get: <T>(input: Input, options?: Options) => Promise<T>;
    get: <T>(input: Input, options?: Options) => Promise<T>;
    _head: <T>(input: Input, options?: Options) => Promise<T>;
    head: <T>(input: Input, options?: Options) => Promise<T>;
    _post: <T>(input: Input, body?: any, options?: Options) => Promise<T>;
    post: <T>(input: Input, body?: any, options?: Options) => Promise<T>;
    _put: <T>(input: Input, body?: any, options?: Options) => Promise<T>;
    put: <T>(input: Input, body?: any, options?: Options) => Promise<T>;
    _patch: <T>(input: Input, body?: any, options?: Options) => Promise<T>;
    patch: <T>(input: Input, body?: any, options?: Options) => Promise<T>;
    _delete: <T>(input: Input, options?: Options) => Promise<T>;
    delete: <T>(input: Input, options?: Options) => Promise<T>;
    options: <T>(input: Input, options?: Options) => Promise<T>;
    connect: <T>(input: Input, options?: Options) => Promise<T>;
    trace: <T>(input: Input, options?: Options) => Promise<T>;
}
export {};
