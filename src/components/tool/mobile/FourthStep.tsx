import React, { useCallback, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { Images } from 'public';
import { css } from '@emotion/react';
import { icons } from 'public/icons';
import { useAppDispatch, useAppSelector } from 'src/hooks/useRedux';
import { setCanvasSaveList, setCanvasSaveScale } from 'src/store/reducers/canvas';
import { createExpandCanvas } from 'src/utils/createExpandSave';

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
  }
`;

const FourthStep = () => {
  const { canvasOrder, canvasSaveList } = useAppSelector((state) => state.canvas);
  const { selectedFrame } = useAppSelector((state) => state.frame);
  const dispatch = useAppDispatch();
  const selectBoxList = useMemo(() => {
    return [
      {
        id: 1,
        title: '기본으로 해주세요.',
        subTitle: '흰색 옆면이 적용됩니다.',
        exampleImg: Images.sample1,
        isSelected: canvasOrder.scaleType ? canvasOrder.scaleType === 1 : false,
      },
      {
        id: 2,
        title: '옆면을 확장해 주세요',
        subTitle: '선택 시 이미지가 옆면까지 확장됩니다.',
        exampleImg: Images.sample1,
        isSelected: canvasOrder.scaleType ? canvasOrder.scaleType === 2 : false,
      },
    ];
  }, [canvasOrder]);
  const [selectBox, setSelectBox] = useState(selectBoxList);

  const handleCheck = useCallback(
    (e) => {
      const { scale } = e.currentTarget.dataset;
      if (!scale) return;
      setSelectBox(selectBox.map((lst) => ({ ...lst, isSelected: lst.id === +scale ? true : false })));
      const saveCanvas = createExpandCanvas(selectedFrame, +scale as 1 | 2);
      dispatch(
        setCanvasSaveList({ name: selectedFrame[0].name, saveCanvas, previewCanvas: canvasSaveList[0].previewCanvas }),
      );
      dispatch(setCanvasSaveScale({ scaleType: +scale as 1 | 2 }));
    },
    [canvasSaveList, dispatch, selectBox, selectedFrame],
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
