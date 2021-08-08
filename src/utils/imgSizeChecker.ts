import { IMG_LIMIT_MINIMUM_SIZE } from 'src/constants';

// 기본적인 1mb 사이즈를 넘어줘야~함
export const imgSizeChecker = (file: File) => {
  if (file.size > IMG_LIMIT_MINIMUM_SIZE) {
    return true;
  }
  alert('이미지는 최소 1MB이상이어야 합니다.');
  return false;
};
