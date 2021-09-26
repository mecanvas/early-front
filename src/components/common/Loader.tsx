import { useAppSelector } from 'src/hooks/useRedux';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import React, { useMemo } from 'react';
import { Spin } from 'antd';

const Container = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 50;
`;

const LoaderSpin = styled(Spin)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 50;
`;

const LoadingBackground = styled.div<{ isImageUpload: boolean }>`
  position: fixed;
  width: 100%;
  height: calc(100%);
  top: 0px;
  left: 0;
  z-index: 50;
  ${({ isImageUpload, theme }) =>
    isImageUpload &&
    css`
      background-color: ${theme.color.white};
      opacity: 0.4;
    `}
`;

const LoadingWrapper = styled.div`
  width: 100%;
  height: 5px;
  background: ${({ theme }) => theme.color.gray100};
  border-radius: 6px;
`;

const LoadingBar = styled.div<{ progressPercentage: number }>`
  position: relative;
  float: left;
  min-width: 1%;
  height: 100%;
  background: ${({ theme }) => theme.color.primary};
  max-width: 100%;
  ${({ progressPercentage }) =>
    progressPercentage &&
    css`
      width: ${progressPercentage}%;
    `};
`;

const Loader = () => {
  const { isImgUploadDone, isImgUploadLoad, progressPercentage } = useAppSelector((state) => state.progress);
  const { isCanvasSaveDone, isCanvasSaveLoad } = useAppSelector((state) => state.canvas);

  const isCanvasSave = useMemo(() => {
    return !isCanvasSaveDone && isCanvasSaveLoad;
  }, [isCanvasSaveDone, isCanvasSaveLoad]);

  const isImageUpload = useMemo(() => {
    return !isImgUploadDone && isImgUploadLoad;
  }, [isImgUploadDone, isImgUploadLoad]);

  if (!isImageUpload && !isCanvasSaveLoad) {
    return null;
  }

  return (
    <>
      <LoaderSpin size="large" />
      <LoadingBackground isImageUpload={!isImageUpload || !isCanvasSave} />
      <Container>
        <LoadingWrapper>
          <LoadingBar progressPercentage={progressPercentage}></LoadingBar>
        </LoadingWrapper>
      </Container>
    </>
  );
};

export default Loader;
