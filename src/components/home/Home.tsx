import styled from '@emotion/styled';
import HomeProducts from './HomeProducts';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div`
  background-attachment: fixed;
`;

const Home = () => {
  return (
    <Container>
      <Banner>
        <div>배너</div>
      </Banner>

      <HomeProducts />
    </Container>
  );
};

export default Home;
