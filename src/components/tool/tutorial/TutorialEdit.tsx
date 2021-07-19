import React from 'react';
import styled from '@emotion/styled';
import { TutorialContainer, Descriptions, BadgeNumber } from './TutorialStyle';
import TutorialTitle from './TutorialTitle';

const BadgesItemList = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5em 0;
  padding: 0 2em;
  p {
    margin: 0;
    margin-left: 0.6em;
  }
`;

const TutorialEdit = () => {
  return (
    <TutorialContainer>
      <TutorialTitle title="에디터에서는 다음과 같은 도구들을 제공합니다." imgUrl="tutorial/header.png" />

      <Descriptions>
        <BadgesItemList>
          <BadgeNumber count={1} />
          <p>이미지 첨부(변경)를 합니다. 화면상에 드롭도 가능합니다.</p>
        </BadgesItemList>
        <BadgesItemList>
          <BadgeNumber count={2} />
          <p>현재 이미지를 수평으로 정렬합니다.</p>
        </BadgesItemList>
        <BadgesItemList>
          <BadgeNumber count={3} />
          <p>현재 이미지를 수직으로 정렬합니다.</p>
        </BadgesItemList>
        <BadgesItemList>
          <BadgeNumber count={4} />
          <p>테두리로 구분된 액자의 배경을 변경합니다.</p>
        </BadgesItemList>
        <BadgesItemList>
          <BadgeNumber count={5} />
          <p>선택한 액자의 크기에 맞춰 이미지를 채워 넣습니다.</p>
        </BadgesItemList>
        <BadgesItemList>
          <BadgeNumber count={6} />
          <p>이미지의 비율을 자동으로 조정합니다.</p>
        </BadgesItemList>
      </Descriptions>
    </TutorialContainer>
  );
};

export default TutorialEdit;
