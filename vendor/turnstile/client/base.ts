import type {
    ApiErrorResponse,
    ApiResponse,
    RequestOptions,
    TurnstileClientOptions,
} from './types';

export class TurnstileError extends Error {
    constructor(
        message: string,
        public status: number,
        public code: number,
        public result: string,
        public details?: unknown
    ) {
        super(message);
        this.name = 'TurnstileError';
    }
}

export class BaseApiClient {
    protected baseUrl: string;
    protected token?: string;
    protected customFetch?: typeof fetch;

    constructor(options: TurnstileClientOptions) {
        this.baseUrl = options.baseUrl.replace(/\/$/, ''); // Remove trailing slash
        this.token = options.token;
        this.customFetch = options.fetch;
    }

    protected get fetch(): typeof fetch {
        return this.customFetch || globalThis.fetch.bind(globalThis);
    }

    /**
     * Update the authentication token
     */
    setToken(token: string | undefined) {
        this.token = token;
    }

    /**
     * Make an authenticated request to the API
     */
    /**
     * Internal method to perform the fetch and basic error handling
     */
    private async _fetchJson<T>(path: string, options: RequestOptions): Promise<ApiResponse<T>> {
        const { token, ...init } = options;
        const headers = new Headers(init.headers);

        const authToken = token || this.token;
        if (authToken) {
            headers.set('Authorization', `Bearer ${authToken}`);
        }

        if (init.body && !headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }

        const url = `${this.baseUrl}${path}`;
        const res = await this.fetch(url, {
            ...init,
            headers,
        });

        if (!res.ok) {
            try {
                const errorResponse: ApiResponse<null> = await res.json();
                throw new TurnstileError(
                    errorResponse.message || `API Error: ${res.statusText} (${res.status})`,
                    res.status,
                    errorResponse.code,
                    errorResponse.result,
                    (errorResponse as ApiErrorResponse).details
                );
            } catch (e) {
                if (e instanceof TurnstileError) throw e;
                throw new Error(`API Error: ${res.statusText} (${res.status})`);
            }
        }

        return await res.json();
    }

    /**
     * Make an authenticated request to the API
     */
    protected async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
        const response = await this._fetchJson<T>(path, options);

        if (response.result === 'error' || response.result === 'warn') {
            throw new TurnstileError(
                response.message,
                200, // Success status but logical error
                response.code,
                response.result,
                (response as ApiErrorResponse).details
            );
        }

        return (response as { data: T }).data;
    }

    /**
     * Make an authenticated request to the API and expect a paginated response
     */
    protected async requestPaginated<T, M = Record<string, unknown>>(
        path: string,
        options: RequestOptions = {}
    ): Promise<{ data: T[]; meta: M }> {
        const response = await this._fetchJson<T[]>(path, options);

        if (response.result === 'error' || response.result === 'warn') {
            throw new Error(response.message);
        }

        return {
            data: (response as { data: T[] }).data,
            meta: ((response as { meta?: M }).meta || {}) as M,
        };
    }
}
