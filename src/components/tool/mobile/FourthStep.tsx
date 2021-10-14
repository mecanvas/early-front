import React, { useCallback, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { icons } from 'public/icons';
import { useAppDispatch, useAppSelector } from 'src/hooks/useRedux';
import { setCanvasSaveScale } from 'src/store/reducers/canvas';

const Container = styled.div`
  h4 {
    text-align: center;
  }
`;

const SelectWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  div + div {
    margin-left: 3em;
  }

  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    flex-direction: column;
    div + div {
      margin-left: 0em;
    }
  }
`;

const SelectBox = styled.div<{ selected: boolean }>`
  ${({ selected }) =>
    selected
      ? css`
          pointer-events: none;
        `
      : css`
          cursor: pointer;
        `}
  position: relative;
  margin: 1em 0;
  padding: 1em 0;
  width: 300px;
  h5 {
    margin: 0;
  }
  &:hover {
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  }
  border: 1px solid ${({ theme }) => theme.color.gray200};
  text-align: center;
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    width: 250px;
  }
`;

const SelectCheck = styled.div<{ selected: boolean }>`
  ${({ selected }) =>
    selected
      ? css`
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.3);
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 80px;
            height: 80px;
          }
        `
      : css`
          display: none;
        `}
`;

const SelectImage = styled.div`
  width: 300px;
  margin: 0 auto;
  padding: 2em;
  img {
    width: 100%;
    max-width: 150px;
  }
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    width: 235px;
  }
`;

const FourthStep = () => {
  const { canvasOrder } = useAppSelector((state) => state.canvas);
  const dispatch = useAppDispatch();
  const selectBoxList = useMemo(() => {
    return [
      {
        id: 1,
        title: '옆면-흰색',
        subTitle: '흰색 옆면이 적용됩니다.',
        exampleImg: 'https://early21-assets.s3.ap-northeast-2.amazonaws.com/img/example/side1.png',
        isSelected: canvasOrder.scaleType ? canvasOrder.scaleType === 1 : false,
      },
      {
        id: 2,
        title: '옆면-배경색',
        subTitle: '이미지의 배경색이 옆면으로 됩니다.',
        exampleImg: 'https://early21-assets.s3.ap-northeast-2.amazonaws.com/img/example/side2.png',
        isSelected: canvasOrder.scaleType ? canvasOrder.scaleType === 2 : false,
      },
      {
        id: 3,
        title: '옆면-좌우반전',
        subTitle: '이미지가 옆면으로 좌우반전되어 확장됩니다.',
        exampleImg: 'https://early21-assets.s3.ap-northeast-2.amazonaws.com/img/example/side3.png',
        isSelected: canvasOrder.scaleType ? canvasOrder.scaleType === 3 : false,
      },
    ];
  }, [canvasOrder.scaleType]);
  const [selectBox, setSelectBox] = useState(selectBoxList);

  const handleCheck = useCallback(
    (e) => {
      const { scale } = e.currentTarget.dataset;
      if (!scale) return;
      setSelectBox(selectBox.map((lst) => ({ ...lst, isSelected: lst.id === +scale ? true : false })));
      dispatch(setCanvasSaveScale({ scaleType: +scale as 1 | 2 | 3 }));
    },
    [dispatch, selectBox],
  );

  return (
    <Container>
      <h4 style={{ textAlign: 'center' }}>옆면은 어떻게 할까요?</h4>
      <SelectWrapper>
        {selectBox.map((lst) => (
          <SelectBox data-scale={lst.id} selected={lst.isSelected} onClick={handleCheck}>
            <h5>{lst.title}</h5>
            <small>{lst.subTitle}</small>
            <SelectImage>
              <img src={lst.exampleImg} alt="옆면 확장 샘플 사진" />
              <SelectCheck selected={lst.isSelected}>
                <img src={icons.success} alt="성공시 보여줄 아이콘" />
              </SelectCheck>
            </SelectImage>
          </SelectBox>
        ))}
      </SelectWrapper>
    </Container>
  );
};

export default FourthStep;
