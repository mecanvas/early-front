export type ResizeCmd =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'bottom-center'
  | 'top-center'
  | 'right'
  | 'left';

export type TutorialType = 'all' | 'frame' | 'preview' | 'order' | 'price' | 'edit' | 'image' | 'size';

export interface FrameAttributes {
  // 미대오빠 캔버스 참고
  attribute: '정방' | '인물' | '풍경';
}

export interface FrameSize extends FrameAttributes {
  name: string;
  cm: string;
  size: {
    width: string;
    height: string;
  };
  price: number;
}

export interface CanvasFrameSizeInfo {
  width: number;
  height: number;
}

export interface FramePrice {
  name: string;
  cm: string; // 16cm x 16cm
  price: number;
  id: number;
}

export interface CanvasPosition {
  left: number;
  top: number;
}

export interface CroppedFrame {
  id: string;
  width: string;
  height: string;
  left: string;
  top: string;
  dataset: { originleft: string; origintop: string };

  imageCropStyle: {
    backgroundImage: string;
    backgroundColor: string;
    backgroundRepeat: string;
    backgroundSize: string;
    backgroundPositionX: string;
    backgroundPositionY: string;
    width: string;
    height: string;
    boxShadow: string;
    transform?: string;
  };
}
