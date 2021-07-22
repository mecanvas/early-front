import styled from '@emotion/styled';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal, Input, Checkbox, Button } from 'antd';
import React, { useCallback, useState } from 'react';
import { useGlobalState } from 'src/hooks';

export const ImageShowingWidthHeight = styled.small`
  position: absolute;
  top: 10px;
  z-index: 33;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.color.primary};
  border-radius: 20px;
  background-color: ${({ theme }) => theme.color.secondarybg};
  color: ${({ theme }) => theme.color.primary};
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    top: 5px;
    font-size: 13px;
  }
  @media all and (max-width: ${({ theme }) => theme.size.xs}) {
    font-size: 11px;
  }
  /* 사진 edit btn */
  span {
    position: absolute;
    cursor: pointer;
    right: -34px;
    top: 0;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    border: 1px solid ${({ theme }) => theme.color.primary};
    background-color: ${({ theme }) => theme.color.secondarybg};
    @media all and (max-width: ${({ theme }) => theme.size.sm}) {
      top: 1px;
      width: 28px;
      height: 28px;
    }
    svg {
      font-size: 16px;
      @media all and (max-width: ${({ theme }) => theme.size.sm}) {
        font-size: 14px;
      }
      path {
        fill: ${({ theme }) => theme.color.primary};
      }
    }
  }
`;

const ToolImageResizerModal = () => {
  const [originWidth] = useGlobalState<number>('originWidth');
  const [originHeight] = useGlobalState<number>('originHeight');
  const [resizeWidth, setResizeWidth] = useGlobalState<number>('resizeWidth');
  const [resizeHeight, setResizeHeight] = useGlobalState<number>('resizeHeight');
  const [ratioPersist, setRatioPersist] = useState(true);
  const [imgModalResizeOpen, setImgModalResizeOpen] = useState(false);

  const handleResizeReset = useCallback(() => {
    if (!originWidth || !originHeight) return;
    setResizeWidth(originWidth);
    setResizeHeight(originHeight);
  }, [setResizeWidth, originWidth, setResizeHeight, originHeight]);

  const handleRatioPersist = useCallback(() => {
    setRatioPersist((prev) => !prev);
  }, []);

  // 이미지 사이즈를 변경 입력
  const handleChangeImgSize = useCallback(
    (e) => {
      if (!originHeight || !originWidth) return;

      const { name, value } = e.target;
      if (name === 'width') {
        setResizeWidth(Math.ceil(+value));
        if (ratioPersist) {
          const ratioHeight = (+value * originHeight) / originWidth;
          setResizeHeight(ratioHeight);
        }
      }
      if (name === 'height') {
        setResizeHeight(Math.ceil(+value));
        if (ratioPersist) {
          setResizeWidth((+value * originWidth) / originHeight);
        }
      }
    },
    [originHeight, originWidth, ratioPersist, setResizeHeight, setResizeWidth],
  );

  const handleModalResize = useCallback(() => {
    setImgModalResizeOpen((prev) => !prev);
  }, []);

  const handleModalResizeOk = useCallback(() => {
    setImgModalResizeOpen((prev) => !prev);
  }, []);

  return (
    <>
      <ImageShowingWidthHeight>
        {`${resizeWidth?.toFixed()}px X ${resizeHeight?.toFixed()}px`}
        <span onClick={handleModalResize}>
          <FontAwesomeIcon icon={faEdit} />
        </span>
      </ImageShowingWidthHeight>

      <Modal
        visible={imgModalResizeOpen}
        onOk={handleModalResizeOk}
        onCancel={handleModalResize}
        title="이미지의 너비와 높이를 입력하세요."
      >
        <div>
          <form onChange={handleChangeImgSize}>
            <Input type="text" name="width" value={resizeWidth || ''} addonBefore="너비" addonAfter="px" />
            <Input type="text" name="height" value={resizeHeight || ''} addonBefore="높이" addonAfter="px" />
          </form>

          <div style={{ textAlign: 'right' }}>
            <Checkbox defaultChecked={ratioPersist} onChange={handleRatioPersist}>
              너비에 비율을 맞춥니다.
            </Checkbox>
          </div>
          <div style={{ textAlign: 'right', marginTop: '6px' }}>
            <Button onClick={handleResizeReset}>이미지 초기 사이즈로 되돌립니다.</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ToolImageResizerModal;
