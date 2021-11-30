import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ExtractKeywordTable, KeywordsResult } from 'src/interfaces/admin/Keywords';
import useSWR from 'swr';
import Loading from 'src/components/common/Loading';
import styled from '@emotion/styled';
import { Select } from 'antd';
import { SelectValue } from 'antd/lib/select';
import { css } from '@emotion/react';
import { APP_HEADER_HEIGHT } from 'src/constants';

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  max-width: 1200px;
  padding: 1em;
  background-color: ${({ theme }) => theme.color.white};
  display: flex;
  flex-direction: column;
  min-width: 800px;
`;

const CategoryMenuBtn = styled(Select)`
  width: 100%;
`;

const KeywordsTableContainer = styled.table`
  width: 100%;
`;

const KeywordHeadTable = styled.thead`
  display: grid;
  position: sticky;
  padding: 0.4em 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.gray300};
  border-top: 1px solid ${({ theme }) => theme.color.gray300};
  background-color: ${({ theme }) => theme.color.white};
  top: ${APP_HEADER_HEIGHT}px;
  grid-template-columns: repeat(8, 1fr);
  width: 100%;
  text-align: center;
  div {
    max-width: 120px;
  }
`;

const KeywordBodyTable = styled.tr`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  width: 100%;
  text-align: center;

  div {
    max-width: 120px;
  }
`;

const KeywordHead = styled.th<{ selected: boolean }>`
  display: flex;
  width: 100%;
  text-align: center;
  font-weight: bold;
  margin: 1em 0;
  border-right: 1px solid ${({ theme }) => theme.color.gray300};
  align-items: center;
  justify-content: center;

  span {
    cursor: pointer;

    ${({ selected }) =>
      selected &&
      css`
        color: green;
      `}

    &:hover {
      font-weight: 700;
    }
  }
`;

const KeywordItem = styled.td<{ comp?: string; cvr?: string; bid?: string }>`
  a {
    text-align: center;
    color: ${({ theme }) => theme.color.black};
    text-decoration: underline;

    &:hover {
      color: ${({ theme }) => theme.color.gray500};
    }
  }
  margin-bottom: 0.4em;
  padding: 0.8em 0em;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid ${({ theme }) => theme.color.gray300};
  &:nth-of-type(1) {
    display: flex;
    flex-direction: column;
  }
  &:nth-of-type(2) {
    display: flex;
    flex-direction: column;
    max-width: 120px;
  }

  ${({ comp, theme, cvr, bid }) => {
    // 경쟁률
    if (comp) {
      if (+comp > 12.4) {
        return css`
          color: ${theme.color.red};
        `;
      }
      if (+comp > 5) {
        return css`
          color: ${theme.color.gray600};
        `;
      }
      return css`
        color: green;
      `;
    }

    // 전환
    if (cvr) {
      if (+cvr > 3) {
        return css`
          color: green;
        `;
      }
      if (+cvr > 1.75) {
        return css`
          color: ${theme.color.gray600};
        `;
      }
      return css`
        color: ${theme.color.red};
      `;
    }

    // 광고비
    if (bid) {
      if (+bid > 500) {
        return css`
          color: ${theme.color.red};
        `;
      }
      if (+bid > 400) {
        return css`
          color: ${theme.color.gray600};
        `;
      }
      return css`
        color: green;
      `;
    }
  }}
