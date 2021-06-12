import { useRouter } from 'next/router';
import { useMemo, useCallback } from 'react';
import queryString from 'query-string';

export const useGetQueryString = () => {
  const { asPath } = useRouter();
  const search = asPath.split('?')[1];

  // 쿼리를 객체로 저장
  const query = useMemo(() => {
    return queryString.parse(search);
  }, [search]);

  // 이 함수를 사용하면 현재있는 쿼리 객체를 stringify 해줍니다.
  const queryStringify = useCallback(
    (newObj?: any) => {
      if (newObj) {
        const newQuery = queryString.stringify({ ...query, ...newObj });
        return newQuery;
      }
      if (query) {
        return queryString.stringify(query);
      }
    },
    [query],
  );

  const stringifyQuery = queryStringify(query);

  return { query, stringifyQuery, queryStringify };
};
