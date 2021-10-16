import { Divider } from 'antd';
import React, { useMemo } from 'react';
import { S3_URL } from 'src/constants';
import { useAppSelector } from 'src/hooks/useRedux';
import { DescContent, ImgLinker, DescOrderInformation, DescOrder } from './Success';

const SingleNaverDesc = () => {
  const { selectedFrame } = useAppSelector((state) => state.frame);
  const { redirect } = useAppSelector((state) => state.redirects);
  const { canvasOrder } = useAppSelector((state) => state.canvas);
  const frame = useMemo(() => selectedFrame[0], [selectedFrame]);

  const url = useMemo(() => {
    if (redirect.naver) {
      return redirect.naver;
    }
  }, [redirect.naver]);

  return (
    <div style={{ textAlign: 'center' }}>
      <DescContent>
        <h3>- 1 -</h3>
        <p>먼저 아래의 링크로 얼리21 스마트스토어에 들어가 주세요.</p>
        {redirect.naver && url ? (
          <ImgLinker
            target="_blank"
            href={`https://smartstore.naver.com/early21/${url.replace(
              '=',
              '/',
            )}?NaPm=ct%3Dkutrypfk%7Cci%3Dea93aeb5abf709cb6c86e147e133f0cefa423f86%7Ctr%3Dslsl%7Csn%3D4152719%7Chk%3D063de5e2093f86df4ead233fad5f2691382167d4`}
          >
            <img
              src="https://shop-phinf.pstatic.net/20210818_251/16292744909008aQoM_PNG/30410318680101258_485478705.png?type=o640"
              alt="스마트스토어링크이미지"
            />
            <p>클릭해 얼리21 스마트스토어로 이동</p>
          </ImgLinker>
        ) : (
          <ImgLinker target="_blank" href={`https://smartstore.naver.com/early21/products/5798217286}`}>
            <img
              src="https://shop-phinf.pstatic.net/20210818_251/16292744909008aQoM_PNG/30410318680101258_485478705.png?type=o640"
              alt="스마트스토어링크이미지"
            />
            <p>클릭해 얼리21 스마트스토어로 이동</p>
          </ImgLinker>
        )}
      </DescContent>
      <Divider />
      <DescContent>
        <h3>- 2 -</h3>
        <p>스마트스토어로 돌아가 주문하신 정보와 일치하도록 선택해 주세요.</p>
        {frame && (
          <>
            <p>주문하신 정보는 다음과 같습니다.</p>
            <DescOrderInformation>
              <span>{frame.name}</span>
              <span>
                {frame.widthCm}cm x {frame.heightCm}cm
              </span>
              <div>
                {(canvasOrder.scaleType === 1 && '옆면-흰색') ||
                  (canvasOrder.scaleType === 2 && `옆면-배경색`) ||
                  '옆면-좌우반전'}
              </div>
            </DescOrderInformation>
            <br />
          </>
        )}
        <DescOrder>
          <div>
            <img src={`${S3_URL}/img/guide/editor-order.png`} alt="에디터주문 선택" />
            <p>
              <b>주문방식</b>에서 <b>에디터주문</b>을 선택해 주세요.
            </p>
          </div>
          <div>
            <img src={`${S3_URL}/img/guide/size-select.png`} alt="액자 선택" />
            <p>
              <b>액자 사이즈</b>에서 <b>주문하신 액자와 같은 액자를</b> 선택해 주세요.
            </p>
          </div>
          <div>
            <img src={`${S3_URL}/img/guide/expand.png`} alt="액자 옆면 선택" />
            <p>
              <b>옆면 확장 여부</b> 역시 <b>주문하신 액자의 옆면 설정</b>과 같게 선택해 주세요.
            </p>
          </div>
          <div>
            <img src={`${S3_URL}/img/guide/quy.png`} alt="액자 개수 선택" />
            <p>
              만일 같은 디자인의 캔버스를 <b>2개 이상을 주문하신다면, 개수를 조절</b>해 주세요.
            </p>
          </div>
        </DescOrder>
      </DescContent>
      <Divider />
      <DescContent>
        <h3>- 3 -</h3>
        <div>
          <b>주문하신 분의 성함 및 정보</b>는 <b>저장 시 입력한 성함으로 입력</b>해 주세요.
        </div>
      </DescContent>
      <Divider />
    </div>
  );
};

export default SingleNaverDesc;
