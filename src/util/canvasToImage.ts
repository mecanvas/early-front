// 캔버스 시안 저장

import axios from 'axios';

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

export const canvasToImage = (canvas: HTMLCanvasElement[]) => {
  if (!window) return;
  canvas.forEach((node, index) => {
    const dataUrl = (node as HTMLCanvasElement).toDataURL('image/png', 1.0);
    const file = dataURLtoFile(dataUrl, `김창회_${new Date().toLocaleDateString()}_${index}.png`);
    if (file) {
      const fd = new FormData();
      fd.append('image', file);
      (async () => await axios.post('/post/sample', fd).then(() => alert('저장되썽')))();
    }
  });
};
