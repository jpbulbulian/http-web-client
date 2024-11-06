export default class HttpWebClient {
    private base;
    private refreshPath?;
    /**
     * HTTP Web Client based on native browsers fetch API
     * @param base Base URL for fetching
     * @param refreshPath Path to the endpoint to tokens refresh
     */
    constructor(base: string, refreshPath?: string);
    private accessToken;
    private refreshToken;
    hasAccessToken: () => boolean;
    hasRefreshToken: () => boolean;
    setAccessToken: (_accessToken: string | null) => void;
    setRefreshToken: (_refreshToken: string | null) => void;
    setTokens: ({ access, refresh }: {
        access: any;
        refresh: any;
    }) => void;
    removeTokens: () => null;
    private authHeader;
    private fetcher;
    private refresh;
    get: (resource: string, options?: any) => any;
    post: (resource: string, body?: any, options?: any) => any;
    put: (resource: string, body?: any, options?: any) => any;
    delete: (resource: string, options?: any) => any;
}
