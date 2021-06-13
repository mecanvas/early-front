import { useState, useCallback, useEffect } from 'react';

// 이미지가 확대된 사진을 클릭했을 시 grap이 아니라 닫히게 함.
export const useClosePreview = () => {
  const [imgPreview, setImgPreview] = useState(false);

  const handleImgPreview = useCallback((value: boolean) => {
    setImgPreview(() => value);
  }, []);

  const handlePreviewImgClose = (e: any) => {
    setImgPreview(() => false);
    e.stopPropagation();
  };

  useEffect(() => {
    if (!imgPreview) return;
    const img = document.querySelectorAll('.ant-image-preview-img');
    img?.forEach((node) => node.addEventListener('click', handlePreviewImgClose));
    return () => {
      img?.forEach((node) => node.removeEventListener('click', handlePreviewImgClose));
    };
  }, [imgPreview]);

  return [imgPreview, handleImgPreview] as const;
};
