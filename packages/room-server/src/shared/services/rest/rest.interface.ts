export interface IAssetDTO {
  mimeType: string;
  token: string;
  bucket: string;
  size: number;
  width?: number;
  height?: number;
  preview?: string;
}
