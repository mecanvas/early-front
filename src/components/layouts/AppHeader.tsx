import React from 'react';
import styled from '@emotion/styled';
import { useExceptionRoute } from 'src/hooks/useExceptionRoute';
import Logo from './Logo';
import { APP_HEADER_HEIGHT } from 'src/constants';
import { CloseOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox } from '@fortawesome/free-solid-svg-icons';
import { Divider } from 'antd';

const HeaderContainer = styled.header`
  position: fixed;
  z-index: 1;
  width: 100%;
  height: ${APP_HEADER_HEIGHT}px;
  padding: 0 2em;
  background-color: ${({ theme }) => theme.color.white};
  border-bottom: 1px solid ${({ theme }) => theme.color.gray200};
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

const HeaderNavigation = styled.nav`
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
      display: flex;
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
      font-size: 24px;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const HeaderClose = styled.div`
  display: none;
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    display: block;
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

const HeaderNavigationMobile = styled.div`
  display: none;
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    display: flex;
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

const UserMyPageIcon = styled.div`
  margin: 0 0.4em;
  cursor: pointer;

  svg {
    font-size: 20px;
  }
`;

const MobileMenuBar = styled.div`
  cursor: pointer;

  svg {
    font-size: 20px;
  }

  &:hover {
    transition: all 200ms;
    opacity: 0.4;
  }
`;

const AppHeader = () => {
  const { exceptionRoute } = useExceptionRoute();

  if (exceptionRoute) {
    return null;
  }

  return (
    <HeaderContainer>
      <Header>
        <Logo />
        <HeaderNavigation>
          <HeaderClose>
            <CloseOutlined />
          </HeaderClose>
          <ul>
            <li>All</li>
            <li>Frame</li>
            <li>Poster</li>
            <li>About</li>
            <HeaderNavigationMobile>
              <Divider />
              <small>마이페이지</small>
              <small>배송확인</small>
              <small>로그아웃</small>
            </HeaderNavigationMobile>
          </ul>
        </HeaderNavigation>
        <HeaderUser>
          <UserMyPageIcon>
            <FontAwesomeIcon icon={faBox} />
          </UserMyPageIcon>
          <UserMyPageIcon>
            <UserOutlined />
          </UserMyPageIcon>
        </HeaderUser>
        <MobileMenuBar>
          <MenuOutlined />
        </MobileMenuBar>
      </Header>
    </HeaderContainer>
  );
};

export default AppHeader;
