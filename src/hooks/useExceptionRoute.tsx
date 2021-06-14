import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { exceptionRoutes } from 'src/constants';

export const useExceptionRoute = () => {
  const { asPath } = useRouter();
  const [exceptionRoute, setExceptionRoute] = useState(false);

  const except = useCallback(() => {
    setExceptionRoute(false);
    for (const route of exceptionRoutes) {
      if (asPath === route) {
        setExceptionRoute(true);
        break;
      }
    }
  }, [asPath]);

  useEffect(() => {
    except();
  }, [except]);

  return { exceptionRoute };
};
