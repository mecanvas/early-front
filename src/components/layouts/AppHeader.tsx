import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const HeaderContainer = styled.header`
  width: 100%;
  height: 50px;
  background-color: ${({ theme }) => theme.color.white};
`;

const Header = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0 40px;
`;

const HeaderBackIcon = styled(Button)`
  width: 100px;
  svg {
    path {
      color: ${({ theme }) => theme.color.white};
    }
  }
`;

const AppHeader = () => {
  const router = useRouter();

  const handlePushCustomPage = useCallback(() => {
    router.push('/tool');
  }, [router]);

  const handlePushMainPage = useCallback(() => {
    router.push('/');
  }, [router]);

  return (
    <HeaderContainer>
      <Header>
        {router.asPath === '/tool' ? (
          <>
            <HeaderBackIcon type="primary" onClick={handlePushMainPage}>
              <ArrowLeftOutlined />
            </HeaderBackIcon>
          </>
        ) : (
          <>
            <h4>MeCanvas</h4>
            <Button type="primary" onClick={handlePushCustomPage}>
              Canvas
            </Button>
          </>
        )}
      </Header>
    </HeaderContainer>
  );
};

export default AppHeader;
