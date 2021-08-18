import React from 'react';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import { useRouter } from 'next/router';
import AdminLayout from './AdminLayout';

interface Props {
  children: React.ReactChild;
}

const AppLayout = ({ children }: Props) => {
  const router = useRouter();
  if (router.asPath.includes('admin') && router.asPath !== '/admin/login') {
    return <AdminLayout>{children}</AdminLayout>;
  }
  return (
    <>
      <AppHeader />
      {children}
      <AppFooter />
    </>
  );
};

export default AppLayout;
