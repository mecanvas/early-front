export interface CanvasOrderList {
  id: number;
  orderNo: number;
  username: string;
  phone: string;
  orderRoute: number;
  scaleType?: number;
  originImgUrl: string;
  paperNames: string[];
  createdAt: string;
}

export interface CanvasOrderDetail extends CanvasOrderList {
  canvasFrameUrls: string[];
}
