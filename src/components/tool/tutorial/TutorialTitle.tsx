import { Divider } from 'antd';
import React from 'react';
import { getS3 } from 'src/utils/getS3';
import styeld from '@emotion/styled';

const Img = styeld.img`
  max-width: 80%;
`;

const TutorialTitle = ({ title, imgUrl }: { title: string; imgUrl: string }) => {
  return (
    <>
      <h4>{title}</h4>
      <Img src={getS3(imgUrl)} />
      <Divider />
    </>
  );
};

export default TutorialTitle;
