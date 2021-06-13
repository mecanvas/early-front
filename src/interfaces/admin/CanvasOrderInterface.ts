export interface CanvasOrderList {
  id: number;
  username: string;
  email: string;
  originImgUrl: string;
  paperNames: string[];
  createdAt: string;
}

export interface CanvasOrderDetail extends CanvasOrderList {
  canvasFrameUrls: string[];
}
