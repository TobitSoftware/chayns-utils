import { getSite, getUser } from 'chayns-api';
import { request } from '@chayns-utils/core';

const IMAGE_SERVICE_API_V3_URL = 'https://cube.tobit.cloud/image-service/v3/Images';
const IMAGE_RESIZER_API_URL = 'https://cube.tobit.cloud/image-resizer-backend/api/v1.0/image';

interface Result {
    requestId: string;
    image: Image;
    baseDomain: string;
    signature: Signature;
}

interface Image {
    path: string;
    width: number;
    height: number;
    size: number;
    hash: string;
    preview: string;
    isSecured: boolean;
    format: string;
    fileExtension: string;
}

interface Signature {
    verify: string;
    signature: string;
    expires: Date;
}

interface Meta {
    preview: string;
    width: string;
    height: string;
}

interface UploadImageResult {
    key: string;
    base: string;
    meta?: Meta;
}

interface UploadImageOptions {
    file: File;
    shouldUploadImageToSite?: boolean;
}

export const uploadImage = async ({
    shouldUploadImageToSite,
    file,
}: UploadImageOptions): Promise<UploadImageResult | undefined> => {
    const site = getSite();
    const user = getUser();

    if (!user || !user.personId) {
        return undefined;
    }

    const uploaderId = shouldUploadImageToSite ? site.id : user.personId;

    const body = new FormData();

    body.append('File', file);

    const url =
        file.size > 10 * 1024 * 1024
            ? `${IMAGE_RESIZER_API_URL}/${uploaderId}`
            : `${IMAGE_SERVICE_API_V3_URL}/${uploaderId}`;

    const response = await request<Result, FormData>({
        url,
        method: 'POST',
        body,
    });

    const { data, status } = response;

    if (status === 201 && data) {
        const { image, baseDomain } = data;

        // Maps image-service-api-v3 result to v2 result.
        return {
            key: image.path,
            // Removes trailing slash from baseDomain, since image-service-api-v2 doesn't have a trailing slash on base.
            base: baseDomain.endsWith('/') ? baseDomain.slice(0, -1) : baseDomain,
            meta: {
                preview: image.preview,
                width: String(image.width),
                height: String(image.height),
            },
        };
    }

    throw Error(`Failed to POST image (status code: ${status ?? 404}).`);
};
