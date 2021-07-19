import { Divider } from 'antd';
import React from 'react';
import { getS3 } from 'src/utils/getS3';
import styeld from '@emotion/styled';

const Img = styeld.img`
  max-width: 80%;
`;

const TutorialTitle = ({ title, imgUrl }: { title: string; imgUrl: string | string[] }) => {
  return (
    <>
      <h4>{title}</h4>
      {typeof imgUrl !== 'string' ? (
        (imgUrl as string[]).map((lst) => <Img src={getS3(lst)} />)
      ) : (
        <Img src={getS3(imgUrl as string)} />
      )}
      <Divider />
    </>
  );
};

export default TutorialTitle;
