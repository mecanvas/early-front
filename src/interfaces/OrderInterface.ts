import { DeliveryOption, ProductOptionSelectList } from './ProductInterface';

// 장바구니 및 주문 시 사용
export interface ProductOrder {
  type: 1 | 2; // 1= 단독 2= 조합
  thumb: string;
  productId: number;
  productTitle: string;
  deliveryOption: DeliveryOption; // 배송 요금

  // 조합형일시
  optionSelect: ProductOptionSelectList[] | null;

  // 단일형일시
  qty?: number;
  price?: number;
  stock?: number;
}

export interface Address {
  postCode: string;
  address: string;
  sido: string;
  sigungu: string;
  addressDetail: string;
}
