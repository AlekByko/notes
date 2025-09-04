
export interface ExtXSteamInf {
    bandwidth: number;
    url: string;
    resolution: { width: number; height: number; };
    averageBandwidth?: number;
    frameRate?: string;
    closedCaptions?: string;
    name?: string;
    language?: string;
    codecs?: string;
}

export interface ExtXMedia {
    name: string;
    groupId: string;
    type: string;
    uri: string;
}

interface NameText {
    name: string;
    text: string;
}
export interface M3U8 {
    streams: ExtXSteamInf[];
    media?: ExtXMedia;
    version?: number;
    mouflon?: string;
    isIndependentSegments?: boolean;
    unknown?: NameText[];
}


