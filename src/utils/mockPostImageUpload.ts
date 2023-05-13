function timeout(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export interface MockProgressEvent {
  loaded: number;
  total: number;
}
type ProgressHandle = (data: MockProgressEvent) => void;

export function mockPostImageUpload(
  file: File,
  onUploadProgress: ProgressHandle,
  onDownloadProgress?: ProgressHandle,
): Promise<string> {
  const reader = new FileReader();

  const total = onDownloadProgress ? 200 : 100;

  return new Promise((resolve, reject) => {
    timeout(150).then(async () => {
      await timeout(100);
      onUploadProgress({ loaded: 25, total });
      await timeout(100);
      onUploadProgress({ loaded: 50, total });
      await timeout(100);
      onUploadProgress({ loaded: 75, total });
      await timeout(100);
      onUploadProgress({ loaded: 100, total });

      reader.readAsDataURL(file);

      reader.onload = async () => {
        if (onDownloadProgress) {
          await timeout(100);
          onDownloadProgress({ loaded: 125, total });
          await timeout(100);
          onDownloadProgress({ loaded: 150, total });
          await timeout(100);
          onDownloadProgress({ loaded: 175, total });
          await timeout(100);
          onDownloadProgress({ loaded: 200, total });
        }

        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject({
          message: '파일 읽기 실패',
        });
      };
    });
  });
}
