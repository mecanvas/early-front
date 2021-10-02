import { Uploader } from './User';

// 1 = 단독형 2 = 조합형
export enum OptionType {
  SINGLE = 1,
  MULTI = 2,
}

// 제품 리스트
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

// 제품 옵션 정보
export interface ProductOptionDetail {
  optionValueId: number;
  value: string;
  additionalPrice: number;
  stock: number;
}

// 제품 옵션 정보
export interface SelectedOptionValue {
  optionId: number;
  optionName: string;
  optionValueId: number;
  value: string;
  additionalPrice: number;
  stock: number;
}

// 고른 옵션 축약어
interface OptionAbbr {
  fullName: string;
  name: string;
}

// 조합형에서 옵션 골랐을 시 저장 인터페이스
export interface ProductOptionSelectList {
  listId: number;
  optionAbbr: OptionAbbr;
  options: SelectedOptionValue[];
  qty: number; // 개수
  price: number; // 옵션의 총 가격
}

// 제품 옵션 단독형 or 조합형
export interface ProductOption {
  type: 1 | 2;
  stock?: number; // 단독형일시 재고표시
  options: { optionId: number; optionName: string; optionValues: ProductOptionDetail[] }[] | null;
}

// 제품 배송 옵션
export interface DeliveryOption {
  deliveryPrice: number;
  additionalPrice: number;
  limit: number; // 조건충족시
}

// 제품 상세
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
