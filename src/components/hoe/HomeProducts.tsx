import styled from '@emotion/styled';
import { Card } from 'antd';
import { ProductList } from 'src/interfaces/ProductInterface';

const { Meta } = Card;

const ProductCardContainer = styled.div`
  display: grid;
  gap: 0.5em;
  row-gap: 3em;
  grid-template-columns: repeat(3, 1fr);

  @media all and (max-width: ${({ theme }) => theme.size.md}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media all and (max-width: ${({ theme }) => theme.size.xs}) {
    grid-template-columns: repeat(1, 300px);
  }
`;

const ProductCard = styled(Card)`
  max-width: 280px;
  margin: 0 0.5em;
  img {
    padding: 0.7em;
  }
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
          <small>{lst.price.toLocaleString()}W</small>
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
    <>
      <ProductCardContainer>
        <Products item={productList} />
      </ProductCardContainer>
    </>
  );
};

export default HomeProducts;
