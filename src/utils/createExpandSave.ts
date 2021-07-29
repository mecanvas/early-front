import { IMAGE_MAXIMUM_WIDTH, IMAGE_MAXIMUM_HEIGHT } from 'src/constants';
import { SelectedFrame } from 'src/store/reducers/frame';
import { cmToPx } from './cmToPx';
import { getOriginRatio } from './getOriginRatio';

const drawing = (
  ctx: CanvasRenderingContext2D,
  drawingOption: {
    img: HTMLImageElement;
    cropX: number;
    cropY: number;
    imgW: number;
    imgH: number;
    canvasW: number;
    canvasH: number;
    canvasX: number;
    canvasY: number;
  },
) => {
  const { canvasH, canvasW, canvasX, canvasY, cropX, cropY, img, imgH, imgW } = drawingOption;
  ctx.drawImage(img, cropX, cropY, imgW, imgH, canvasX, canvasY, canvasW, canvasH);

  return;
};

export const createExpandCanvas = (selectedFrame: SelectedFrame[], expandType: 1 | 2) => {
  const canvas = document.createElement('canvas');
  selectedFrame.forEach((info: SelectedFrame) => {
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = info.imgUrl || '';
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      if (!ctx) return;
      if (typeof info.x !== 'number' || typeof info.y !== 'number') {
        return;
      }
      const { naturalWidth, naturalHeight } = img;
      const [imgW, imgH] = getOriginRatio(naturalWidth, naturalHeight, IMAGE_MAXIMUM_WIDTH, IMAGE_MAXIMUM_HEIGHT);

      const isSquare = info.type === 1;

      let w = 0;
      let h = 0;

      if (isSquare) {
        // 정사각형이면 이미지 너비에 따라 정사각형
        if (imgW > imgH) {
          const [ratioW, ratioH] = getOriginRatio(info.size.width, info.size.height, imgH, imgH);
          w = ratioW;
          h = ratioH;
        } else {
          const [ratioW, ratioH] = getOriginRatio(info.size.width, info.size.height, imgW, imgW);
          w = ratioW;
          h = ratioH;
        }
      } else {
        const [ratioW, ratioH] = getOriginRatio(info.size.width, info.size.height, imgW, imgH);
        w = ratioW;
        h = ratioH;
      }
      const scaleX = naturalWidth / imgW;
      const scaleY = naturalHeight / imgH;
      const crop = { x: info.x, y: info.y };

      const NotExpandDrawingOption = {
        img,
        cropX: crop.x * scaleX,
        cropY: crop.y * scaleY,
        imgW: w * scaleX,
        imgH: h * scaleY,
        canvasX: 0,
        canvasY: 0,
        canvasW: w * scaleX,
        canvasH: h * scaleY,
      };

      if (expandType === 1) {
        canvas.width = w * scaleX;
        canvas.height = h * scaleY;
        ctx.clearRect(0, 0, w * scaleX, h * scaleY);
        drawing(ctx, NotExpandDrawingOption);
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = info.bgColor || '#fff';
        ctx.fillRect(0, 0, w * scaleX, h * scaleY);
      } else {
        // 세이브 캔버스
        const originFrameWidth = w * scaleX;
        const originFrameHeight = h * scaleY;
        const canvasFrameWidth = originFrameWidth + cmToPx(8) * scaleX;
        const canvasFrameHeight = originFrameHeight + cmToPx(8) * scaleY;

        canvas.width = w * scaleX + cmToPx(8);
        canvas.height = h * scaleY + cmToPx(8);

        canvas.width = canvasFrameWidth;
        canvas.height = canvasFrameHeight;
        ctx.clearRect(0, 0, canvasFrameWidth, canvasFrameHeight);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
          img,
          crop.x * scaleX,
          crop.y * scaleY,
          originFrameWidth,
          originFrameHeight,
          cmToPx(4) * scaleX,
          cmToPx(4) * scaleY,
          originFrameWidth,
          originFrameHeight,
        );

        ctx.save();
        //회전축을 위해 기준점을 센터로
        ctx.translate(canvasFrameWidth / 2, canvasFrameHeight / 2);
        //180도 회전
        ctx.rotate((180 * Math.PI) / 180);
        // 이미지 반전
        ctx.scale(-1, 1);

        // top
        ctx.drawImage(
          img,
          crop.x * scaleX,
          crop.y * scaleY,
          originFrameWidth,
          cmToPx(4) * scaleY,
          -canvasFrameWidth / 2 + cmToPx(4) * scaleX,
          canvasFrameHeight / 2 - cmToPx(4) * scaleY,
          canvasFrameWidth - cmToPx(8) * scaleX,
          cmToPx(4) * scaleY,
        );

        // bottom
        ctx.drawImage(
          img,
          crop.x * scaleX,
          crop.y * scaleY + (h - cmToPx(4)) * scaleY,
          originFrameWidth,
          cmToPx(4) * scaleY,
          -canvasFrameWidth / 2 + cmToPx(4) * scaleX,
          -canvasFrameHeight / 2,
          canvasFrameWidth - cmToPx(8) * scaleX,
          cmToPx(4) * scaleY,
        );

        //좌우를 위해 다시 한번 180도 회전 (총 360도)
        ctx.rotate((180 * Math.PI) / 180);

        // right
        ctx.drawImage(
          img,
          crop.x * scaleX + (w - cmToPx(4)) * scaleX,
          crop.y * scaleY,
          cmToPx(4) * scaleX,
          originFrameHeight,
          -canvasFrameWidth / 2,
          -canvasFrameHeight / 2 + cmToPx(4) * scaleY,
          cmToPx(4) * scaleX,
          originFrameHeight,
        );

        // left
        ctx.drawImage(
          img,
          crop.x * scaleX,
          crop.y * scaleY,
          cmToPx(4) * scaleX,
          originFrameHeight,
          canvasFrameWidth / 2 - cmToPx(4) * scaleX,
          -canvasFrameHeight / 2 + cmToPx(4) * scaleY,
          cmToPx(4) * scaleX,
          originFrameHeight,
        );

        ctx.restore();

        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = info.bgColor || '#fff';
        ctx.fillRect(0, 0, canvasFrameWidth, canvasFrameHeight);
      }
    };
  });

  return canvas;
};
