import moment from 'moment';

export const dateFormat = (date: any, short?: boolean) => {
  if (date === null) {
    return null;
  }

  return moment(date).format(!short ? 'YYYY년 MM월 DD일 HH:mm' : 'YYYY-MM-DD');
};
