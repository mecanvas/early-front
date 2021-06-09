import React from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';

const FooterContainer = styled.footer`
  width: 100%;
  padding: 40px;
  background-color: ${({ theme }) => theme.color.secondarybg};
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
`;

const AppFooter = () => {
  const router = useRouter();

  if (router.asPath === '/tool') {
    return null;
  }

  return (
    <FooterContainer>
      <Footer>&copy; mecanvas 2021</Footer>
    </FooterContainer>
  );
};

export default AppFooter;
