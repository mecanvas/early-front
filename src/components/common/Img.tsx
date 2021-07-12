import React, { useEffect, useState } from 'react';
import { Image as AntdImage } from 'antd';
import { useClosePreview } from 'src/hooks/useClosePreview';
import { getOriginRatio } from 'src/utils/getOriginRatio';
import { theme } from 'src/style/theme';

interface Props {
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
  maxHeight?: number;
  bordered?: boolean;
}

const Img = ({ src, alt, width, height, maxHeight = 500, bordered }: Props) => {
  const [imgPreview, handleImgPreview] = useClosePreview();
  const [originSize, setOriginSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!src) return;
    if (width && height) return;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const originWidth = img.naturalWidth;
      const originHeight = img.naturalHeight;
      const [w, h] = getOriginRatio(originWidth, originHeight);
      const width = w * maxHeight > originHeight ? originHeight : maxHeight;
      const height = h * width;

      setOriginSize({ ...originSize, width, height });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AntdImage
      style={bordered ? { border: `1px solid ${theme.color.gray200}` } : {}}
      preview={{
        mask: '확대',
        onVisibleChange: handleImgPreview,
        visible: imgPreview,
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      width={width || originSize.width}
      height={height || originSize.height}
      src={src || ''}
      alt={alt}
    />
  );
};

export default Img;
