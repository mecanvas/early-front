import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  width: 100%;
  justify-content: center;
  text-align: center;
  padding: 1em 0 1.5em 0;
`;

const SoldOut = () => {
  return (
    <Container>
      <div>현재 판매하지 않고 있습니다 :(</div>
      <div>빠른 시일 내에 준비할게요.</div>
    </Container>
  );
};

export default SoldOut;
