import styled from '@emotion/styled';
import { Button, Steps } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { isMobile } from 'react-device-detect';
const { Step } = Steps;

const MobileSingleToolContainer = styled.div`
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
  }
`;

const MobileSingleTool = () => {
  const FIRST_INDEX = 0;
  const LAST_INDEX = 3;
  const [stepCount, setStepCount] = useState(0);

  const stepTitle = useMemo(() => {
    const title = new Map();
    title.set(0, '액자 선택');
    title.set(1, '사진 업로드');
    title.set(2, '시안 확인');
    title.set(3, '저장하기');
    return title;
  }, []);

  const handleNextStep = useCallback(() => {
    setStepCount((prev) => prev + 1);
  }, []);

  const handlePrevStep = useCallback(() => {
    setStepCount((prev) => prev - 1);
  }, []);

  //   if (!isMobile) {
  //     return null;
  //   }

  return (
    <MobileSingleToolContainer>
      <Steps size="small" current={stepCount}>
        <Step title={stepTitle.get(0)} />
        <Step title={stepTitle.get(1)} />
        <Step title={stepTitle.get(2)} />
        <Step title={stepTitle.get(3)} />
      </Steps>

      {/* step1 */}
      {stepCount === 0 && <div>액자 고르기</div>}
      {/* step2 */}
      {stepCount === 1 && <div>사진 업로드</div>}
      {/* step3 */}
      {stepCount === 2 && <div>시안 확인</div>}
      {/* step4 */}
      {stepCount === 3 && <div>저장하기</div>}

      {FIRST_INDEX !== stepCount && (
        <Button type="primary" onClick={handlePrevStep}>
          {stepTitle.get(stepCount - 1)}
        </Button>
      )}

      {LAST_INDEX !== stepCount && (
        <Button type="primary" onClick={handleNextStep}>
          {stepTitle.get(stepCount)}
        </Button>
      )}
    </MobileSingleToolContainer>
  );
};

export default MobileSingleTool;
