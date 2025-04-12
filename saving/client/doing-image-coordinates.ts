/**
 * Cuts out an ImDa (ImageData) from given 2d canvas context using normalized coordinates and normalized size:
 * - `n...` stands for normalized coordinates
 * - `p...` stands for coordinates in pixel space
 *
 * !!! WARNING !!!
 * IT DOES NOT GUARANTEE GAPS-FREE OR OVERLAPS-FREE TILES WHEN TILING THE ENTIRE IMAGE
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
