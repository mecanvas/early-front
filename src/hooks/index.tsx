import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { notification } from 'antd';

export const useGetCursorPosition = (isSelected: boolean) => {
  const [windowX, setWindowX] = useState(0);
  const [windowY, setWindowY] = useState(0);

  const handleGetCursorPosition = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e;
    setWindowX(clientX);
    setWindowY(clientY);
  }, []);

  useEffect(() => {
    if (!isSelected) return;
    if (window) {
      document.addEventListener('mousemove', handleGetCursorPosition);
    }
    return () => document.removeEventListener('mousemove', handleGetCursorPosition);
  }, [isSelected, handleGetCursorPosition]);

  return [windowX, windowY];
};

export const useGetScollPosition = () => {
  const [scrollX, setScrollX] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  const handleGetScrollPosition = useCallback(() => {
    setScrollX(window.scrollX);
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    if (window) {
      document.addEventListener('scroll', handleGetScrollPosition);
    }
    return () => {
      document.addEventListener('scroll', handleGetScrollPosition);
    };
  }, [handleGetScrollPosition]);

  return [scrollX, scrollY];
};

// 전역변수를 swr을 이용해 사용합니다.
export const useGlobalState = <T,>(key: string, defaultValue?: T | null) => {
  const { data: state = defaultValue, mutate } = useSWR(key, null, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
  });

  const setState = useCallback((value: any) => mutate(value, false), [mutate]);

  return [state, setState];
};

export const useCanvasToServer = () => {
  const dataURLtoFile = (dataurl: any, filename: any) => {
    if (dataurl) {
      const arr = dataurl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = window.atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {
        type: mime,
      });
    }
  };
  const [loading, setLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const canvasToImage = (canvas: HTMLCanvasElement[], name: string) => {
    if (!window) return;
    if (!canvas.length) return notification.error({ message: '액자를 만들어주세요.', placement: 'bottomLeft' });

    const sendToCanvas = async () => {
      setLoading(true);
      await canvas.forEach(async (node, index) => {
        const dataUrl = (node as HTMLCanvasElement).toDataURL('image/png', 1.0);
        const { dataset } = node;
        const file = dataURLtoFile(
          dataUrl,
          `${new Date().toLocaleDateString()}_${name}_${dataset.paper}_${index + 1}.png`,
        );
        if (file) {
          const fd = new FormData();
          fd.append('image', file);
          await axios.post('/canvas', fd);
        }
      });
      setLoading(false);
      setIsDone(true);
    };

    sendToCanvas();
  };

  return { canvasToImage, loading, isDone };
};
