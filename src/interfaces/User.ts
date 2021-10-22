import { ProductOrder } from './OrderInterface';

export interface Coupon {
  id: number;
  name: string;
  type: 1 | 2; // 1 = 원단위 2 = 퍼센트
  discount: number;
  expired: Date;
}

export interface Cart {
  id: number;
  product: ProductOrder;
}

export interface Uploader {
  id: number;
  email: string;
  username: string;
}
