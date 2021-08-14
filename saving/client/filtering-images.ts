export function grayScale(data: Uint8ClampedArray): void {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        data[i] = data[i + 1] = data[i + 2] = v;
    }
}

export function threshold(data: Uint8ClampedArray, threshold: number): void {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const v = r >= threshold ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = v;
    }
}
export function invert(data: Uint8ClampedArray): void {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const v = 255 - r;
        data[i] = data[i + 1] = data[i + 2] = v;
    }
}

export function convolute(
    src: Uint8ClampedArray,
    sw: number, sh: number,
    dst: Uint8ClampedArray,
    weights: number[],
): void {
    const side = Math.round(Math.sqrt(weights.length));
    const halfSide = Math.floor(side / 2);
    // pad output by the convolution matrix
    const w = sw;
    const h = sh;
    // go through the destination image pixels
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const sy = y;
            const sx = x;
            const dstOff = (y * w + x) * 4;
            // calculate the weighed sum of the source image pixels that
            // fall under the convolution matrix
            let r = 0, g = 0, b = 0;
            for (let cy = 0; cy < side; cy++) {
                for (let cx = 0; cx < side; cx++) {
                    const scy = sy + cy - halfSide;
                    const scx = sx + cx - halfSide;
                    if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                        const srcOff = (scy * sw + scx) * 4;
                        const wt = weights[cy * side + cx];
                        r += src[srcOff] * wt;
                        b = g = r;
                    }
                }
            }
            dst[dstOff] = r;
            dst[dstOff + 1] = g;
            dst[dstOff + 2] = b;
            dst[dstOff + 3] = 255;
        }
    }
}
