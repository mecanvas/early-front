export const getOriginRatio = (
  originWidth: number,
  originHeight: number,
  resizeWidth?: number,
  resizeHeight?: number,
) => {
  const wRatio = originWidth / originHeight;
  const hRatio = originHeight / originWidth;

  if (!resizeWidth || !resizeHeight) {
    return [wRatio, hRatio];
  }

  if (resizeWidth && resizeHeight) {
    const newWidth = wRatio * resizeHeight;
    const newHeight = hRatio * newWidth;

    // 너비가 브라우저를 벗어나는 상황에선 너비에 맞춰 높이 비율을 맞춤
    if (newWidth > window.innerWidth) {
      const newHeight = hRatio * resizeWidth;
      const newWidth = wRatio * newHeight;
      return [newWidth, newHeight];
    }

    return [newWidth, newHeight];
  }

  return [wRatio, hRatio];
};
