
type BinaryImage = ReturnType<typeof createBinIm>;

export function createBinIm(width: number, height: number) {
    const numBytes = Math.ceil((width * height) / 8);
    const buffer = new ArrayBuffer(numBytes);
    const uint8View = new Uint8Array(buffer);
    uint8View.fill(0);
    return { width, height, buffer, uint8View };
}

export function setBinImAt(image: BinaryImage, x: number, y: number, setOrNot: boolean): void {
    const index = (y * image.width + x) >> 3;
    const bitPosition = x % 8;
    const bitMask = 1 << bitPosition;

    if (setOrNot) {
        image.uint8View[index] |= bitMask;
    } else {
        image.uint8View[index] &= ~bitMask;
    }
}

export function readBinImAt(image: BinaryImage, x: number, y: number): boolean {
    const index = (y * image.width + x) >> 3;
    const bitPosition = x % 8;
    return (image.uint8View[index] >> bitPosition) & 1 ? true : false;
}
