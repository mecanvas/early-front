import { Table } from 'antd';
import { TableProps } from 'antd/lib/table';
import React, { useCallback, useEffect, useState } from 'react';
import queryString from 'query-string';
import { useRouter } from 'next/router';

interface Props extends TableProps<any> {
  total?: number;
  pageSize?: number;
  fixed?: boolean;
  isRecord?: boolean;
}

const AppTable = ({ isRecord, total, pageSize, fixed, ...rest }: Props) => {
  const router = useRouter();
  const search = router.query.toString();
  const pathname = router.pathname;

  const [forceSelectPage, setForceSelectPage] = useState<number>(1);
  const [perPageSize, setPerPageSize] = useState(pageSize);

  const handleMoveNo = useCallback(
    ({ id }) => {
      const path = pathname.slice(-1) === '/' ? pathname : `${pathname}/`;

      router.push(`${path}${id}`);
    },
    [router, pathname],
  );

  const handlePagination = (page: number) => {
    setForceSelectPage(page);

    const query = queryString.parse(search);
    query['page'] = page.toString();

    router.push(`${pathname}?${queryString.stringify(query)}`);
  };

  const handlePerPageSize = useCallback((_: number, size: number) => {
    setPerPageSize(size);
  }, []);

  // ? per_page를 변경할때마다 쿼리를 변경합니다.
  useEffect(() => {
    if (!perPageSize) return;
    const query = queryString.parse(search);
    query['per_page'] = perPageSize.toString();

    const newQuery = queryString.stringify(query);

    router.push(`${pathname}?${newQuery}`);
  }, [router, pathname, perPageSize, search]);

  useEffect(() => {
    const { page } = queryString.parse(search);
    if (!page) {
      return setForceSelectPage(1);
    }
    setForceSelectPage(+(page as string));
  }, [search]);

  return (
    <>
      {total ? (
        <Table
          {...rest}
          onRow={(record) => ({
            onClick: () => isRecord && handleMoveNo(record),
          })}
          tableLayout={fixed ? 'fixed' : 'auto'}
          pagination={{
            pageSize: pageSize ? pageSize : 10,
            className: 'pagination',
            responsive: true,
            current: forceSelectPage,
            total,
            onChange: handlePagination,
            onShowSizeChange: handlePerPageSize,
          }}
        ></Table>
      ) : (
        <Table
          {...rest}
          tableLayout={fixed ? 'fixed' : 'auto'}
          onRow={(record) => ({
            onClick: () => isRecord && handleMoveNo(record),
          })}
        ></Table>
      )}
    </>
  );
};

export default AppTable;
