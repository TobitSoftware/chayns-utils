export interface RequestOptions<Body> {
    accessToken?: string;
    auth?: boolean;
    body?: Body;
    contentType?: string | null;
    method: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';
    route?: string;
    showWaitCursor?: boolean;
    url: string;
    waitCursorText?: string;
}

interface Meta {
    [key: string]: unknown;
    body?: BodyInit | null;
    method: string;
    url: string;
}

export interface RequestResult<Data = unknown> {
    [key: string]: unknown;
    data?: Data;
    error?: Error;
    meta: Meta;
    requestDuration?: number;
    retryAfter?: number;
    status?: number;
}

export interface ApiFunctionResult<T = null, E = null> {
    data?: T;
    error?: Error;
    errorCode?: number;
    errorData?: E;
    errorMessage?: string;
    retryAfter?: number;
    status?: number;
}
