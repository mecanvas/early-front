import { Uploader } from './User';

export interface ProductList {
  id: number;
  title: string;
  meta: string;
  price: number;
  thumb: string;
  status: 1 | 2; // 1= 판매중 2= 품절
}

export interface ProductSeo {
  seoTitle: string;
  seoDesc: string;
  seoImg: string;
  seoKeywords: string;
}

export interface ProductOptionDetail {
  id: number;
  text: string;
  additionalPrice: number;
}

export interface ProductOption {
  type: 1 | 2; // 1 = 단독형 2 = 조합형
  options: { id: number; optionName: string; value: ProductOptionDetail[] }[] | null;
}

export interface DeliveryOption {
  deliveryPrice: number;
  additionalPrice: number;
  limit: number; // 조건충족시
}

export interface Product extends ProductList {
  /**
   *  id: number;
   * title: string;
   * meta: string;
   * price: number;
   * thumb: string;
   * status : 1 | 2;
   *
   */
  subThumb: string[]; // 추가 썸네일
  uploader: Uploader; // 업로더
  description: string; // 상품설명
  productOption: ProductOption; // 단독 or 조합형 옵션
  deliveryOption: DeliveryOption; // 배송 요금
  seo: ProductSeo;
}
