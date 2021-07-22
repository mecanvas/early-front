import { useRouter } from 'next/router';
import React, { ComponentType, useCallback, useEffect } from 'react';
import styled from '@emotion/styled';
import { animated, useSpring } from 'react-spring';
import { Button } from 'antd';
import { useGlobalState } from 'src/hooks';

const PreventModalContainer = styled.div<{ visible: boolean }>`
  position: fixed;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const PreventModalBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: ${({ theme }) => theme.color.gray500};
  opacity: 0.5;
`;

const PreventModalForm = styled.div`
  border-radius: 12px;
  position: relative;
  width: 460px;
  height: 285px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.color.gray200};
  background: ${({ theme }) => theme.color.white};
`;

const PreventModalClose = styled.span`
  position: absolute;
  right: 5px;
  top: 5px;
  button {
    font-size: 18px;
  }
`;

const PreventModalText = styled.div`
  text-align: center;
  p {
    margin: 0;
    font-size: 14px;
    line-height: 22px;
  }
`;

const PreventModalButton = styled.div`
  display: flex;
  justify-content: center;

  button {
    font-size: 14px;
    font-weight: 500;
  }
  button ~ button {
    margin-left: 4px;
    padding: 3px 7px;
  }
`;

const usePreventPageLeave = () => {
  const { push, asPath, beforePopState } = useRouter();
  const [, setIsSaveCanvas] = useGlobalState<boolean>('saveModal');
  const [imgUploadUrl] = useGlobalState<string>('imgUploadUrl');
  const [singleImgUploadUrl] = useGlobalState<string>('singleImgUploadUrl');

  const [modalOpen, modalApi] = useSpring(() => {
    return {
      from: { transform: 'scale(0.5)', translateY: `15px` },
      to: { transform: 'scale(1)', translateY: `0px` },
      config: { duration: 200 },
    };
  });

  const [openModal, setOpenModal] = useGlobalState<boolean>('openModal', false);

  const handleSaveCanvas = useCallback(() => {
    setOpenModal(false);
    setIsSaveCanvas(true);
  }, [setIsSaveCanvas, setOpenModal]);

  const handleLeavePage = useCallback(() => {
    setOpenModal(false);
    push('/tool');
  }, [push, setOpenModal]);

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
  }, [setOpenModal]);

  const handlePreventLeave = useCallback(() => {
    setOpenModal(true);
    push(asPath);
    return false;
  }, [asPath, push, setOpenModal]);

  useEffect(() => {
    if (process.browser) {
      if (!singleImgUploadUrl && !imgUploadUrl) {
        return;
      }
      beforePopState(handlePreventLeave);
      window.onbeforeunload = (e: any) => {
        e.preventDefault();
        e.returnValue = '';
        return false;
      };
    }
    return () => {
      window.onbeforeunload = null;
      beforePopState(() => true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleImgUploadUrl, imgUploadUrl]);

  useEffect(() => {
    if (openModal) {
      modalApi.update({
        from: { transform: 'scale(0.5)', translateY: `15px` },
        to: { transform: 'scale(1)', translateY: `0px` },
        config: { duration: 200 },
      });
      modalApi.start();
    }
  }, [modalApi, openModal]);

  const PreventModal = () => {
    return (
      <>
        {openModal && (
          <PreventModalContainer visible={openModal}>
            <PreventModalBg></PreventModalBg>
            <animated.div style={modalOpen}>
              <PreventModalForm>
                <>
                  <PreventModalClose onClick={handleCloseModal}>
                    <Button type="text">X</Button>
                  </PreventModalClose>
                  <div>
                    <img src={'https://resource.miricanvas.com/image/argo/argo_embarrassed.svg'} />
                  </div>
                  <PreventModalText>
                    <p>저장하지 않으시면작업 내역이 사라져요!</p>
                    <p>현재 진행 중인 작업을 종료하시겠어요?</p>
                  </PreventModalText>
                  <PreventModalButton>
                    <Button type="default" onClick={handleLeavePage}>
                      저장하지 않고 나가기
                    </Button>
                    <Button type="primary" onClick={handleSaveCanvas}>
                      저장하고 나가기
                    </Button>
                  </PreventModalButton>
                </>
              </PreventModalForm>
            </animated.div>
          </PreventModalContainer>
        )}
      </>
    );
  };

  return { PreventModal };
};

export const PreventPageLeave = (Component: ComponentType) => {
  const PreventHoc = () => {
    const { PreventModal } = usePreventPageLeave();

    return (
      <>
        <PreventModal />
        <Component />
      </>
    );
  };
  return PreventHoc;
};
