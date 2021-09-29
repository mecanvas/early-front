import React, { useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useExceptionRoute } from 'src/hooks/useExceptionRoute';
import Logo from './Logo';
import { APP_HEADER_HEIGHT } from 'src/constants';
import { CloseOutlined, MenuOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import Link from 'next/link';
import { useAppSelector } from 'src/hooks/useRedux';

const HeaderContainer = styled.header`
  position: fixed;
  z-index: 1;
  width: 100%;
  height: ${APP_HEADER_HEIGHT}px;
  padding: 0 2em;
  background-color: ${({ theme }) => theme.color.white};
  border-bottom: 1px solid ${({ theme }) => theme.color.gray100};
`;

const Header = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;

  button {
    margin-left: 3px;
  }
`;

const HeaderNavigation = styled.nav<{ openNavi: boolean }>`
  display: flex;
  flex: 2;
  justify-content: center;
  ul {
    display: flex;
    min-width: 350px;
    width: 50%;
    justify-content: space-around;
    @media all and (max-width: ${({ theme }) => theme.size.sm}) {
      padding-top: 4em;
      display: ${({ openNavi }) => (openNavi ? 'flex' : 'none')};
      flex-direction: column;
      position: absolute;
      right: 0;
      top: 0;
      width: 230px;
      height: 100vh;
      justify-content: flex-start;
      text-align: center;
      background-color: ${({ theme }) => theme.color.white};
      font-size: 18px;
      min-width: 0px;

      li {
        margin: 0.2em 0;
      }
    }
    li {
      font-size: 20px;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const HeaderClose = styled.div<{ openNavi: boolean }>`
  display: none;
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    display: ${({ openNavi }) => (openNavi ? 'block' : 'none')};
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
    cursor: pointer;
    svg {
      font-size: 20px;
    }
    &:hover {
      transition: all 200ms;
      opacity: 0.4;
    }
  }
`;

const HeaderNavigationMobile = styled.div<{ openNavi: boolean }>`
  display: none;
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    display: ${({ openNavi }) => (openNavi ? 'flex' : 'none')};
    flex-direction: column;
    small {
      cursor: pointer;
      margin-bottom: 1em;
      color: ${({ theme }) => theme.color.gray700};
      &:hover {
        text-decoration: underline;
      }
    }
    justify-content: center;
    margin-top: 0.5em;
  }
`;

const HeaderUser = styled.div`
  display: flex;
`;

const UserMyPageIcon = styled.div<{ openMyInfo?: boolean }>`
  margin: 0 0.4em;
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 20px;
  svg {
    font-size: 20px;
  }

  ul {
    display: ${({ openMyInfo }) => (openMyInfo ? 'block' : 'none')};
    width: 100px;
    position: absolute;
    top: 40px;
    right: 0;
    background-color: ${({ theme }) => theme.color.white};
    border: 1px solid ${({ theme }) => theme.color.gray500};
    text-align: center;
    li {
      padding: 0.3em;

      &:hover {
        color: ${({ theme }) => theme.color.gray600};
      }
    }
  }
`;

const NotUserData = styled.ul`
  display: flex;
  align-items: center;
  li {
    cursor: pointer;
    margin-right: 0.5em;

    &:hover {
      opacity: 0.7;
    }
  }
`;

const MobileMenuBar = styled.div<{ openNavi: boolean }>`
  display: none;
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    display: ${({ openNavi }) => (openNavi ? 'none' : 'block')};
    cursor: pointer;
    svg {
      font-size: 20px;
    }

    &:hover {
      transition: all 200ms;
      opacity: 0.4;
    }
  }
`;

const AppHeader = () => {
  const { exceptionRoute } = useExceptionRoute();
  const { userData } = useAppSelector((state) => state.user);
  const [openNavi, setOpenNavi] = useState(false);
  const [openMyInfo, setOpenMyInfo] = useState(false);
  const handleMyInfo = useCallback(() => {
    setOpenMyInfo((prev) => !prev);
  }, []);

  const handleOpenNavi = useCallback(() => {
    setOpenNavi(true);
  }, []);

  const handleCloseNavi = useCallback(() => {
    setOpenNavi(false);
  }, []);

  useEffect(() => {
    if (openMyInfo) {
      document.body.onclick = () => setOpenMyInfo((prev) => !prev);
    }

    return () => {
      document.body.onclick = null;
    };
  }, [openMyInfo]);

  if (exceptionRoute) {
    return null;
  }

  const Li = (props: { link?: string; txt: string }) => {
    return (
      <>
        {props.link ? (
          <Link href={props.link}>
            <li>{props.txt}</li>
          </Link>
        ) : (
          <li>{props.txt}</li>
        )}
      </>
    );
  };

  return (
    <HeaderContainer>
      <Header>
        <Logo />
        <HeaderNavigation openNavi={openNavi}>
          <HeaderClose openNavi={openNavi} onClick={handleCloseNavi}>
            <CloseOutlined />
          </HeaderClose>
          <ul>
            <Li link="/frame" txt="Frame" />
            <Li link="/poster" txt="Poster" />
            <Li link="/about" txt="About" />

            <HeaderNavigationMobile openNavi={openNavi}>
              <Divider />
              {userData ? (
                <>
                  <small>마이페이지</small>
                  <small>배송조회</small>
                  <small>문의하기</small>
                  <small>로그아웃</small>
                </>
              ) : (
                <>
                  <small>로그인</small>
                  <small>회원가입</small>
                </>
              )}
            </HeaderNavigationMobile>
          </ul>
        </HeaderNavigation>
        <HeaderUser>
          <UserMyPageIcon>
            <ShoppingCartOutlined />
          </UserMyPageIcon>

          {userData ? (
            <UserMyPageIcon onClick={handleMyInfo} openMyInfo={openMyInfo}>
              <UserOutlined />
              <ul>
                <Li link="/me" txt="마이페이지" />
                <Li link="/delivery" txt="배송조회" />
                <Li link="/cart" txt="장바구니" />
                <Li link="/q" txt="문의하기" />
                <Li txt="로그아웃" />
              </ul>
            </UserMyPageIcon>
          ) : (
            <NotUserData>
              <Li link="/login" txt="로그인"></Li>
              <Li link="/register" txt="회원가입"></Li>
            </NotUserData>
          )}
        </HeaderUser>
        <MobileMenuBar openNavi={openNavi} onClick={handleOpenNavi}>
          <MenuOutlined />
        </MobileMenuBar>
      </Header>
    </HeaderContainer>
  );
};

export default AppHeader;
