import { FrameSize } from 'src/interfaces/ToolInterface';
import { cmToPx } from 'src/utils/cmToPx';

export const MAX_HEIGHT = 1000;

//  1_000_000  = 1MB
export const IMG_LIMIT_MINIMUM_SIZE = process.env.NODE_ENV === 'production' ? 500_000 : 0;
export const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://mecanvas.herokuapp.com'
    : `http://localhost:${process.env.NEXT_PUBLIC_PORT}`;

export const URL = process.env.NODE_ENV === 'production' ? 'https://early.com' : 'http://localhost:3000';

// 해당하는 routes들은 false를 반환합니다. -> footer를 제외하고 불러옵니다.
export const exceptionRoutes = ['/tool/divided', '/tool/single', '/404'];

export const S3_URL = 'https://mecanvas-assets.s3.ap-northeast-2.amazonaws.com/assets';

export const HEADER_HEIGHT = 86;

export const frameSize = (changeVertical?: boolean): FrameSize[] => [
  {
    name: 'S-1호',
    attribute: '정방',
    cm: '16cm X 16cm',
    size: {
      width: `${cmToPx(16)}px`,
      height: `${cmToPx(16)}px`,
    },
    price: 55000,
  },
  {
    name: 'S-2호',
    attribute: '정방',
    cm: '19cm X 19cm',
    size: {
      width: `${cmToPx(19)}px`,
      height: `${cmToPx(19)}px`,
    },
    price: 40000,
  },
  {
    name: 'S-4호',
    attribute: '정방',
    cm: '24cm X 24cm',
    size: {
      width: `${cmToPx(24)}px`,
      height: `${cmToPx(24)}px`,
    },
    price: 30000,
  },
  {
    name: 'P-2호',
    attribute: '풍경',
    cm: !changeVertical ? '16cm X 25.8cm' : '25.8cm X 16cm',
    size: {
      width: `${cmToPx(!changeVertical ? 16 : 25.8)}px`,
      height: `${cmToPx(!changeVertical ? 25.8 : 16)}px`,
    },
    price: 30000,
  },
  {
    name: 'P-4호',
    attribute: '풍경',
    cm: !changeVertical ? '21.2cm X 33.3cm' : '33.3cm X 21.2cm',
    size: {
      width: `${cmToPx(!changeVertical ? 21.2 : 33.3)}px`,
      height: `${cmToPx(!changeVertical ? 33.3 : 21.2)}px`,
    },
    price: 30000,
  },
  {
    name: 'F-2호',
    attribute: '인물',
    cm: !changeVertical ? '18cm X 25.8cm' : '25.8cm X 18cm',
    size: {
      width: `${cmToPx(!changeVertical ? 18 : 25.8)}px`,
      height: `${cmToPx(!changeVertical ? 25.8 : 18)}px`,
    },
    price: 40000,
  },
  {
    name: 'F-4호',
    attribute: '인물',
    cm: !changeVertical ? '24cm X 33.3cm' : '33.3cm X 24cm',
    size: {
      width: `${cmToPx(!changeVertical ? 24 : 33.3)}px`,
      height: `${cmToPx(!changeVertical ? 33.3 : 24)}px`,
    },
    price: 40000,
  },
  {
    name: 'M-4호',
    attribute: '해경',
    cm: !changeVertical ? '19cm X 33.3cm' : '33.3cm X 19cm',
    size: {
      width: `${cmToPx(!changeVertical ? 19 : 33.3)}px`,
      height: `${cmToPx(!changeVertical ? 33.3 : 19)}px`,
    },
    price: 30000,
  },
];
