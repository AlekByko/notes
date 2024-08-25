import { makeLab, makeXyz, setLabByXyz, setXyzByRgb } from './coloring';
import { broke, fail } from './shared/core';

const sqrt2Pi = Math.sqrt(2 * Math.PI); // do not move, since processed first come first go

export type ProcessImageData = (imda: ImageData, imageWidth: number) => void;

export function pickHow(mode: Mode) {
    switch (mode) {
        case 'nothing': return nothing;
        case 'gauss3': return gauss3;
        case 'gauss5': return gauss5;
        case 'gauss7': return gauss7;
        case 'gauss9': return gauss9;
        case 'gauss11': return gauss11;
        case 'gauss13': return gauss13;
        case 'gauss101': return gauss101;
        case 'averaged': return averaged;
        case 'weighted': return weighted;
        case 'LABed': return LABed;
        case 'adaptive': return adaptive;
        default: return broke(mode);
    }
}

/** mutates the given array */
function normalizeInPlace(values: number[]): void {
    let sum = 0;
    for (let i = 0; i < values.length; i++) {
        sum += values[i];
    }
    for (let i = 0; i < values.length; i++) {
        values[i] /= sum;
    }
}


const gaussKernel3 = makeGaussianKernel(3);
const gaussKernel5 = makeGaussianKernel(5);
const gaussKernel7 = makeGaussianKernel(7);
const gaussKernel9 = makeGaussianKernel(9);
const gaussKernel11 = makeGaussianKernel(11);
const gaussKernel13 = makeGaussianKernel(13);
const gaussKernel101 = makeGaussianKernel(101);

function gauss3(imda: ImageData, imageWidth: number): void {
    weighted(imda);
    applyKernelToR(imda, imageWidth, gaussKernel3, 3);
}
function gauss5(imda: ImageData, imageWidth: number): void {
    weighted(imda);
    applyKernelToR(imda, imageWidth, gaussKernel5, 5);
}
function gauss7(imda: ImageData, imageWidth: number): void {
    weighted(imda);
    applyKernelToR(imda, imageWidth, gaussKernel7, 7);
}
function gauss9(imda: ImageData, imageWidth: number): void {
    weighted(imda);
    applyKernelToR(imda, imageWidth, gaussKernel9, 9);
}
function gauss11(imda: ImageData, imageWidth: number): void {
    weighted(imda);
    applyKernelToR(imda, imageWidth, gaussKernel11, 11);
}
function gauss13(imda: ImageData, imageWidth: number): void {
    weighted(imda);
    applyKernelToR(imda, imageWidth, gaussKernel13, 13);
}
function gauss101(imda: ImageData, imageWidth: number): void {
    weighted(imda);
    applyKernelToR(imda, imageWidth, gaussKernel101, 101);
}

function makeGaussianKernel(size: number): number[] {
    if (size % 2 === 0) return fail(`Kernel size ${size} must be an odd number.`);

    const sigma = (size - 1) / 6; // magic numbers
    const kernel: number[] = [];
    const halfSize = (size - 1) / 2;
    const twoSigmaSquare = 2 * sigma * sigma;
    const normalizationFactor = 1 / (sqrt2Pi * sigma);

    for (let y = -halfSize; y <= halfSize; y++) {
        for (let x = -halfSize; x <= halfSize; x++) {
            const exponent = -(x * x + y * y) / twoSigmaSquare;
            const value = normalizationFactor * Math.exp(exponent);
            kernel.push(value);
        }
    }
    console.group(size);
    // dumpKernel(kernel, size);

    console.groupEnd()
    normalizeInPlace(kernel);
    return kernel;
};


void dumpKernel;
function dumpKernel(kernel: number[], size: number) {
    let row : number[] = [];
    for (let i = 0; i < kernel.length; i ++) {
        if (row.length === size) {
            console.log(row);
            row = [];
        }
        row.push(kernel[i]);
    }
    if (row.length > 0) {
        console.log(row);
    }
}



