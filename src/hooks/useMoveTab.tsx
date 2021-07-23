import { useRouter } from 'next/router';
import { useState } from 'react';

export const useMoveTab = (initialTab: string): any => {
  const router = useRouter();
  const [defaultTab, setDefaultTab] = useState(initialTab);

  const handleTabKey = (key: string) => {
    setDefaultTab(key);

    router.push(`/admin/${key}`);
  };

  return { defaultTab, handleTabKey, setDefaultTab };
};
