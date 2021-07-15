import { useRouter } from 'next/router';
import React, { ComponentType, useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { animated, useSpring } from 'react-spring';
import { Button } from 'antd';

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
  background: ${({ theme }) => theme.color.gray600};
  opacity: 0.5;
`;

const PreventModalForm = styled.div`
  border-radius: 20px;
  width: 360px;
  height: 204px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.color.gray200};
  background: ${({ theme }) => theme.color.white};
`;

const PreventModalText = styled.div`
  justify-items: flex-end;
  p {
    margin: 0;
    font-size: 15px;
    line-height: 30px;
  }
`;

const PreventModalButton = styled.div`
  display: flex;
  justify-content: center;

  button {
    font-size: 13px;
  }
  button ~ button {
    margin-left: 4px;
    padding: 3px 7px;
  }
`;

const usePreventPageLeave = () => {
  const { push, asPath, beforePopState } = useRouter();
  const [referrer, setReferrer] = useState<string | null>(null);
  const [needConfirm, setNeedConfirm] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [modalOpen, modalApi] = useSpring(() => {
    return {
      from: { transform: 'scale(0.5)', translateY: `15px` },
      to: { transform: 'scale(1)', translateY: `0px` },
      config: { duration: 200 },
    };
  });

  const handleLeavePage = useCallback(() => {
    setOpenModal(false);
    push(referrer || '/');
  }, [push, referrer]);

  const handlePreventLeave = useCallback(() => {
    setOpenModal(true);
    window.history.pushState('/', '');
    push(asPath);
    return false;
  }, [asPath, push]);

  const preventPageLeaveTrigger = useCallback(() => {
    setNeedConfirm(true);
  }, []);

  useEffect(() => {
    if (!needConfirm) return;
    if (process.browser) {
      if (!referrer) setReferrer(document.referrer || '/');
      beforePopState(handlePreventLeave);
      window.onbeforeunload = (e) => {
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
  }, [needConfirm]);

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
        {!openModal && (
          <PreventModalContainer visible={openModal}>
            <PreventModalBg></PreventModalBg>
            <animated.div style={modalOpen}>
              <PreventModalForm>
                <>
                  <PreventModalText>
                    <p>현재 진행 중인 작업을 종료하시겠어요?</p>
                    <p>저장하지 않은작업 내역은 삭제 됩니다. </p>
                  </PreventModalText>
                  <PreventModalButton>
                    <Button type="default" onClick={handleLeavePage}>
                      저장하지 않고 종료
                    </Button>
                    <Button type="primary" onClick={handleLeavePage}>
                      저장하고 종료
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

  return { preventPageLeaveTrigger, PreventModal };
};

export const PreventPageLeave = (Component: ComponentType) => {
  const PreventHoc = () => {
    const { preventPageLeaveTrigger, PreventModal } = usePreventPageLeave();

    useEffect(() => {
      preventPageLeaveTrigger();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <>
        <PreventModal />
        <Component />
      </>
    );
  };
  return PreventHoc;
};
