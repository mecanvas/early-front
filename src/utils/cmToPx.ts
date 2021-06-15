import { isMobile } from 'react-device-detect';

export const cmToPx = (cm: number) => {
  const px = 37.7952755906;
  if (isMobile) {
    return (cm * px) / 4;
  }
  return (cm * px) / 3;
};
