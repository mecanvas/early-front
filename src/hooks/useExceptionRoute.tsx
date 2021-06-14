import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { exceptionRoutes } from 'src/constants';

export const useExceptionRoute = () => {
  const { asPath } = useRouter();
  const [exceptionRoute, setExceptionRoute] = useState(false);

  const except = useCallback(() => {
    exceptionRoutes.forEach((route) => {
      if (asPath === route) {
        setExceptionRoute(true);
        return;
      }
    });
  }, [asPath]);

  useEffect(() => {
    except();
  }, [except]);

  return { exceptionRoute };
};
