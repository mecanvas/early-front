import React from 'react';
import styled from '@emotion/styled';

const Logos = styled.div`
  font-size: 28px;
  cursor: pointer;
  span {
    font-family: serif;
    font-weight: bold;
  }
  span:nth-of-type(1) {
    color: #499edc;
  }
  span:nth-of-type(2) {
    font-family: serif;
    color: #f0af41;
  }
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    font-size: 24px;
  }
`;

const Logo = () => {
  return (
    <Logos>
      <span>ㅇ</span>
      <span>ㄹ</span>
    </Logos>
  );
};

export default Logo;
