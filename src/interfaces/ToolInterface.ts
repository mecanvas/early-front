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

export interface SelectedFrameInfo {
  width: string;
  height: string;
}

export interface FramePrice {
  name: string;
  price: number;
  id: number;
}

export interface FramePosition {
  left: string;
  top: string;
}

export interface CanvasFramePositionList {
  id: number;
  left: number;
  top: number;
}
