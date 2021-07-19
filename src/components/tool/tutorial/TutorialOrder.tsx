import React from 'react';
import { TutorialContainer, BadgeNumberDesc, TutorialDescriptions } from './TutorialStyle';
import TutorialTitle from './TutorialTitle';

const TutorialOrder = () => {
  // const [toolType] = useGlobalState<'single' | 'divided'>('toolType');

  return (
    <TutorialContainer>
      <TutorialTitle title="오른쪽 상단의 저장 버튼을 클릭하세요." imgUrl={`tutorial/single/order2.png`} />
      <TutorialDescriptions>
        <BadgeNumberDesc count={1} desc={'저장 버튼 클릭 시 다음과 같은 화면이 나타납니다.'} />
        <BadgeNumberDesc
          count={2}
          desc={
            <div>
              <b>이름과 핸드폰, 주문 경로를</b> 정확히 입력해 주세요.
            </div>
          }
        />
        <BadgeNumberDesc
          count={3}
          desc={
            <div>
              주문하신 <b>호수와 개수, 가격이</b> 맞는지 확인해 주세요.
            </div>
          }
        />
        <BadgeNumberDesc
          count={4}
          desc={
            <div>
              <b>확인</b>을 누르면 저장이 완료됩니다.
            </div>
          }
        />
        <BadgeNumberDesc count={5} desc={<div>주문 사이트로 돌아가 안내에 따라 진행해 주세요.</div>} />
      </TutorialDescriptions>
    </TutorialContainer>
  );
};

export default TutorialOrder;
