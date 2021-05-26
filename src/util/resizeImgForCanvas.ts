// url, 너비, 높이만 주면 캔버스 크기로 리사이징

export const resizeImgForCanvas = (url: string, width: number, height: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const img = new Image(width, height);
  img.src = url;
  img.crossOrigin = 'Anonymous';
  const ctx = canvas.getContext('2d');
  (ctx as CanvasRenderingContext2D).imageSmoothingQuality = 'high';

  img.onload = () => {
    ctx?.drawImage(img, 0, 0, width, height);
  };
  return canvas;
};
