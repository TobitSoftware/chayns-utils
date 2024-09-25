import { createDialog, DialogType } from 'chayns-api';

interface SelectFilesOptions {
    type?: string;
    multiple?: boolean;
    maxFileSizeInMB?: number;
}

export const selectFiles = ({
    type = '*/*',
    multiple = true,
    maxFileSizeInMB,
}: SelectFilesOptions): Promise<File[]> =>
    new Promise((resolve) => {
        const input = document.createElement('input');

        Object.assign(input, {
            type: 'file',
            accept: type !== '*/*' ? type : undefined,
            multiple,
            style: 'visibility: hidden; width: 0; height: 0; display: none;',
        });

        document.body.appendChild(input);

        input.addEventListener('change', (event) => {
            document.body.removeChild(input);
            const target = event.target as HTMLInputElement;
            const files = target?.files ? Array.from(target.files) : [];

            const filteredFiles = files.filter((file) => {
                const sizeInMB = file.size / 1024 / 1024;

                if (maxFileSizeInMB && sizeInMB > maxFileSizeInMB) return false;
                if (file.type.includes('video/') && sizeInMB > 500) return false;
                return !(file.type.includes('image/') && sizeInMB > 64);
            });

            if (files.length !== filteredFiles.length) {
                void createDialog({
                    type: DialogType.ALERT,
                    text: 'Einige Deiner ausgewählten Dateien sind zu groß.',
                }).open();
            }

            resolve(filteredFiles);
        });

        input.click();
    });
