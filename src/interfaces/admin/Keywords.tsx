export interface ExtractKeywordTable {
  firstCate: string;
  secondCate?: string;
  keyword: string;
  // 경쟁률
  comp: string;
  // 쇼핑전환
  cvr: string;
  // 광고비
  bid: string;
  // 검색량
  searchCnt: string;
  // 상품량
  prodCnt: string;
  // 평균가격
  prodPrcAvg: string;

  // 전날없던 키워드
  isNew: boolean;
}

export interface KeywordsResult {
  date: string;
  res: ExtractKeywordTable[];
}
