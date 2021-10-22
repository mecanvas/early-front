import styled from '@emotion/styled';
import React from 'react';
import { Li } from '../common/Li';

const Container = styled.div`
  display: flex;
  margin: 0 auto;
  max-width: 1000px;
  width: 100%;
  min-height: 100vh;
  padding: 1em 0;
`;

const UserSider = styled.aside`
  padding-right: 2em;
  height: 300px;
  border-right: 1px solid ${({ theme }) => theme.color.gray400};
  ul {
    li {
      padding: 0.5em 0;
      font-size: 1rem;
      cursor: pointer;
      &:hover {
        opacity: 0.6;
      }
    }
  }
`;

interface Props {
  children: React.ReactNode;
}

const MeLayouts = ({ children }: Props) => {
  return (
    <Container>
      <UserSider>
        <ul>
          <Li link="/me/order" txt="주문내역" />
          <Li link="/me/cart" txt="장바구니" />
          <Li link="/me/q" txt="문의하기" />
          <Li link="/me" txt="내정보" />
        </ul>
      </UserSider>
      <>{children}</>
    </Container>
  );
};

export default MeLayouts;
