import Resizer from 'react-image-file-resizer';

export const resizeFile = (file: File, maxHeight: number) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1000,
      maxHeight,
      'JPEG',
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      'base64',
    );
  });
