import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useSWR, { SWRResponse } from 'swr';
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
      document.removeEventListener('scroll', handleGetScrollPosition);
    };
  }, [handleGetScrollPosition]);

  return [scrollX, scrollY];
};

// 전역변수를 swr을 이용해 사용합니다.
export const useGlobalState = <T,>(key: string, defaultValue?: T | null) => {
  const { data: state = defaultValue, mutate }: SWRResponse<T | null, any> = useSWR(key, null, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
  });

  const setState = useCallback((value: T) => mutate(value, false), [mutate]);

  return [state, setState] as const;
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
  const [isDone, setIsDone] = useGlobalState('isDone', false);
  const [isSave, setIsSave] = useState(false);
  const [username, setUsername] = useState('');
  const [fileList, setFileList] = useState<File[]>([]);
  const [paperSize, setPaperSize] = useState<string[]>([]);

  const canvasToImage = (canvas: HTMLCanvasElement[], name: string) => {
    if (!window) return;
    if (!canvas.length) return notification.error({ message: '액자를 만들어주세요.', placement: 'bottomLeft' });
    setUsername(name);

    const sendToCanvas = async () => {
      setLoading(true);

      try {
        await canvas.forEach(async (node, index) => {
          const { dataset } = node;
          const w = node.width;
          const h = node.height;
          // canvas 배경변경 https://github.com/mikechambers/ExamplesByMesh/blob/master/HTML5/canvas/exportWithBackgroundColor/scripts/main.js 참고
          if (dataset.bgColor) {
            const ctx = node.getContext('2d');
            if (ctx) {
              ctx.globalCompositeOperation = 'destination-over';
              ctx.fillStyle = dataset.bgColor;
              ctx.fillRect(0, 0, w, h);
            }
          }

          const dataUrl = (node as HTMLCanvasElement).toDataURL('image/png', 1.0);

          if (dataset.bgColor) {
            const ctx = node.getContext('2d');

            if (ctx) {
              const data = ctx.getImageData(0, 0, w, h);
              const compositeOperation = ctx.globalCompositeOperation;
              ctx.clearRect(0, 0, w, h);
              ctx.putImageData(data, 0, 0);
              ctx.globalCompositeOperation = compositeOperation;
            }
          }

          const file = dataURLtoFile(
            dataUrl,
            `${new Date().toLocaleDateString()}_${name}_${dataset.paper}_${index + 1}.png`,
          );

          if (file) {
            setFileList((prev) => {
              return [...prev, file];
            });
            if (dataset.paper) {
              setPaperSize((prev: any) => {
                return [...prev, dataset.paper];
              });
            }
            setIsSave(true);
          }
          setIsDone(true);
        });
      } catch (err) {
        alert('저장에 실패했습니다. 다시 시도해주세요.');
        setIsSave(false);
        setIsDone(false);
      } finally {
        setLoading(false);
      }
    };

    sendToCanvas();
  };

  useEffect(() => {
    if (!isSave) return;
    const saveCanvas = async () => {
      const fd = new FormData();
      fd.append('username', username);
      fd.append('email', 'sample123@gmail.com');
      fileList.forEach((file) => fd.append('image', file));
      fd.append('paper', paperSize.join());
      await axios.post('/canvas', fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    };
    saveCanvas();
  }, [fileList, isSave, paperSize, username]);

  return { canvasToImage, loading, isDone };
};
