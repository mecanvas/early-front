import { FrameSize } from 'src/interfaces/ToolInterface';
import { FrameInfoList } from 'src/store/reducers/frame';
import { cmToPx } from 'src/utils/cmToPx';

export const MAX_HEIGHT = 1000;

export const IMAGE_MAXIMUM_WIDTH = 320;
export const IMAGE_MAXIMUM_HEIGHT = 320;
export const CROPPER_LIMIT_SIZE = 30;

//  1_000_000  = 1MB
// 일단 제한 없애기로
export const IMG_LIMIT_MINIMUM_SIZE = process.env.NODE_ENV === 'production' ? 0 : 0;
export const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://api.early21.com'
    : `http://localhost:${process.env.NEXT_PUBLIC_PORT}`;

export const MY_URL = process.env.NODE_ENV === 'production' ? 'https://early21.com' : 'http://localhost:3000';

// 해당하는 routes들은 false를 반환합니다. -> footer를 제외하고 불러옵니다.
export const exceptionRoutes = ['/tool/divided', '/tool/single', '/404', '/success'];

export const S3_URL = 'https://early21-assets.s3.ap-northeast-2.amazonaws.com';

// Tool의 헤더
export const HEADER_HEIGHT = 86;
export const CONTENT_HEIGHT = 'calc(100vh - 168px)';

// App의 헤더 크기
export const APP_HEADER_HEIGHT = 68;

// 벽걸이용 추천 = 2
export const frameRectangleMoreHeightThanWidth: FrameInfoList[] = [
  {
    id: 1,
    type: 2,
    name: 'F-0호',
    widthCm: 14,
    heightCm: 18,
    price: 6900,
    size: {
      width: cmToPx(14),
      height: cmToPx(18),
    },
    recommand: false,
  },

  {
    id: 2,
    type: 2,
    name: 'F-2호',
    widthCm: 17.9,
    heightCm: 25.8,
    price: 12800,
    size: {
      width: cmToPx(17.9),
      height: cmToPx(25.8),
    },
    recommand: true,
  },

  {
    id: 3,
    type: 2,
    name: 'F-4호',
    widthCm: 24.2,
    heightCm: 33.4,
    price: 16700,
    size: {
      width: cmToPx(24.2),
      height: cmToPx(33.4),
    },
    recommand: false,
  },
  {
    id: 4,
    type: 2,
    name: 'P-4호',
    widthCm: 21.2,
    heightCm: 33.4,
    price: 16700,
    size: {
      width: cmToPx(21.2),
      height: cmToPx(33.4),
    },
    recommand: false,
  },
];

// 탁자용 = 1
export const frameSquare: FrameInfoList[] = [
  {
    id: 1,
    type: 1,
    name: 'S-0호',
    widthCm: 14,
    heightCm: 14,
    price: 6900,
    size: {
      width: cmToPx(14),
      height: cmToPx(14),
    },
    recommand: false,
  },
  {
    id: 2,
    type: 1,
    name: 'S-1호',
    widthCm: 15.8,
    heightCm: 15.8,
    price: 10800,
    size: {
      width: cmToPx(15.8),
      height: cmToPx(15.8),
    },
    recommand: false,
  },
  {
    id: 3,
    type: 1,
    name: 'S-2호',
    widthCm: 17.9,
    heightCm: 17.9,
    price: 12800,
    size: {
      width: cmToPx(17.9),
      height: cmToPx(17.9),
    },
    recommand: false,
  },
  {
    id: 4,
    type: 1,
    name: 'S-4호',
    widthCm: 24.2,
    heightCm: 24.2,
    price: 16700,
    size: {
      width: cmToPx(24.2),
      height: cmToPx(24.2),
    },
    recommand: true,
  },
];

export const frameSize = (changeVertical?: boolean): FrameSize[] => [
  {
    name: 'S-1호',
    attribute: '정방',
    cm: '15.8cm X 15.8cm',
    size: {
      width: `${cmToPx(15.8)}px`,
      height: `${cmToPx(15.8)}px`,
    },
    price: 10800,
  },
  {
    name: 'S-2호',
    attribute: '정방',
    cm: '17.9cm X 17.9cm',
    size: {
      width: `${cmToPx(17.9)}px`,
      height: `${cmToPx(17.9)}px`,
    },
    price: 12800,
  },
  {
    name: 'S-4호',
    attribute: '정방',
    cm: '24.2cm X 24.2cm',
    size: {
      width: `${cmToPx(24.2)}px`,
      height: `${cmToPx(24.2)}px`,
    },
    price: 16700,
  },
  {
    name: 'P-2호',
    attribute: '풍경',
    cm: !changeVertical ? '16cm X 25.8cm' : '25.8cm X 16cm',
    size: {
      width: `${cmToPx(!changeVertical ? 16 : 25.8)}px`,
      height: `${cmToPx(!changeVertical ? 25.8 : 16)}px`,
    },
    price: 12800,
  },
  {
    name: 'P-4호',
    attribute: '풍경',
    cm: !changeVertical ? '21.2cm X 33.4cm' : '33.4cm X 21.2cm',
    size: {
      width: `${cmToPx(!changeVertical ? 21.2 : 33.4)}px`,
      height: `${cmToPx(!changeVertical ? 33.4 : 21.2)}px`,
    },
    price: 16700,
  },
  {
    name: 'F-2호',
    attribute: '인물',
    cm: !changeVertical ? '17.9cm X 25.8cm' : '25.8cm X 17.9cm',
    size: {
      width: `${cmToPx(!changeVertical ? 17.9 : 25.8)}px`,
      height: `${cmToPx(!changeVertical ? 25.8 : 17.9)}px`,
    },
    price: 12800,
  },
  {
    name: 'F-4호',
    attribute: '인물',
    cm: !changeVertical ? '24.2cm X 33.4cm' : '33.4cm X 24.2cm',
    size: {
      width: `${cmToPx(!changeVertical ? 24.2 : 33.4)}px`,
      height: `${cmToPx(!changeVertical ? 33.4 : 24.2)}px`,
    },
    price: 16700,
  },
];
