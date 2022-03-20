export enum SupportedImageType {
  'image/avif' = 'image/avif',
  'image/jpeg' = 'image/jpeg',
  'image/png' = 'image/png',
  'image/tiff' = 'image/tiff',
  'image/webp' = 'image/webp',
}

export const isSupportedImageType = (value: unknown): value is SupportedImageType =>
  Object.values(SupportedImageType).includes(value as SupportedImageType);
