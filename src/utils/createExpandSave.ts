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

export const createExpandCanvas = (selectedFrame: SelectedFrame[], expandType: 1 | 2 | 3) => {
  const canvas = document.createElement('canvas');

  selectedFrame.forEach((info: SelectedFrame) => {
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = info.imgUrl || '';
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      if (!ctx) return;
      if (typeof info.x !== 'number' || typeof info.y !== 'number') {
        console.error('position is Not Number');
        return;
      }
      const { naturalWidth, naturalHeight } = img;
      const [imgW, imgH] = getOriginRatio(naturalWidth, naturalHeight, IMAGE_MAXIMUM_WIDTH, IMAGE_MAXIMUM_HEIGHT);

      let w = 0;
      let h = 0;

      w = info.size.width;
      h = info.size.height;

      const scaleX = naturalWidth / imgW;
      const scaleY = naturalHeight / imgH;
      const crop = { x: info.x, y: info.y };
      const SIDE_EXPAND_CM = 2;

      const cmPxX = (cm: number) => cmToPx(cm) * scaleX;
      const cmPxY = (cm: number) => cmToPx(cm) * scaleY;
      const originFrameWidth = cmToPx(info.widthCm) * scaleX;
      const originFrameHeight = cmToPx(info.heightCm) * scaleY;
      const canvasFrameWidth = originFrameWidth + cmPxX(SIDE_EXPAND_CM * 2);
      const canvasFrameHeight = originFrameHeight + cmPxY(SIDE_EXPAND_CM * 2);

      const NotExpandDrawingOption = {
        img,
        cropX: crop.x * scaleX,
        cropY: crop.y * scaleY,
        imgW: w * scaleX,
        imgH: h * scaleY,
        canvasX: cmPxX(SIDE_EXPAND_CM),
        canvasY: cmPxY(SIDE_EXPAND_CM),
        canvasW: originFrameWidth,
        canvasH: originFrameHeight,
      };

      if (expandType === 1 || expandType === 2) {
        canvas.width = canvasFrameWidth;
        canvas.height = canvasFrameHeight;
        ctx.clearRect(0, 0, canvasFrameWidth, canvasFrameHeight);
        ctx.imageSmoothingQuality = 'high';

        drawing(ctx, NotExpandDrawingOption);

        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = info.bgColor || '#fff';
        ctx.fillRect(0, 0, canvasFrameWidth, canvasFrameHeight);
      }

      if (expandType === 3) {
        // 세이브 캔버스
        const originFrameWidth = cmToPx(info.widthCm) * scaleX;
        const originFrameHeight = cmToPx(info.heightCm) * scaleY;
        const canvasFrameWidth = originFrameWidth + cmPxX(SIDE_EXPAND_CM * 2);
        const canvasFrameHeight = originFrameHeight + cmPxY(SIDE_EXPAND_CM * 2);

        canvas.width = canvasFrameWidth;
        canvas.height = canvasFrameHeight;
        ctx.clearRect(0, 0, canvasFrameWidth, canvasFrameHeight);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
          img,
          crop.x * scaleX,
          crop.y * scaleY,
          w * scaleX,
          h * scaleY,
          cmPxX(SIDE_EXPAND_CM),
          cmPxY(SIDE_EXPAND_CM),
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
          w * scaleX,
          cmPxY(SIDE_EXPAND_CM),
          -canvasFrameWidth / 2 + cmPxX(SIDE_EXPAND_CM),
          canvasFrameHeight / 2 - cmPxY(SIDE_EXPAND_CM),
          canvasFrameWidth - cmPxX(SIDE_EXPAND_CM * 2),
          cmPxY(SIDE_EXPAND_CM),
        );

        // bottom
        ctx.drawImage(
          img,
          crop.x * scaleX,
          crop.y * scaleY + (h - cmToPx(SIDE_EXPAND_CM)) * scaleY,
          w * scaleX,
          cmPxY(SIDE_EXPAND_CM),
          -canvasFrameWidth / 2 + cmPxX(SIDE_EXPAND_CM),
          -canvasFrameHeight / 2,
          canvasFrameWidth - cmPxX(SIDE_EXPAND_CM * 2),
          cmPxY(SIDE_EXPAND_CM),
        );

        //좌우를 위해 다시 한번 180도 회전 (총 360도)
        ctx.rotate((180 * Math.PI) / 180);

        // right
        ctx.drawImage(
          img,
          crop.x * scaleX + (w - cmToPx(SIDE_EXPAND_CM)) * scaleX,
          crop.y * scaleY,
          cmPxX(SIDE_EXPAND_CM),
          h * scaleY,
          -canvasFrameWidth / 2,
          -canvasFrameHeight / 2 + cmPxY(SIDE_EXPAND_CM),
          cmPxX(SIDE_EXPAND_CM),
          originFrameHeight,
        );

        // left
        ctx.drawImage(
          img,
          crop.x * scaleX,
          crop.y * scaleY,
          cmPxX(SIDE_EXPAND_CM),
          h * scaleY,
          canvasFrameWidth / 2 - cmPxX(SIDE_EXPAND_CM),
          -canvasFrameHeight / 2 + cmPxY(SIDE_EXPAND_CM),
          cmPxX(SIDE_EXPAND_CM),
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
