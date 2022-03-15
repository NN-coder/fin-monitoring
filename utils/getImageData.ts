import { UnsupportedFileTypeError } from '../errors/UnsupportedFileTypeError';
import { isSupportedImageType } from '../types/SupportedImageType';

export const getImageData = async (image: File) => {
  if (!isSupportedImageType(image.type)) throw new UnsupportedFileTypeError();
  return Array.from(new Uint8Array(await image.arrayBuffer()));
};
