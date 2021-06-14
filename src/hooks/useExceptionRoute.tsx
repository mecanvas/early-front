import { useRouter } from 'next/router';
import { useState } from 'react';
import { exceptionRoutes } from 'src/constants';

export const useExceptionRoute = () => {
  const { asPath } = useRouter();
  const [exceptionRoute, setExceptionRoute] = useState(false);

  exceptionRoutes.forEach((route) => {
    if (asPath === route) {
      setExceptionRoute(true);
      return;
    }
  });

  return { exceptionRoute };
};
