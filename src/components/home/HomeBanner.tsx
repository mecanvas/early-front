import styled from '@emotion/styled';

const Banner = styled.div`
  background-attachment: fixed;
  width: 100%;
  height: 90vh;
  background-image: url('http://img1.tmon.kr/cdn3/deals/2019/12/02/2781210422/front_75a8c_ezmqv.jpg');
  background-repeat: no-repeat;
  background-position: center;
`;

const HomeBanner = () => {
  return <Banner />;
};

export default HomeBanner;
