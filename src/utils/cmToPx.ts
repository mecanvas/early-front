export const cmToPx = (cm: number, ratio: number) => {
  const px = 37.7952755906;
  return (cm * px) / ratio;
};
