import React, { useEffect } from 'react';
import AppTable from 'src/components/antd/AppTable';
import { Tabs } from 'antd';
import { useMoveTab } from 'src/hooks/useMoveTab';
import { useRouter } from 'next/router';

const { TabPane } = Tabs;

const AdminOrderList = () => {
  const { pathname } = useRouter();
  const [defaultTab, handleTabKey, setDefaultTab] = useMoveTab('canvasorder');

  useEffect(() => {
    if (pathname === 'canvasorder') {
      setDefaultTab('canvasorder');
    }
  }, [pathname, setDefaultTab]);

  return (
    <Tabs defaultActiveKey={defaultTab} onTabClick={handleTabKey} activeKey={defaultTab}>
      <TabPane key="canvasorder" tab="주문 목록">
        <AppTable></AppTable>;
      </TabPane>
    </Tabs>
  );
};

export default AdminOrderList;
