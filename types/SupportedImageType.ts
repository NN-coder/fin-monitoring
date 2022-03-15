import { MimeType } from 'file-type';

export type SupportedImageType = Extract<
  MimeType,
  'image/avif' | 'image/jpeg' | 'image/png' | 'image/tiff' | 'image/webp'
>;

export const supportedImageTypes: SupportedImageType[] = [
  'image/avif',
  'image/jpeg',
  'image/png',
  'image/tiff',
  'image/webp',
];

export const isSupportedImageType = (value: unknown): value is SupportedImageType =>
  supportedImageTypes.includes(value as SupportedImageType);
