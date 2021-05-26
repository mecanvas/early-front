// 캔버스 시안 저장

export const canvasToImage = (canvas: HTMLCanvasElement[]) => {
  if (!window) return;
  canvas.forEach((node, index) => {
    const dataUrl = (node as HTMLCanvasElement).toDataURL('image/png', 1.0);
    const linkBtn = document.createElement('a');
    linkBtn.download = `${new Date().toLocaleDateString()}_${index}.png`;
    linkBtn.href = dataUrl;
    linkBtn.click();
  });
};
