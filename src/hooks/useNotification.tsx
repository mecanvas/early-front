import { notification } from 'antd';
import { useCallback } from 'react';

export const useNotification = () => {
  const checkNotification = useCallback((valid: 'success' | 'error', message?: string) => {
    if (valid === 'success') {
      return notification.success({
        message: message || '저장되었습니다.',
        duration: 1.2,
        className: 'notification-success',
        placement: 'bottomRight',
      });
    }
    if (valid === 'error') {
      return notification.error({
        message: message || '주소를 모두 입력하세요.',
        duration: 1.2,
        className: 'notification-error',
        placement: 'bottomRight',
      });
    }
  }, []);

  return { checkNotification };
};
