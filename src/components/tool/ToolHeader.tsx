import { Popover, Button } from 'antd';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import { useGlobalState } from 'src/hooks';
import { FramePrice } from 'src/interfaces/ToolInterface';
import Logo from '../layouts/Logo';
import ToolSave from './divided/DividedToolSave';
import { ToolHeaderMenu, CanvasInfomationWrapper, BillInfomation, Bill, BillTotal } from './divided/DividedToolStyle';

const ToolHeader = () => {
  const router = useRouter();
  const [isPreview, setIsPreview] = useGlobalState<boolean>('isPreview');
  const [isSaveCanvas, setIsSaveCanvas] = useGlobalState<boolean>('saveModal');
  const [framePrice] = useGlobalState<FramePrice[]>('framePrice');

  // 고른 액자의 이름과 수량
  const yourPriceList = useMemo(() => {
    if (!framePrice?.length) return;
    return Object.entries(
      framePrice.reduce((acc: { [key: string]: any }, cur) => {
        const name = cur.name;
        if (!acc[name]) {
          acc[name] = { quantity: 1, price: cur.price, cm: cur.cm };
          return acc;
        }
        acc[name].quantity++;
        return acc;
      }, {}),
    );
  }, [framePrice]);

  const handleSaveCanvas = useCallback(() => {
    setIsSaveCanvas(true);
  }, [setIsSaveCanvas]);

  const handleImgPreview = useCallback(() => {
    setIsPreview(!isPreview);
  }, [isPreview, setIsPreview]);

  const handlePushMainPage = useCallback(() => {
    router.push('/');
  }, [router]);

  return (
    <ToolHeaderMenu>
      <div onClick={handlePushMainPage}>
        <Logo />
      </div>
      <div>
        <Popover
          style={{ padding: 0 }}
          content={
            yourPriceList?.length ? (
              <CanvasInfomationWrapper>
                {/* 사용한 액자 x 수량 */}
                <BillInfomation>
                  <Bill>
                    {yourPriceList.map(([key, value], index) => (
                      <div key={index}>
                        <div>{key}</div>
                        <div>
                          {value.price.toLocaleString()} x {value.quantity}개
                        </div>
                      </div>
                    ))}
                  </Bill>
                  <BillTotal>{framePrice?.reduce((acc, cur) => (acc += cur.price), 0).toLocaleString()}원</BillTotal>
                </BillInfomation>
              </CanvasInfomationWrapper>
            ) : (
              '제작하신 액자가 없습니다.'
            )
          }
        >
          <Button type="text">예상가격</Button>
        </Popover>
        <Button onClick={handleImgPreview} type={!isPreview ? 'default' : 'primary'}>
          {!isPreview ? '미리보기' : '이미지로'}
        </Button>
        <Button type="text" onClick={handleSaveCanvas}>
          저장
        </Button>
        {isSaveCanvas && (
          <ToolSave
            totalPrice={framePrice?.reduce((acc, cur) => (acc += cur.price), 0)}
            yourPriceList={yourPriceList}
          />
        )}
      </div>
    </ToolHeaderMenu>
  );
};

export default ToolHeader;
