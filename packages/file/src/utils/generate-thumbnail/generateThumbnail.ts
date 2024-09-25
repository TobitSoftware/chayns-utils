interface GenerateThumbnailOptions {
    file: File;
    callback: (previewUrl?: string, error?: string) => void;
}

export const generateThumbnail = ({ callback, file }: GenerateThumbnailOptions) => {
    const { type } = file;

    if (type.includes('video/')) {
        generateVideoThumbnail({ callback, file });

        return;
    }

    if (type.includes('image/')) {
        generatePreviewUrl({ callback, file });

        return;
    }

    callback(undefined, 'Unsupported file type. Please provide an image or video.');
};

interface GeneratePreviewUrlOptions {
    file: File;
    callback: (previewUrl: string) => void;
}

const generatePreviewUrl = ({ callback, file }: GeneratePreviewUrlOptions): void => {
    const reader = new FileReader();

    reader.onload = (event) => {
        const previewUrl = event.target?.result as string;

        callback(previewUrl);
    };

    reader.readAsDataURL(file);
};

interface GenerateVideoThumbnailOptions {
    file: File;
    callback: (previewUrl: string) => void;
}

const generateVideoThumbnail = ({ file, callback }: GenerateVideoThumbnailOptions) => {
    const canvas = document.createElement('canvas');
    const video = document.createElement('video');

    // this is important
    video.autoplay = true;
    video.muted = true;
    video.src = URL.createObjectURL(file);

    video.onloadeddata = () => {
        const ctx = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        video.pause();

        callback(canvas.toDataURL('image/png'));
    };
};
