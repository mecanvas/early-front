import { Divider } from 'antd';
import React from 'react';
import { getS3 } from 'src/utils/getS3';
import styeld from '@emotion/styled';

const Img = styeld.img`
  max-width: 75%;
  max-height: 250px;
`;

const Video = styeld.video`
  max-width: 75%;
  max-height: 250px;
`;

const TutorialTitle = ({
  title,
  imgUrl,
  videoUrl,
}: {
  title: string;
  imgUrl?: string | string[];
  videoUrl?: string;
}) => {
  return (
    <>
      <h4>{title}</h4>
      {imgUrl &&
        (typeof imgUrl !== 'string' ? (
          (imgUrl as string[]).map((lst) => <Img src={getS3(lst)} />)
        ) : (
          <Img src={getS3(imgUrl as string)} />
        ))}
      {videoUrl && <Video muted src={getS3(videoUrl)} autoPlay loop />}
      <Divider />
    </>
  );
};

export default TutorialTitle;
