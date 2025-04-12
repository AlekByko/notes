/**
 * Cuts out an ImDa (ImageData) from given 2d canvas context using normalized coordinates and normalized size:
 * - `n...` stands for normalized coordinates
 * - `p...` stands for coordinates in pixel space
 *
 * !!! WARNING !!!
 * THIS DOES NOT GUARANTEE GAPS-FREE OR OVERLAPS-FREE TILES WHEN TILING THE ENTIRE IMAGE
 *
 * HINT: you should work in pixel space instead
 */
export function getImdaFromNormedBox__UNSAFE(
    context: CanvasRenderingContext2D,
    /** has to be [0; 1) */
    nx: number,
    /** has to be [0; 1) */
    ny: number,
    /** has to be [0: 1] */
    nw: number,
    /** has to be [0: 1] */
    nh: number,
    totalWidth: number, totalHeight: number
) {

    const px = Math.floor(nx * totalWidth);
    const py = Math.floor(ny * totalHeight);
    const pxw = Math.ceil((nx + nw) * totalWidth);
    const pyh = Math.ceil((ny + nh) * totalHeight);
    const pw = pxw - px;
    const ph = pyh - py;
    const imda = context.getImageData(px, py, pw, ph);
    return imda;
}


export function chopDiscreteDistanceIntoPixelPerfectChunks(distance: number, numberOfTiles: number) {

    const boundaries: number[] = [];
    for (let i = 0; i <= numberOfTiles; i++) {
        boundaries.push(Math.round(i * distance / numberOfTiles));
    }

    const tiles: [x: number, width: number][] = [];
    for (let i = 0; i < numberOfTiles; i++) {
        const start = boundaries[i];
        const end = boundaries[i + 1];
        const width = end - start;
        tiles.push([start, width]);
    }

    return tiles;
}

export function zipToGrid<T, U, V>(
    one: T[],
    another: U[],
    zip: (one: T, another: U) => V
): V[][] {
    const result: V[][] = [];

    for (let i = 0; i < one.length; i++) {
        const row: V[] = [];

        for (let j = 0; j < another.length; j++) {
            const zipped = zip(one[i], another[j]);
            row.push(zipped);
        }

        result.push(row);
    }

    return result;
}

export function tileDiscreteRectPixelPerfect(
    width: number, height: number,
    numberOfHorizontalTiles: number, numberOfVerticalTiles: number,
) {
    const horizontal = chopDiscreteDistanceIntoPixelPerfectChunks(width, numberOfHorizontalTiles);
    const vertical = chopDiscreteDistanceIntoPixelPerfectChunks(height, numberOfVerticalTiles);
    const zipped = zipToGrid(horizontal, vertical, (
        [x, width],
        [y, height],
    ) => {
        return { x, y, width, height };
    });
    return zipped;
}
