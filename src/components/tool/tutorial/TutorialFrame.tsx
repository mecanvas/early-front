import React from 'react';
import { useGlobalState } from 'src/hooks';
import { BadgeNumberDesc, Descriptions, TutorialContainer } from './TutorialStyle';
import TutorialTitle from './TutorialTitle';

const TutorialFrame = () => {
  const [toolType] = useGlobalState<'single' | 'divided'>('toolType');

  return (
    <TutorialContainer>
      <TutorialTitle title="액자를 선택해 변경하세요." imgUrl="tutorial/select.png" />
      <Descriptions>
        <BadgeNumberDesc
          count={1}
          desc={
            <div>
              <b>정방/인물/해경/풍경</b> 테마 중 원하는 타입을 선택하세요
            </div>
          }
        />
        <BadgeNumberDesc count={2} desc="원하는 액자를 선택하면 사이즈가 자동 적용됩니다." />
        <BadgeNumberDesc count={3} desc="'접기'를 눌러 보이지 않게 할 수 있습니다." />
      </Descriptions>
    </TutorialContainer>
  );
};

export default TutorialFrame;