`;

const AdminGoldenKeywords = () => {
  const { data } = useSWR<KeywordsResult>('https://early-slack.herokuapp.com/kw');
  const head = ['카테고리', '키워드', '경쟁률', '쇼핑전환', '광고비', '검색량', '상품량', '평균가격'];
  const [resKw, setResKw] = useState<ExtractKeywordTable[]>(data?.res || []);
  const [filter, setFilter] = useState('모두');
  const [sortCmd, setSortCmd] = useState<any>('');
  const [isSortArrow, setIsSortArrow] = useState(true);
  const replaceSpotToNumber = (str: string) => +str.replace(/,/, '');
  const [categoryMenu, setCategoryMenu] = useState<string[]>([]);

  const sorter = useCallback(
    (a: ExtractKeywordTable, b: ExtractKeywordTable) => {
      if (sortCmd === '경쟁률') {
        if (isSortArrow) {
          return +a.comp - +b.comp;
        }
        return +b.comp - +a.comp;
      }
      if (sortCmd === '쇼핑전환') {
        if (isSortArrow) {
          return +a.cvr - +b.cvr;
        }
        return +b.cvr - +a.cvr;
      }
      if (sortCmd === '광고비') {
        if (isSortArrow) {
          return +a.bid - +b.bid;
        }
        return +b.bid - +a.bid;
      }
      if (sortCmd === '상품량') {
        if (isSortArrow) {
          return replaceSpotToNumber(a.prodCnt) - replaceSpotToNumber(b.prodCnt);
        }
        return replaceSpotToNumber(b.prodCnt) - replaceSpotToNumber(a.prodCnt);
      }
      if (sortCmd === '검색량') {
        if (isSortArrow) {
          return replaceSpotToNumber(a.searchCnt) - replaceSpotToNumber(b.searchCnt);
        }
        return replaceSpotToNumber(b.searchCnt) - replaceSpotToNumber(a.searchCnt);
      }
      if (sortCmd === '평균가격') {
        if (isSortArrow) {
          return replaceSpotToNumber(a.prodPrcAvg) - replaceSpotToNumber(b.prodPrcAvg);
        }
        return replaceSpotToNumber(b.prodPrcAvg) - replaceSpotToNumber(a.prodPrcAvg);
      }

      return +a.comp - +b.comp;
    },
    [isSortArrow, sortCmd],
  );

  const newData = useMemo(() => {
    if (sortCmd === '키워드 ' || sortCmd === '카테고리') {
      return resKw;
    }
    return resKw.sort(sorter);
  }, [resKw, sorter, sortCmd]);

  const handleSort = useCallback((e) => {
    const { sort } = e.currentTarget.dataset;
    if (!sort) {
      return;
    }
    setSortCmd(sort);
    setIsSortArrow((prev) => !prev);
  }, []);

  const handleFilter = useCallback((cate: SelectValue) => {
    if (!cate) {
      return;
    }

    setFilter(cate as string);
  }, []);

  useEffect(() => {
    if (!data) return;

    if (filter === '모두') {
      setResKw(data.res);
      return;
    }

    setResKw(data.res.filter((lst) => lst.firstCate === filter));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    if (categoryMenu.length) {
      return;
    }
    if (!data || !resKw) {
      return;
    }

    const arr = resKw.map((lst) => lst.firstCate);
    const menu = ['모두', ...new Set(arr)];
    setCategoryMenu(menu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resKw]);

  useEffect(() => {
    if (data) {
      setResKw(data.res);
    }
  }, [data]);

  if (!data || !resKw) {
    return <Loading loading text="불러오는 중" />;
  }

  return (
    <>
      <h2>{data.date} 황금키워드 목록</h2>

      <Container>
        <CategoryMenuBtn defaultValue={'모두'} onChange={handleFilter}>
          {categoryMenu.map((nm) => (
            <Select.Option key={nm} value={nm}>
              {nm}
              <span style={{ marginLeft: '.3em' }}>
                ({nm === '모두' ? `${data.res.length}개` : `${data.res.filter((kw) => kw.firstCate === nm).length}개`})
              </span>
            </Select.Option>
          ))}
        </CategoryMenuBtn>

        <KeywordsTableContainer>
          <KeywordHeadTable>
            {head.map((h) => (
              <KeywordHead key={h} selected={sortCmd !== '카테고리' && sortCmd !== '키워드' ? h === sortCmd : false}>
                <span onClick={handleSort} data-sort={h}>
                  {h}
                </span>
              </KeywordHead>
            ))}
          </KeywordHeadTable>

          <tbody>
            {newData.map((kw, j) => (
              <KeywordBodyTable key={j}>
                <KeywordItem>
                  <div>{kw.firstCate}</div>
                  <div>{kw.secondCate}</div>
                </KeywordItem>
                <KeywordItem>
                  <a href={`https://pandarank.net/search/detail?keyword=${kw.keyword}`} target="blank">
                    {kw.keyword}
                  </a>
                </KeywordItem>
                <KeywordItem comp={kw.comp}>{kw.comp}</KeywordItem>
                <KeywordItem cvr={kw.cvr}>{kw.cvr}</KeywordItem>
                <KeywordItem bid={kw.bid}>{kw.bid}</KeywordItem>
                <KeywordItem>{kw.searchCnt}</KeywordItem>
                <KeywordItem>{kw.prodCnt}</KeywordItem>
                <KeywordItem>{kw.prodPrcAvg}</KeywordItem>
              </KeywordBodyTable>
            ))}
          </tbody>
        </KeywordsTableContainer>
      </Container>
    </>
  );
};

export default AdminGoldenKeywords;
