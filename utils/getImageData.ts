import { isSupportedImageType } from '../types/supportedImageType';

export const getImageData = async (image: File) => {
  if (!isSupportedImageType(image.type)) return null;
  return Array.from(new Uint8Array(await image.arrayBuffer()));
};
