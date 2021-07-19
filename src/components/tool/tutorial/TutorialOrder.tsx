import React from 'react';
import { TutorialContainer, BadgeNumberDesc, Descriptions } from './TutorialStyle';
import TutorialTitle from './TutorialTitle';

const TutorialOrder = () => {
  return (
    <TutorialContainer>
      <TutorialTitle title="오른쪽 상단의 저장 버튼을 클릭하세요." imgUrl={['tutorial/order2.png']} />
      <Descriptions>
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
          count={2}
          desc={
            <div>
              주문하신 <b>호수와 개수, 가격이</b> 맞는지 확인해 주세요.
            </div>
          }
        />
        <BadgeNumberDesc
          count={2}
          desc={
            <div>
              <b>확인</b>을 누르면 주문이 완료됩니다.
            </div>
          }
        />
      </Descriptions>
    </TutorialContainer>
  );
};

export default TutorialOrder;
