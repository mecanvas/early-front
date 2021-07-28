import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { Images } from 'public';
import { css } from '@emotion/react';
import { CheckCircleFilled, CheckSquareTwoTone } from '@ant-design/icons';
import { icons } from 'public/icons';
import image from 'src/store/reducers/image';
import { useAppDispatch } from 'src/hooks/useRedux';
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
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.19), 0 1px 1px rgba(0, 0, 0, 0.23);
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
  const dispatch = useAppDispatch();
  const selectBoxList = useMemo(() => {
    return [
      {
        id: 1,
        title: '옆면을 확장해 주세요',
        subTitle: '선택 시 이미지가 옆면까지 확장됩니다.',
        exampleImg: Images.sample1,
        isSelected: true,
      },
      {
        id: 2,
        title: '기본으로 해주세요.',
        subTitle: '흰색 옆면이 적용됩니다.',
        exampleImg: Images.sample1,
        isSelected: false,
      },
    ];
  }, []);
  const [selectBox, setSelectBox] = useState(selectBoxList);

  const handleCheck = useCallback(
    (e) => {
      const { scale } = e.currentTarget.dataset;
      if (!scale) return;
      setSelectBox(selectBox.map((lst) => ({ ...lst, isSelected: !lst.isSelected })));
      dispatch(setCanvasSaveScale({ scaleType: +scale }));
    },
    [dispatch, selectBox],
  );

  useEffect(() => {
    dispatch(setCanvasSaveScale({ scaleType: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
