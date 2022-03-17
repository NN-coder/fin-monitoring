export const getImageData = async (image: File) =>
  Array.from(new Uint8Array(await image.arrayBuffer()));