/** assuming gray image only applying the kernel to R in [R, G, B, A] */
function applyKernelToR(imda: ImageData, imageWidth: number, kernel: number[], kernelSize: number): void {

    const stride = 4; // [R, G, B, A]
    const { data } = imda;
    const imageHeight = data.length / stride / imageWidth;
    const kernelHalf = (kernelSize - 1) / 2;
    for (let sy = 0; sy < imageHeight; sy++) {
        for (let sx = 0; sx < imageWidth; sx++) {
            let s = 0;
            for (let ki = 0; ki < kernel.length; ki++) {
                /** below:
                    k - kernel value
                    ki - kernel index
                    kx, ky - kernel x, y
                    skx, sky - image x, y of kernel x, y
                    ski - image index at kernel x,y
                    sk - image value at kernel x,y
                 */
                const k = kernel[ki];
                const kx = ki % kernelSize;
                const ky = (ki - kx) / kernelSize;
                const skx = sx - kernelHalf + kx;
                const sky = sy - kernelHalf + ky;
                let ski = (sky * imageWidth + skx) * stride + 0;  // we only care about R in [R, G, B, A]

                let sk = 0; // anything outside the image is black
                if (ski >= 0 && ski < data.length) {
                    sk = data[ski];
                }

                s += sk * k; // <-- accumulating weighed values
            }
            s = Math.round(s);
            const si = (sy * imageWidth + sx) * stride;
            data[si + 0] = s;
            data[si + 1] = s;
            data[si + 2] = s;
            // data[si + 3] = 0;
        }
    }
}

function nothing(_: ImageData): void {
    // do nothing
}

function averaged(imda: ImageData): void {
    // do nothing
    const { data } = imda;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i + 0];
        const g = data[i + 1];
        const b = data[i + 2];
        // const a = data[i + 3];
        const y = (r + g + b) / 3;
        data[i + 0] = y;
        data[i + 1] = y;
        data[i + 2] = y;
    }
}
function weighted(imda: ImageData): void {
    // do nothing
    const { data } = imda;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i + 0];
        const g = data[i + 1];
        const b = data[i + 2];
        // const a = data[i + 3];
        const y = 0.299 * r + 0.587 * g + 0.114 * b;
        data[i + 0] = y;
        data[i + 1] = y;
        data[i + 2] = y;
    }
}
function adaptive(imda: ImageData): void {
    weighted(imda);
    const { data } = imda;
    const stride = 4;
    for (let i = 0; i < data.length; i += stride) {
        const v = data[i + 0];
        void v;
    }
}
interface Xy {
    x: number;
    y: number;
}
function setXyAt(index: number, at: Xy, width: number, stride: number): void {
    const remainder = index % stride;
    index -= remainder;
    index /= stride;
    const x = index % width;
    index -= x;
    const y = index / width;
    at.x = x;
    at.y = y;
}
void setXyAt;
function xyAt(x: number, y: number, width: number, stride: number): number {
    const at = (y * width + x) * stride;
    return at;
}
void xyAt;
function LABed(imda: ImageData): void {
    // do nothing
    const { data } = imda;
    const lab = makeLab();
    const xyz = makeXyz();
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i + 0];
        const g = data[i + 1];
        const b = data[i + 2];

        setXyzByRgb(r, g, b, xyz);
        setLabByXyz(xyz, lab);

        let [l] = lab;
        l = Math.round(l / 100 * 255);
        data[i + 0] = l;
        data[i + 1] = l;
        data[i + 2] = l;
    }
}
const allModes = [
    'nothing',
    'gauss3',
    'gauss5',
    'gauss7',
    'gauss9',
    'gauss11',
    'gauss13',
    'gauss101',
    'averaged', 'weighted', 'LABed', 'adaptive'] as const;
export type Mode = typeof allModes[number];
export const modes = [...allModes];
