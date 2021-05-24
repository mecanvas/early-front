import React from 'react';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';

interface Props {
  children: React.ReactChild;
}

const AppLayout = ({ children }: Props) => {
  return (
    <>
      <AppHeader />
      {children}
      <AppFooter />
    </>
  );
};

export default AppLayout;
