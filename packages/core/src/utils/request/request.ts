import { getAccessToken, getUser, setWaitCursor } from 'chayns-api';
import { RequestOptions, RequestResult } from '../../types/request';

export const request = async <Data = null, Body = null>({
    accessToken,
    auth = true,
    body,
    contentType = 'application/json',
    method,
    route = '',
    showWaitCursor = false,
    url,
    waitCursorText,
}: RequestOptions<Body>): Promise<RequestResult<Data>> => {
    const headers: HeadersInit = {};

    const user = getUser();

    const isAuthenticated = !!user?.personId;

    const accessTokenResult = await getAccessToken();

    if (isAuthenticated && auth) {
        headers.Authorization = `bearer ${accessToken ?? accessTokenResult.accessToken ?? ''}`;
    }

    const requestData: RequestInit = {
        credentials: 'same-origin',
        headers,
        method,
    };

    if (method !== 'GET') {
        if (typeof contentType === 'string') {
            headers['Content-Type'] = contentType;
        }

        if (body) {
            requestData.body = body instanceof FormData ? body : JSON.stringify(body);
        }
    }

    const result: RequestResult<Data> = {
        meta: {
            method,
            url: url + route,
            body: requestData.body,
        },
    };

    if (showWaitCursor) {
        void setWaitCursor({ text: waitCursorText, isEnabled: true });
    }

    const requestStart: number = Date.now();

    try {
        const response: Response = await fetch(url + route, requestData);

        result.requestDuration = Date.now() - requestStart;
        result.status = response.status;

        try {
            const dataString = await response.text();

            if (dataString && dataString.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                result.data = JSON.parse(dataString);
            }
        } catch (error) {
            if (error) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                result.error = error as Error;
            }
        }

        if (response.status === 429) {
            const retryAfterHeaderValue = response.headers.get('retry-after');

            if (retryAfterHeaderValue !== null) {
                let parsedRetryAfterValue;

                try {
                    parsedRetryAfterValue = parseInt(retryAfterHeaderValue, 10);

                    if (
                        typeof parsedRetryAfterValue === 'number' &&
                        !Number.isNaN(parsedRetryAfterValue)
                    ) {
                        result.retryAfter = parsedRetryAfterValue;
                    }
                } catch (error) {
                    if (error) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        result.error = error as Error;
                    }
                }
            }
        }
    } catch (error) {
        result.requestDuration = Date.now() - requestStart;

        if (error) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            result.error = error as Error;
        }
    }

    if (showWaitCursor) {
        void setWaitCursor({ isEnabled: false });
    }

    return result;
};
