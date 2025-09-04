import { isDefined } from './core';
import { M3U8 } from './m3u8';

export function writeMinM3U8(playlist: M3U8): string {
    const { streams, version } = playlist;
    const lines: string[] = [];
    lines.push(`#EXTM3U`);
    if (isDefined(version)) {
        lines.push(`#EXT-X-VERSION:${version}`);
    }
    for (const stream of streams) {
        const { bandwidth, resolution, url, codecs, frameRate, name } = stream;
        const top = [`#EXT-X-STREAM-INF:`];
        top.push(`BANDWIDTH=${bandwidth}`);
        if (isDefined(codecs)) {
            top.push(`,CODECS="${codecs}"`);
        }
        top.push(`,RESOLUTION=${resolution.width}x${resolution.height}`);
        if (isDefined(frameRate)) {
            top.push(`,FRAME-RATE=${frameRate}`);
        }
        if (isDefined(name)) {
            top.push(`,NAME="${name}"`);
        }
        lines.push(top.join(''));
        lines.push(url);
    }
    return lines.join('\n');
}
