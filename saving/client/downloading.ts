import * as React from 'react';

export function downloadConfig(data: object): void {
    const json = JSON.stringify(data);
    downloadJson(json, 'config.json');
}

export function downloadJson(json: string, name: string): void {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = name;
    a.href = url;
    a.click();
    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 1000);
}

export function whenUploadedOver(whenUploaded: (text: string) => void) {
    return function whenUploadedUnder(e: React.ChangeEvent<HTMLInputElement>): void {
        const file = e.currentTarget.files![0];
        const reader = new FileReader();
        const { currentTarget: inputElement } = e;
        reader.onload = e => {
            const text = e.target!.result as string;
            inputElement.value = '';
            whenUploaded(text);
        };
        reader.readAsText(file);
        console.log(file);
    }
}
