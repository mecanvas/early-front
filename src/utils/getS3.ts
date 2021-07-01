import { S3_URL } from 'src/constants';

export const getS3 = (imgName: string) => `${S3_URL}/${imgName}`;
