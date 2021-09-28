import styled from '@emotion/styled';
import { Card } from 'antd';
import { ProductList } from 'src/interfaces/ProductInterface';

const { Meta } = Card;

const ProductCardContainer = styled.div`
  display: grid;
  gap: 1em;
  row-gap: 3em;
  grid-template-columns: repeat(3, 1fr);
`;

const ProductCard = styled(Card)`
  width: 300px;
  .ant-card-body {
    padding: 1em !important;
  }
`;

const ProductMeta = styled(Meta)`
  .ant-card-meta-title {
    font-size: 15px;
    margin: 0;
  }
  .ant-card-meta-description {
    font-size: 13px;
  }
`;

interface Props {
  item: ProductList[];
}
const Products = ({ item }: Props) => {
  return (
    <>
      {item.map((lst) => (
        <ProductCard key={lst.id} hoverable cover={<img alt={lst.title} src={lst.thumb} />}>
          <ProductMeta title={lst.title} description={lst.meta} />
        </ProductCard>
      ))}
    </>
  );
};

const HomeProducts = () => {
  const productList: ProductList[] = [
    {
      id: 1,
      title: '앙리 마티스',
      meta: '붙여만 놔도 깜놀',
      status: 1,
      price: 3900,
      thumb: 'https://shop-phinf.pstatic.net/20210729_43/1627557958907cEuFf_PNG/002.png?type=w860',
    },
    {
      id: 2,
      title: '모네 그림',
      meta: '붙여만 놔도 깜놀',
      status: 1,
      price: 4900,
      thumb: 'https://shop-phinf.pstatic.net/20210729_267/1627557958996mnAfE_PNG/003.png?type=w860',
    },
    {
      id: 3,
      title: '윈슬로우 그림',
      meta: '붙여만 놔도 깜놀',
      status: 1,
      price: 4900,
      thumb: 'https://shop-phinf.pstatic.net/20210729_46/16275579588923TsWa_PNG/001.png?type=w860',
    },
    {
      id: 4,
      title: '앙리 마티스',
      meta: '붙여만 놔도 깜놀',
      status: 1,
      price: 3900,
      thumb: 'https://shop-phinf.pstatic.net/20210729_43/1627557958907cEuFf_PNG/002.png?type=w860',
    },
    {
      id: 5,
      title: '모네 그림',
      meta: '붙여만 놔도 깜놀',
      status: 1,
      price: 4900,
      thumb: 'https://shop-phinf.pstatic.net/20210729_267/1627557958996mnAfE_PNG/003.png?type=w860',
    },
    {
      id: 6,
      title: '윈슬로우 그림',
      meta: '붙여만 놔도 깜놀',
      status: 1,
      price: 4900,
      thumb: 'https://shop-phinf.pstatic.net/20210729_46/16275579588923TsWa_PNG/001.png?type=w860',
    },
  ];
  return (
    <ProductCardContainer>
      <Products item={productList} />
    </ProductCardContainer>
  );
};

export default HomeProducts;
