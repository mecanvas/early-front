import { ProductOptionSelectList } from './ProductInterface';

export interface ProductOrder {
  type: 1 | 2; // 1= 단독 2= 조합
  thumb: string;
  productId: number;
  productTitle: string;

  // 조합형일시
  optionSelect: ProductOptionSelectList[] | null;

  // 단일형일시
  qty?: number;
  price?: number;
}

export interface Address {
  postCode: string;
  address: string;
  sido: string;
  sigungu: string;
  addressDetail: string;
}
