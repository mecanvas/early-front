import styled from '@emotion/styled';
import { useSpring } from '@react-spring/core';
import { animated } from '@react-spring/web';
import { Button } from 'antd';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setModalVisible } from 'src/store/reducers/utils';
import { useAppSelector } from './useRedux';

const PreventModalContainer = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
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
  width: 400px;
  padding: 2em;
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
  margin-top: 1.25em;
  button {
    font-size: 14px;
    padding: 0.3em 1.2em;
    font-weight: 500;
  }
  button ~ button {
    margin-left: 4px;
  }
`;

export const useNoticeModal = ({
  okUrl,
  cancelUrl,
  bodyText,
  okText,
  cancelText,
  isPrevent,
  img,
}: {
  okUrl: string;
  cancelUrl: string;
  bodyText: string;
  okText: string;
  cancelText: string;
  isPrevent?: boolean;
  img?: string;
}) => {
  const { push, asPath, beforePopState } = useRouter();
  const dispatch = useDispatch();
  const { modalVisible } = useAppSelector((state) => state.utils);

  const [modalOpen, modalApi] = useSpring(() => {
    return {
      from: { transform: 'scale(0.5)', translateY: `15px` },
      to: { transform: 'scale(1)', translateY: `0px` },
      config: { duration: 200 },
    };
  });

  const handleLeavePage = useCallback(() => {
    dispatch(setModalVisible(false));
    if (okUrl) {
      push(`${okUrl}`);
    }
  }, [dispatch, push, okUrl]);

  const handleCloseModal = useCallback(() => {
    dispatch(setModalVisible(false));
    if (cancelUrl) {
      push(`${cancelUrl}`);
    }
  }, [cancelUrl, dispatch, push]);

  const handlePreventLeave = useCallback(() => {
    dispatch(setModalVisible(true));
    push(asPath);
    return false;
  }, [asPath, dispatch, push]);

  useEffect(() => {
    if (process.browser) {
      if (isPrevent) {
        beforePopState(handlePreventLeave);
        window.onbeforeunload = (e: any) => {
          e.preventDefault();
          e.returnValue = '';
          return false;
        };
      }
    }
    return () => {
      window.onbeforeunload = null;
      beforePopState(() => true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPrevent]);

  useEffect(() => {
    if (modalVisible) {
      modalApi.update({
        from: { transform: 'scale(0.5)', translateY: `15px` },
        to: { transform: 'scale(1)', translateY: `0px` },
        config: { duration: 200 },
      });
      modalApi.start();
    }
  }, [modalApi, modalVisible]);

  const NoticeModal = () => (
    <>
      {modalVisible && (
        <PreventModalContainer visible={modalVisible}>
          <PreventModalBg></PreventModalBg>
          <animated.div style={modalOpen}>
            <PreventModalForm>
              <>
                <PreventModalClose onClick={handleCloseModal}>
                  <Button type="text">X</Button>
                </PreventModalClose>
                {img ? (
                  <div>
                    <img src={img} alt="모달 이미지" />
                  </div>
                ) : null}
                <PreventModalText>{bodyText}</PreventModalText>
                <PreventModalButton>
                  <Button type="default" onClick={handleCloseModal}>
                    {cancelText}
                  </Button>
                  <Button type="primary" onClick={handleLeavePage}>
                    {okText}
                  </Button>
                </PreventModalButton>
              </>
            </PreventModalForm>
          </animated.div>
        </PreventModalContainer>
      )}
    </>
  );
  return { NoticeModal };
};
