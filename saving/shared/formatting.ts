export function formatYesNo(value: boolean): string {
    return value ? 'Yes' : 'No';
}

export function formatInteger(value: number): string {
    const formatter = new window.Intl.NumberFormat('en-us');
    return formatter.format(value);
}

const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
export function formatBytes(value: number): string {
    let unitAt = 0;
    while (value >= 1024 && ++unitAt) {
        value = value / 1024;
    }
    return value.toFixed(value < 10 && unitAt > 0 ? 1 : 0) + ' ' + units[unitAt];
}
