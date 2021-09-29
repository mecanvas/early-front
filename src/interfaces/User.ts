import { ProductList } from './ProductInterface';

export interface Coupon {
  id: number;
  name: string;
  type: 1 | 2; // 1 = 원단위 2 = 퍼센트
  discount: number;
  expired: Date;
}

export interface Order {
  id: number;
  orderNo: number;
  deliveryStatus: 1 | 2 | 3 | 4;
  product: ProductList;
  createAt: string;
}

export interface Cart {
  id: number;
  product: ProductList[];
}

export interface Uploader {
  id: number;
  email: string;
  username: string;
}
