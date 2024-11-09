export type Input = string | URL;
interface ExtraOptions {
    query?: object;
    auth?: boolean;
}
export type Options = RequestInit & ExtraOptions;
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
    _get: (input: Input, options?: Options) => Promise<any>;
    get: (input: Input, options?: Options) => Promise<any>;
    _head: (input: Input, options?: Options) => Promise<any>;
    head: (input: Input, options?: Options) => Promise<any>;
    _post: (input: Input, body?: any, options?: Options) => Promise<any>;
    post: (input: Input, body?: any, options?: Options) => Promise<any>;
    _put: (input: Input, body?: any, options?: Options) => Promise<any>;
    put: (input: Input, body?: any, options?: Options) => Promise<any>;
    _patch: (input: Input, body?: any, options?: Options) => Promise<any>;
    patch: (input: Input, body?: any, options?: Options) => Promise<any>;
    _delete: (input: Input, options?: Options) => Promise<any>;
    delete: (input: Input, options?: Options) => Promise<any>;
    options: (input: Input, options?: Options) => Promise<any>;
    connect: (input: Input, options?: Options) => Promise<any>;
    trace: (input: Input, options?: Options) => Promise<any>;
}
export {};
