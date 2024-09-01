import { LABed, applyKernelToR, fastGauss, inflictDynamicThreshold, makeGaussianKernel, makeMinMaxBySlidingWindow, makeVoting, pullKernelMiddleRow, weighted } from './manipulating-images';
import { broke } from './shared/core';

export type ProcessImageData = (imda: ImageData, makeImageData: () => ImageData) => ImageData;

const allModes = [
    'nothing',
    'gauss3','gauss5','gauss7','gauss9','gauss11','gauss13',
    'fastGauss13',
    'dynamicThreshold3','dynamicThreshold5','dynamicThreshold7','dynamicThreshold9','dynamicThreshold11','dynamicThreshold13',
    'dynamicThresholdWithMaxVoting13-3-3',
    'dynamicThresholdWithMaxVoting13-3-5',
    'gauss51',
    'gauss101',
    'averaged', 'weighted', 'LABed'] as const;
export type Mode = typeof allModes[number];
export const modes = [...allModes];

export function pickHow(mode: Mode): ProcessImageData {
    switch (mode) {
        case 'nothing': return nothing;
        case 'gauss3': return gauss3;
        case 'gauss5': return gauss5;
        case 'gauss7': return gauss7;
        case 'gauss9': return gauss9;
        case 'gauss11': return gauss11;
        case 'fastGauss13': return fastGauss13;
        case 'dynamicThreshold3': return dynamicThresholdOver(3);
        case 'dynamicThreshold5': return dynamicThresholdOver(5);
        case 'dynamicThreshold7': return dynamicThresholdOver(7);
        case 'dynamicThreshold9': return dynamicThresholdOver(9);
        case 'dynamicThreshold11': return dynamicThresholdOver(11);
        case 'dynamicThreshold13': return dynamicThresholdOver(13);
        case 'dynamicThresholdWithMaxVoting13-3-3': return dynamicThresholdWithMaxVotingOver(13, 3, 3);
        case 'dynamicThresholdWithMaxVoting13-3-5': return dynamicThresholdWithMaxVotingOver(13, 3, 5);
        case 'gauss13': return gauss13;
        case 'gauss51': return gauss51;
        case 'gauss101': return gauss101;
        case 'averaged': return averaged;
        case 'weighted': return imda => (weighted(imda), imda)
        case 'LABed': return imda => (LABed(imda), imda);
        default: return broke(mode);
    }
}

const gaussKernel3 = makeGaussianKernel(3);
const gaussKernel5 = makeGaussianKernel(5);
const gaussKernel7 = makeGaussianKernel(7);
const gaussKernel9 = makeGaussianKernel(9);
const gaussKernel11 = makeGaussianKernel(11);
const gaussKernel13 = makeGaussianKernel(13);
const gaussKernel51 = makeGaussianKernel(51);
const gaussKernel101 = makeGaussianKernel(101);

function gauss3(sourceImda: ImageData, makeImageData: () => ImageData): ImageData {
    weighted(sourceImda);
    const targetImda = makeImageData();
    applyKernelToR(sourceImda, targetImda, gaussKernel3, 3);
    return targetImda;
}
function gauss5(sourceImda: ImageData, makeImda: () => ImageData): ImageData {
    weighted(sourceImda);
    const targetImda = makeImda();
    applyKernelToR(sourceImda, targetImda, gaussKernel5, 5);
    return targetImda;
}
function gauss7(sourceImda: ImageData, makeImda: () => ImageData): ImageData {
    weighted(sourceImda);
    const targetImda = makeImda();
    applyKernelToR(sourceImda, targetImda, gaussKernel7, 7);
    return targetImda;
}
function gauss9(sourceImda: ImageData, makeImda: () => ImageData): ImageData {
    weighted(sourceImda);
    const targetImda = makeImda();
    applyKernelToR(sourceImda, targetImda, gaussKernel9, 9);
    return targetImda;
}
function gauss11(sourceImda: ImageData, makeImda: () => ImageData): ImageData {
    weighted(sourceImda);
    const targetImda = makeImda();
    applyKernelToR(sourceImda, targetImda, gaussKernel11, 11);
    return targetImda;
}
function gauss13(sourceImda: ImageData, makeImda: () => ImageData): ImageData {
    weighted(sourceImda);
    const targetImda = makeImda();
    applyKernelToR(sourceImda, targetImda, gaussKernel13, 13);
    return targetImda;
}

function fastGauss13(imda: ImageData, makeImda: () => ImageData): ImageData {
    weighted(imda);
    const tempImda = makeImda();
    const kernel = pullKernelMiddleRow(gaussKernel13);
    fastGauss(imda, tempImda, kernel);
    return imda;
}
function gauss51(sourceImda: ImageData, makeImda: () => ImageData): ImageData {
    weighted(sourceImda);
    const targetImda = makeImda();
    applyKernelToR(sourceImda, targetImda, gaussKernel51, 51);
    return targetImda;
}
function gauss101(sourceImda: ImageData, makeImda: () => ImageData): ImageData {
    weighted(sourceImda);
    const targetImda = makeImda();
    applyKernelToR(sourceImda, targetImda, gaussKernel101, 101);
    return targetImda;
}

function dynamicThresholdOver(windowSize: number) {
    return function dynamicThresholdUnder(imda: ImageData, makeImda: () => ImageData): ImageData {

        weighted(imda);
        const tempImda = makeImda();
        const kernel = pullKernelMiddleRow(gaussKernel13);

        fastGauss(imda, tempImda, kernel);
        const minmax = makeMinMaxBySlidingWindow(imda, windowSize);
        inflictDynamicThreshold(imda, minmax);

        return imda;
    }
}

function dynamicThresholdWithMaxVotingOver(gaussSize: number, minmaxSize: number, votingSize: number) {
    return function dynamicThresholdWithMaxVotingUnder(imda: ImageData, makeImda: () => ImageData): ImageData {

        weighted(imda);
        const tempImda = makeImda();
        const gaussKernel = makeGaussianKernel(gaussSize);
        const kernel = pullKernelMiddleRow(gaussKernel);

        fastGauss(imda, tempImda, kernel);
        const minmax = makeMinMaxBySlidingWindow(imda, minmaxSize);
        inflictDynamicThreshold(imda, minmax);

        const voted = makeVoting(imda, votingSize, 0);
        applyFrom1D(imda, voted);

        return imda;
    }
}


function applyFrom1D(imda: ImageData, voted: number[]): void {
    const stride = 4;
    const { data } = imda;
    const vstride = 1;
    let vi = -vstride;
    for (let si = 0; si < data.length; si += stride) {
        vi += vstride;
        const v = voted[vi];
        data[si + 0] = v;
        data[si + 1] = v;
        data[si + 2] = v;
        data[si + 3] = 255;
    }
}

function nothing(imda: ImageData): ImageData {
    // do nothing
    return imda;
}

function averaged(imda: ImageData): ImageData {
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
    return imda;
}

