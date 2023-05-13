import { mockPostImageUpload } from './mockPostImageUpload';

export async function mockPostCanvasSave(files: File[]) {
  let i = 0;
  for (const file of files) {
    const url = await mockPostImageUpload(file, () => ({}));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'file - ' + i++;
    link.click();
  }

  return Promise.resolve();
}
