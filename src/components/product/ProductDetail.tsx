import React from 'react';
import { Product } from 'src/interfaces/ProductInterface';

const ProductDetail = () => {
  const product: Product = {
    id: 1,
    title: '앙리 마티스',
    meta: '이걸 외 안사?',
    price: 3900,
    thumb: 'https://shop-phinf.pstatic.net/20210729_267/1627557958996mnAfE_PNG/003.png?type=w860',
    status: 1,
    subThumb: [
      'https://shop-phinf.pstatic.net/20210729_267/1627557958996mnAfE_PNG/003.png?type=w860',
      'https://shop-phinf.pstatic.net/20210729_43/1627557958907cEuFf_PNG/002.png?type=w860',
    ],
    uploader: {
      id: 1,
      email: 'earlystudio21@naver.com',
      username: '얼리21',
    },
    description: '이 상품 개쩌는데 왜 안사?',
    productOption: { type: 1, options: null },
    deliveryOption: { deliveryPrice: 3000, additionalPrice: 5000, limit: 20000 },
    seo: {
      seoTitle: '앙리마티스',
      seoDesc: '메타스크립트',
      seoImg: 'https://shop-phinf.pstatic.net/20210729_267/1627557958996mnAfE_PNG/003.png?type=w860',
      seoKeywords: '앙리마티스,포스터',
    },
  };

  return <div></div>;
};

export default ProductDetail;
