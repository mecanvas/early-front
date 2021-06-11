export type ResizeCmd =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'bottom-center'
  | 'top-center'
  | 'right'
  | 'left';

export interface FrameAttributes {
  // 미대오빠 캔버스 참고
  attribute: '정방' | '해경' | '인물' | '풍경';
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
  price: number;
  id: number;
}

export interface CanvasPosition {
  left: number;
  top: number;
}

export interface CanvasFramePositionList {
  id: number;
  left: number;
  top: number;
}
