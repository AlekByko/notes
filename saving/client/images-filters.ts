
export type ProcessImageData<Tile> = (imda: ImageData, makeImageData: () => ImageData, tile: Tile) => ImageData;


export function applyFrom1D(imda: ImageData, values: number[]): void {
    const stride = 4;
    const { data } = imda;
    const vstride = 1;
    let vi = -vstride;
    for (let si = 0; si < data.length; si += stride) {
        vi += vstride;
        const v = values[vi];
        data[si + 0] = v;
        data[si + 1] = v;
        data[si + 2] = v;
        data[si + 3] = 255;
    }
}

export function nothing(imda: ImageData): ImageData {
    // do nothing
    return imda;
}
