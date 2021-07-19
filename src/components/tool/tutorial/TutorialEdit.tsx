import React from 'react';
import styled from '@emotion/styled';
import { getS3 } from 'src/utils/getS3';
import { Divider } from 'antd';

const TutorialContainer = styled.div`
  padding: 1.5em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  h4 {
    margin-bottom: 1em;
  }
`;

const Descriptions = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

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

const BadgesItem = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  background-color: ${({ theme }) => theme.color.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    color: ${({ theme }) => theme.color.white};
    font-size: 15px;
  }
`;

const Badge = ({ count }: { count: number }) => {
  return (
    <BadgesItem>
      <span>{count}</span>
    </BadgesItem>
  );
};

const TutorialEdit = () => {
  return (
    <TutorialContainer>
      <h4>에디터에서는 다음과 같은 도구들을 제공합니다.</h4>
      <img src={getS3('tutorial/header.png')} />
      <Divider />

      <Descriptions>
        <BadgesItemList>
          <Badge count={1} />
          <p>이미지 첨부(변경)를 합니다. 화면상에 드롭도 가능합니다.</p>
        </BadgesItemList>
        <BadgesItemList>
          <Badge count={2} />
          <p>현재 이미지를 수평으로 정렬합니다.</p>
        </BadgesItemList>
        <BadgesItemList>
          <Badge count={3} />
          <p>현재 이미지를 수직으로 정렬합니다.</p>
        </BadgesItemList>
        <BadgesItemList>
          <Badge count={4} />
          <p>테두리로 구분된 액자의 배경을 변경합니다.</p>
        </BadgesItemList>
        <BadgesItemList>
          <Badge count={5} />
          <p>선택한 액자의 크기에 맞춰 이미지를 채워 넣습니다.</p>
        </BadgesItemList>
        <BadgesItemList>
          <Badge count={6} />
          <p>이미지의 비율을 자동으로 조정합니다.</p>
        </BadgesItemList>
      </Descriptions>
    </TutorialContainer>
  );
};

export default TutorialEdit;
