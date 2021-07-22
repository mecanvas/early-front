import { Popover, Button } from 'antd';
import React, { useCallback, useMemo } from 'react';
import { useGlobalState } from 'src/hooks';
import { FramePrice } from 'src/interfaces/ToolInterface';
import ToolSave from './ToolSave';
import {
  ToolHeaderMenu,
  CanvasInfomationWrapper,
  BillInfomation,
  Bill,
  BillTotal,
  ToolSinglePrice,
} from './divided/DividedToolStyle';
import { theme } from 'src/style/theme';
import { useOpacity } from 'src/hooks/useOpacity';
import ToolHelperButton from './ToolHelperButton';
import { icons } from 'public/icons';
import styled from '@emotion/styled';
import router from 'next/router';

const ToolHomeIcon = styled.div`
  cursor: pointer;
  img {
    &:nth-of-type(1) {
      transform: rotateY(180deg);
      -webkit-transform: rotateY(180deg);
      -moz-transform: rotateY(180deg);
      -o-transform: rotateY(180deg);
      -ms-transform: rotateY(180deg);
      unicode-bidi: bidi-override;
      direction: rtl;
      width: 20px;
      margin-right: 4px;
      @media all and (max-width: ${({ theme }) => theme.size.sm}) {
        width: 15px;
      }
    }
    width: 25px;
    @media all and (max-width: ${({ theme }) => theme.size.sm}) {
      width: 20px;
    }
  }
`;

interface Props {
  singlePrice?: string;
  singleCanvasName?: string;
  imgUrl: string;
}

const ToolHeader = ({ singlePrice, singleCanvasName, imgUrl }: Props) => {
  const [isPreview, setIsPreview] = useGlobalState<boolean>('isPreview');
  const [singleImgUploadUrl] = useGlobalState<boolean>('singleImgUploadUrl');
  const [imgUploadUrl] = useGlobalState<boolean>('imgUploadUrl');
  const [isSaveCanvas, setIsSaveCanvas] = useGlobalState<boolean>('saveModal');
  const [framePrice] = useGlobalState<FramePrice[]>('framePrice');
  const { OpacityComponent } = useOpacity(imgUrl || '');
  const [, setIsOpenModal] = useGlobalState<boolean>('openModal');
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

  const handleMoveHome = useCallback(() => {
    if (imgUploadUrl || singleImgUploadUrl) {
      setIsOpenModal(true);
    } else {
      router.push('/tool');
    }
  }, [imgUploadUrl, setIsOpenModal, singleImgUploadUrl]);

  const handleSaveCanvas = useCallback(() => {
    setIsSaveCanvas(true);
  }, [setIsSaveCanvas]);

  const handleImgPreview = useCallback(() => {
    setIsPreview(!isPreview);
  }, [isPreview, setIsPreview]);

  return (
    <ToolHeaderMenu>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ToolHomeIcon onClick={handleMoveHome}>
          <img src={icons.arrow} />
          <img src={icons.home} />
        </ToolHomeIcon>
        {!singlePrice && !singleCanvasName && imgUrl ? (
          <Popover
            trigger="hover"
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
            <div>
              <OpacityComponent>
                <Button
                  type="text"
                  style={{ borderLeft: `1px solid ${theme.color.gray200}`, paddingLeft: '20px', marginLeft: '20px' }}
                >
                  가격확인
                </Button>
              </OpacityComponent>
            </div>
          </Popover>
        ) : null}
        {singlePrice && singleCanvasName && imgUrl ? (
          <OpacityComponent>
            <ToolSinglePrice>
              <span>{singleCanvasName} -</span>
              <Button type="text">{singlePrice}원</Button>
            </ToolSinglePrice>
          </OpacityComponent>
        ) : null}
      </div>
      {imgUrl && (
        <OpacityComponent>
          <>
            <ToolHelperButton />
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
          </>
        </OpacityComponent>
      )}
    </ToolHeaderMenu>
  );
};

export default ToolHeader;
