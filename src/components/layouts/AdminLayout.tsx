import { Menu, Layout, Button } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';
import { APP_HEADER_HEIGHT } from 'src/constants';
import { useAppDispatch, useAppSelector } from 'src/hooks/useRedux';
import { postUserLogout } from 'src/store/api/user/userLogout';

const { Header, Content } = Layout;

const AdminHeader = styled(Header)`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.color.white};
  justify-content: space-between;
  width: 100%;
  position: fixed;
  border-bottom: 1px solid ${({ theme }) => theme.color.gray300};
  top: 0;
  z-index: 999;

  h2 {
    margin: 0;
  }
`;

const AdminLogo = styled.div`
  cursor: pointer;
`;

const AdminMenu = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.color.white};

  ul {
    display: flex;
    height: 100%;
    align-items: center;
    border-bottom: none;

    .ant-menu-submenu {
      padding: 16px 0;
    }
  }
`;

const ContentContainer = styled(Content)`
  margin-top: ${APP_HEADER_HEIGHT}px;
  & > div {
    min-height: 80vh;
    padding: 24px 130px;
    background-color: ${({ theme }) => theme.color.gray000};

    @media (max-width: 1180px) {
      padding: 24px 48px;
    }

    @media (max-width: 650px) {
      padding: 24px 12px;
    }
  }
`;

interface Props {
  children: React.ReactChild;
}

const AdminLayout = ({ children }: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector((state) => state.user);

  const handleTitleClick = useCallback(
    (e) => {
      router.push(e.key);
    },
    [router],
  );

  const handleLogout = useCallback(() => {
    if (userData) {
      dispatch(postUserLogout());
      router.push('/admin/login');
    }
  }, [dispatch, router, userData]);

  return (
    <Layout>
      <AdminHeader>
        <AdminLogo>
          <Link href="/admin">
            <h2>Early</h2>
          </Link>
        </AdminLogo>
        <AdminMenu>
          <Button type="default" onClick={handleLogout}>
            로그아웃
          </Button>

          {/* 메뉴 */}
          <Menu mode="horizontal" theme="light" defaultSelectedKeys={['/']} selectedKeys={[router.pathname]}>
            <SubMenu key="/admin/order/divided" title="주문 목록" onTitleClick={handleTitleClick}>
              <Menu.Item key="/admin/order/divided">
                <Link href="/admin/order/divided">분할 주문</Link>
              </Menu.Item>
              <Menu.Item key="/admin/order/single">
                <Link href="/admin/order/single">단일 주문</Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </AdminMenu>
      </AdminHeader>
      <ContentContainer>
        <div>{children}</div>
      </ContentContainer>
    </Layout>
  );
};

export default AdminLayout;
