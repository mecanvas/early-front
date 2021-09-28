import styled from '@emotion/styled';
import React from 'react';
import { APP_HEADER_HEIGHT } from 'src/constants';
import { Product } from 'src/interfaces/ProductInterface';
import ProductDescription from './ProductDescription';
import ProductOrderItem from './ProductOrderItem';
import ProductThumb from './ProductThumb';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: ${APP_HEADER_HEIGHT + 40}px;
  padding-bottom: 2em;
`;

const ProductIntro = styled.div`
  width: 100%;
  padding: 1em;
  display: flex;
  justify-content: space-around;
  @media all and (max-width: ${({ theme }) => theme.size.md}) {
    flex-direction: column;
  }
`;

const ProductDetail = () => {
  const product: Product = {
    id: 1,
    title: '앙리 마티스',
    meta: '이걸 외 안사? 이거만 붙여놔도 스타일링 끝임..;',
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
    // productOption: { type: 1, options: null },
    productOption: {
      type: 2,
      options: [
        {
          id: 1,
          optionName: '사진 선택',
          value: [
            { id: 1, text: '모네1', additionalPrice: 0 },
            { id: 2, text: '모네2', additionalPrice: 1000 },
            { id: 3, text: '모네3', additionalPrice: 3000 },
          ],
        },
      ],
    },
    deliveryOption: { deliveryPrice: 3000, additionalPrice: 5000, limit: 20000 },
    seo: {
      seoTitle: '앙리마티스',
      seoDesc: '메타스크립트',
      seoImg: 'https://shop-phinf.pstatic.net/20210729_267/1627557958996mnAfE_PNG/003.png?type=w860',
      seoKeywords: '앙리마티스,포스터',
    },
  };

  return (
    <Container>
      <ProductIntro>
        <ProductThumb thumb={product.thumb} subThumb={product.subThumb} alt={product.title} />
        <ProductOrderItem
          title={product.title}
          meta={product.meta}
          uploader={product.uploader}
          price={product.price}
          status={product.status}
          productOption={product.productOption}
          deliveryOption={product.deliveryOption}
        />
      </ProductIntro>

      <ProductDescription description={product.description} />
    </Container>
  );
};

export default ProductDetail;
