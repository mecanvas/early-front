import styled from '@emotion/styled';
import { Alert, Button } from 'antd';
import { icons } from 'public/icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import ImageDropZone from 'src/components/common/ImageDropZone';
import { useAppDispatch, useAppSelector } from 'src/hooks/useRedux';
import { postImageUpload } from 'src/store/api/image';
import { deletePositionByFrame, putSelectedFrameImage } from 'src/store/reducers/frame';
import { imgSizeChecker } from 'src/utils/imgSizeChecker';

const SecondsContent = styled.div`
  display: flex;
  text-align: center;
  flex-direction: column;
  align-items: center;
  padding: 2em 0;
  width: 100%;

  button {
    @media all and (max-width: ${({ theme }) => theme.size.sm}) {
      width: 80px;
      font-size: 11px;
      height: 35px;
    }

    margin-top: 1em;
    font-size: 13px;
    padding: 3px !important;
    width: 120px;

    border: 1px solid ${({ theme }) => theme.color.gray700};

    &:hover {
      opacity: 0.8;
    }

    &:focus {
      background-color: ${({ theme }) => theme.color.white};
      border: 1px solid ${({ theme }) => theme.color.gray700};
    }
  }
`;

const SecondsContentDropZoneText = styled.div`
  display: flex;
  flex-direction: column;

  small {
    line-height: 22px;
    font-weight: 500;
    color: ${({ theme }) => theme.color.gray700};
  }
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    small {
      font-size: 11px;
    }
  }
`;

const SecondsImageDropZoneWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5em;

  h6 {
    margin-top: 0.4em;
    small {
      margin-left: 1em;
    }
  }
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const ImgRotateIcon = styled.div`
  cursor: pointer;
  margin-bottom: 0.6em;
  img + img {
    margin-left: 0.6em;
  }
  img {
    width: 22px;
    &:nth-of-type(2) {
      transform: scale(-1, 1);
    }
  }
`;

const ImageWrapper = styled.div`
  img {
    max-width: 400px;
  }
`;

