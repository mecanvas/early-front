import styled from '@emotion/styled';
import { Divider } from 'antd';
import { ProductList } from 'src/interfaces/ProductInterface';
import HomeBanner from './HomeBanner';
import HomeProducts from './HomeProducts';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Divide = styled(Divider)`
  min-width: 100px;
  max-width: 100px;
  margin: 4em 0;
`;

const Home = () => {
  const productList: ProductList[] = [
    {
      id: 1,
      title: '앙리 마티스',
      meta: '걸면 인테리어 끝인데?',
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
    <Container>
      <HomeBanner />
      <Divide />
      <HomeProducts title="Recommend" productList={productList} />
      <Divide />
      <HomeProducts moreLink="/" title="Frame" productList={productList} />
      <Divide />
      <HomeProducts moreLink="/" title="Poster" productList={productList} />
    </Container>
  );
};

export default Home;
