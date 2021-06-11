export const getOriginRatio = (width: number, height: number) => {
  const wRatio = width / height;
  const hRatio = height / width;

  return [wRatio, hRatio];
};