const SecondsStep = () => {
  const { selectedFrame } = useAppSelector(({ frame }) => frame);
  const dispatch = useAppDispatch();
  const imgRef = useRef<HTMLImageElement>(null);
  const [rotateCount, setRotateCount] = useState(0);
  const [rotateType, setRotateType] = useState(0);

  const handleRotate = useCallback((e) => {
    const { type } = e.currentTarget.dataset;
    // type === 1 ? 오른쪽 : 왼쪽
    const count = +type === 1 ? 1 : -1;
    setRotateType(+type);
    setRotateCount((prev) => {
      if (prev === 3) {
        // 양수면
        if (count > 0) {
          return 0;
        }
      }
      if (prev === -3) {
        // 음수면
        if (count < 0) {
          return 0;
        }
      }
      return prev + count;
    });
  }, []);

  const createImgCanvas = useCallback(async () => {
    const img = imgRef.current;
    const imgCanvas = document.createElement('canvas');
    if (!img) return;
    const { width, height } = img.getBoundingClientRect();

    // const [width, height] = getOriginRatio(naturalWidth, naturalHeight, 500, 500);

    const angle = ((rotateType === 1 ? 90 : -90) * Math.PI) / 180;
    imgCanvas.width = width;
    imgCanvas.height = height;
    const iCtx = imgCanvas.getContext('2d');
    if (!iCtx) return;
    iCtx.clearRect(0, 0, width, height);
    iCtx.save();
    iCtx.imageSmoothingQuality = 'high';
    iCtx.translate(width / 2, height / 2);
    iCtx.rotate(angle);
    iCtx.drawImage(img, -width / 2, -height / 2);

    iCtx.restore();
    const imgUrl = await imgCanvas.toDataURL('image/png', 1.0);
    dispatch(putSelectedFrameImage({ type: selectedFrame[0].type, id: selectedFrame[0].id, imgUrl }));
  }, [dispatch, selectedFrame, rotateType]);

  const handleButtonUpload = useCallback(
    (e) => {
      const { id, type } = e.currentTarget.dataset;

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.click();

      input.oninput = () => {
        if (!input.files) return;
        const file = input.files[0];
        if (!imgSizeChecker(file)) return Alert({ message: '최소 1MB 이상의 이미지이어야 합니다.' });
        const fd = new FormData();
        fd.append('image', file);
        dispatch(postImageUpload({ fd, type: +type as 1 | 2 | 3, id: +id }));
        if (selectedFrame[0].imgUrl) {
          dispatch(deletePositionByFrame());
        }
      };
    },
    [dispatch, selectedFrame],
  );

  const handleDropImage = useCallback(
    (acceptedFiles: any, reject, e) => {
      const { id, type } = e.target.dataset;
      if (!acceptedFiles[0].type.includes('image')) {
        return Alert({ message: '이미지 파일이 아닌건 지원하지 않습니다.' });
      }
      if (!imgSizeChecker(acceptedFiles[0])) return Alert({ message: '최소 1MB 이상의 이미지이어야 합니다.' });
      const file = acceptedFiles[0];
      const fd = new FormData();
      fd.append('image', file);
      dispatch(postImageUpload({ fd, type: +type as 1 | 2 | 3, id: +id }));
      if (selectedFrame[0].imgUrl) {
        dispatch(deletePositionByFrame());
      }
    },
    [dispatch, selectedFrame],
  );

  const { getInputProps, getRootProps } = useDropzone({ onDrop: handleDropImage });

  useEffect(() => {
    createImgCanvas();
  }, [rotateCount]);

  return (
    <>
      <SecondsContent>
        {/* 선택한 액자가 하나 뿐이면 */}
        <>
          {selectedFrame.length && selectedFrame.length === 1 ? (
            selectedFrame[0].imgUrl ? (
              <>
                <ImgRotateIcon>
                  <img src={icons.rotate} onClick={handleRotate} data-type={2} />
                  <img src={icons.rotate} onClick={handleRotate} data-type={1} />
                </ImgRotateIcon>
                <ImageWrapper>
                  <img src={selectedFrame[0].imgUrl} ref={imgRef} crossOrigin="anonymous" />
                </ImageWrapper>
                <Button type="text" {...getRootProps()} data-id={selectedFrame[0].id} data-type={selectedFrame[0].type}>
                  변경
                  <input
                    {...getInputProps()}
                    accept="image/*"
                    data-id={selectedFrame[0].id}
                    data-type={selectedFrame[0].type}
                  />
                </Button>
              </>
            ) : (
              <>
                <div>
                  <h4>이미지를 업로드해 주세요.</h4>
                  <p>해상도가 높을수록 퀄리티 있는 작품을 받아 보실 수 있어요.</p>
                </div>
                <ImageDropZone
                  dataId={selectedFrame[0].id}
                  dataType={selectedFrame[0].type}
                  onDrop={handleDropImage}
                  text={
                    <SecondsContentDropZoneText>
                      <small>jpg, png, webp, svg 등 이미지 확장자</small>
                      <small> 최소 1MB 이상</small>
                    </SecondsContentDropZoneText>
                  }
                />
              </>
            )
          ) : (
            // 액자 다중 선택시
            <SecondsImageDropZoneWrapper>
              {selectedFrame.map((lst) =>
                lst.imgUrl ? (
                  <div>
                    <h6>
                      {lst.name}
                      <small>
                        {lst.widthCm}cm X {lst.heightCm}cm
                      </small>
                    </h6>

                    <ImageWrapper>
                      <img src={lst.imgUrl} />
                    </ImageWrapper>
                    <div>
                      <Button type="text" data-id={lst.id} data-type={lst.type} onClick={handleButtonUpload}>
                        변경
                      </Button>
                    </div>
                  </div>
                ) : (
                  <ImageDropZone
                    dataId={lst.id}
                    dataType={lst.type}
                    onDrop={handleDropImage}
                    text={
                      <SecondsContentDropZoneText>
                        <h6>{lst.name}</h6>
                        <small>
                          {lst.widthCm}cm X {lst.heightCm}cm
                        </small>
                      </SecondsContentDropZoneText>
                    }
                  />
                ),
              )}
            </SecondsImageDropZoneWrapper>
          )}
        </>
      </SecondsContent>
    </>
  );
};

export default SecondsStep;
