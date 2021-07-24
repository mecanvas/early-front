import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useCallback, useRef, useState } from 'react';
import { useAppSelector } from 'src/hooks/useRedux';

const ThirdItemList = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 2em 0;
  & > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 1em;
    text-align: center;
  }
  small {
    margin-top: 6px;
  }
`;

const ThirdItem = styled.div<{ type: 1 | 2; selected: boolean }>`
  cursor: pointer;
  width: ${({ type }) => (type === 1 ? '80px' : '60px')};
  height: ${({ type }) => (type === 2 ? '80px' : '80px')};
  text-align: center;
  border: 1px solid ${({ theme }) => theme.color.gray400};
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  ${({ selected }) =>
    selected
      ? css`
          transform: scale(1.2);
        `
      : css`
          filter: brightness(60%);
        `}
  &:hover {
    transform: scale(1.1);
  }
`;

const ThirdContent = styled.div`
  display: grid;
  gap: 1em;
  grid-template-columns: repeat(2, 1fr);
  justify-content: center;
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    justify-content: space-between;
  }
`;

const ThirdContentDrawingCanvas = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.color.gray500};
  /* background-color: ${({ theme }) => theme.color.white}; */
`;

const ThirdContentCropper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 285px;
  height: 285px;
  transform: translate(-50%, -50%);
  cursor: move;

  /* top */
  span:nth-of-type(1) {
    position: absolute;
    top: 0;
    width: 100%;
    height: 1px;
    border-top: 2px dashed ${({ theme }) => theme.color.primary};
  }
  /* right */
  span:nth-of-type(2) {
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    border-right: 2px dashed ${({ theme }) => theme.color.primary};
  }
  /* bottom */
  span:nth-of-type(3) {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1px;
    border-bottom: 2px dashed ${({ theme }) => theme.color.primary};
  }
  /* left */
  span:nth-of-type(4) {
    position: absolute;
    left: 0;
    top: 0;
    width: 1px;
    height: 100%;
    border-left: 2px dashed ${({ theme }) => theme.color.primary};
  }
`;

// TODO: 캔버스로 전환 예정 이미지 자를 수 있게.
const LikeCanvas = styled.div`
  width: 100%;
  max-width: 462.5px;
  background-color: #a5b0e6;
  filter: brightness(70%);

  img {
    width: 100%;
  }
`;

const ThirdPreviewCanvasWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6em;
  background-color: ${({ theme }) => theme.color.gray000};

  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    padding: 6em;
  }
`;

const ThirdPreviewCanvas = styled.div`
  width: 100%;
  max-width: 302px;
  filter: ${({ theme }) => theme.canvasShadowFilter};
  background-color: #a5b0e6;

  img {
    width: 100%;
    height: 100%;
  }
`;

const ThirdStep = () => {
  const { selectedFrame } = useAppSelector(({ frame }) => frame);
  const imgCanvas = useRef<HTMLCanvasElement>(null);
  const [selectCanvas, setSelectCanvas] = useState(selectedFrame[0]?.name);

  const createImgCanvas = useCallback(() => {}, []);

  const handleSelected = useCallback((e) => {
    const { name } = e.currentTarget.dataset;
    setSelectCanvas(name);
  }, []);

  return (
    <>
      <ThirdContent>
        <ThirdContentDrawingCanvas>
          <canvas ref={imgCanvas} />
          {/* <LikeCanvas>
          <img src="https://early-dev.s3.ap-northeast-2.amazonaws.com/brian-lawson-RBy6FEQ2DIk-unsplash-removebg-preview.png" />
        </LikeCanvas>
        <ThirdContentCropper>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </ThirdContentCropper> */}
        </ThirdContentDrawingCanvas>

        <ThirdPreviewCanvasWrapper>
          <ThirdPreviewCanvas>
            <img
              src={
                'https://early-dev.s3.ap-northeast-2.amazonaws.com/20210718174824_2021%E1%84%82%E1%85%A7%E1%86%AB+07%E1%84%8B%E1%85%AF%E1%86%AF+18%E1%84%8B%E1%85%B5%E1%86%AF+17_48_gg_%E1%84%8C%E1%85%A5%E1%86%BC%E1%84%87%E1%85%A1%E1%86%BC+S-1%E1%84%92%E1%85%A9.png'
              }
            />
          </ThirdPreviewCanvas>
        </ThirdPreviewCanvasWrapper>
      </ThirdContent>
      <ThirdItemList>
        {selectedFrame.map((lst) => (
          <div>
            <ThirdItem
              type={lst.type}
              selected={lst.name === selectCanvas}
              onClick={handleSelected}
              data-name={lst.name}
            >
              <img src={lst.imgUrl} />
            </ThirdItem>
          </div>
        ))}
      </ThirdItemList>
    </>
  );
};

export default ThirdStep;
