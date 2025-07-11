export interface EmbeddedAsset {
    content: string;
    viewBox: string;
}
export declare const EMBEDDED_ASSETS: Record<string, EmbeddedAsset>;
export declare function getAsset(name: string): EmbeddedAsset | null;
export declare function getAssetNames(): string[];
//# sourceMappingURL=embedded-assets.d.ts.map