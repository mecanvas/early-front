import { useRouter } from 'next/router';
import { ComponentType, useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';

const PreventModalContainer = styled.div<{ visible: boolean }>``;

const usePreventPageLeave = () => {
  const { push, asPath, beforePopState } = useRouter();
  const [referrer, setReferrer] = useState<string | null>(null);
  const [needConfirm, setNeedConfirm] = useState(false);
  const [openModal, setOpenModal] = useState(false);
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

  const PreventModal = () => {
    return (
      <>
        {openModal && (
          <PreventModalContainer visible={openModal}>
            <div>나가?</div>
            <button onClick={handleLeavePage}>웅 나가</button>
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
