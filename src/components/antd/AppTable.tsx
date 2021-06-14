import { Table } from 'antd';
import { TableProps } from 'antd/lib/table';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useGetQueryString } from 'src/hooks/useGetQueryString';

interface Props extends TableProps<any> {
  total?: number;
  fixed?: boolean;
  isRecord?: boolean;
}

const AppTable = memo(({ isRecord, total, fixed, ...rest }: Props) => {
  const router = useRouter();

  const pathname = router.pathname;
  const [selectPage, setSelectPage] = useState<number>(1);
  const [perPageSize, setPerPageSize] = useState<number>(10);
  const { queryStringify, query } = useGetQueryString();
  const [routerChange, setRouterChange] = useState(false);

  const handleMoveNo = useCallback(
    ({ id }) => {
      const path = pathname.slice(-1) === '/' ? pathname : `${pathname}/`;
      router.push(`${path}${id}`);
    },
    [router, pathname],
  );
  const handlePagination = (page: number) => {
    setSelectPage(page);
    setRouterChange(true);
  };

  const handlePerPageSize = useCallback(
    (_: number, size: number) => {
      setPerPageSize(size);
      setRouterChange(true);
    },
    [setPerPageSize],
  );
  // 파지네이션 시작시, 값에 따라 반영
  useEffect(() => {
    if (!routerChange) return;
    if (selectPage && perPageSize) {
      router.push(`${pathname}/?page=${selectPage}&per_page=${perPageSize}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routerChange, perPageSize, selectPage]);

  // 첫 렌더시에는 주소에 따라 파지네이션
  useEffect(() => {
    if (query && queryStringify()) {
      setSelectPage(+(query.page as string) || 1);
      setPerPageSize(+(query.per_page as string) || 10);
      router.push(`${pathname}/?${queryStringify()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            pageSize: perPageSize,
            className: 'pagination',
            responsive: true,
            current: selectPage,
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
});

export default AppTable;
