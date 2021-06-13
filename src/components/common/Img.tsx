import React from 'react';
import { Image } from 'antd';
import { useClosePreview } from 'src/hooks/useClosePreview';

interface Props {
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
}

const Img = ({ src, alt, width, height }: Props) => {
  const [imgPreview, handleImgPreview] = useClosePreview();

  return (
    <Image
      preview={{
        mask: '확대',
        onVisibleChange: handleImgPreview,
        visible: imgPreview,
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      width={width || 100}
      height={height || 100}
      src={src || ''}
      alt={alt}
    />
  );
};

export default Img;
