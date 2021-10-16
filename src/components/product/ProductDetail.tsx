import styled from '@emotion/styled';
import React from 'react';
import { Product } from 'src/interfaces/ProductInterface';
import ProductDescription from './ProductDescription';
import ProductOrderItem from './ProductOrderItem';
import ProductThumb from './ProductThumb';
import { useRouter } from 'next/router';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2em;
  padding-bottom: 2em;
`;

const ProductIntro = styled.div`
  width: 100%;
  padding: 1em;
  margin-bottom: 3em;
  display: flex;
  justify-content: space-around;
  @media all and (max-width: ${({ theme }) => theme.size.md}) {
    flex-direction: column;
  }
`;

const ProductDetail = () => {
  const { query } = useRouter();

  const product: Product = {
    id: parseInt(query.productId as string) || 1,
    title: ('앙리 마티스' + query.productId) as string,
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
    description: '이거아니야?!',
    productOption: { type: 1, stock: 1, options: null },
    // productOption: {
    //   type: 2,
    //   options: [
    //     {
    //       optionId: 1,
    //       optionName: '사진 선택',
    //       optionValues: [
    //         { optionValueId: 1, value: '모네1', additionalPrice: 0, stock: 0 },
    //         { optionValueId: 2, value: '모네2', additionalPrice: 0, stock: 0 },
    //         { optionValueId: 3, value: '모네3', additionalPrice: 0, stock: 0 },
    //       ],
    //     },
    //     {
    //       optionId: 2,
    //       optionName: '사이즈 선택',
    //       optionValues: [
    //         { optionValueId: 1, value: 'A4', additionalPrice: 0, stock: 0 },
    //         { optionValueId: 2, value: 'A3', additionalPrice: 100, stock: 2 },
    //         { optionValueId: 3, value: 'A2', additionalPrice: 300, stock: 3 },
    //       ],
    //     },
    //   ],
    // },
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
        {/* 썸넬 */}
        <ProductThumb thumb={product.thumb} subThumb={product.subThumb} alt={product.title} />

        {/* 옵션 선택 */}
        <ProductOrderItem
          title={product.title}
          meta={product.meta}
          uploader={product.uploader}
          price={product.price}
          status={product.status}
          thumb={product.thumb}
          productOption={product.productOption}
          deliveryOption={product.deliveryOption}
        />
      </ProductIntro>

      {/* 상품 설명 */}
      <ProductDescription description={product.description} />
    </Container>
  );
};

export default ProductDetail;
