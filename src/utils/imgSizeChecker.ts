// 기본적인 1mb 사이즈를 넘어줘야~함
export const imgSizeChecker = (file: File) => {
  if (file.size > 1_000_000) {
    return true;
  }
  alert('이미지는 최소 1MB이상이어야 합니다.');
  return false;
};
