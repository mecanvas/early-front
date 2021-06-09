export interface FrameSize {
  name: string;
  attribute: '정방' | '해경' | '인물' | '풍경';
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
