import styled from '@emotion/styled';
import { Button } from 'antd';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import ImageDropZone from 'src/components/common/ImageDropZone';
import Loading from 'src/components/common/Loading';
import { useAppDispatch, useAppSelector } from 'src/hooks/useRedux';
import { postImageUpload } from 'src/store/api/image';
import { imgSizeChecker } from 'src/utils/imgSizeChecker';

const SecondsContent = styled.div`
  display: flex;
  text-align: center;
  flex-direction: column;
  align-items: center;
  padding: 2em 0;
  width: 100%;

  p {
    button {
      font-size: 13px;
      padding: 3px !important;
      width: 150px;
      border: 1px solid ${({ theme }) => theme.color.gray700};

      &:hover {
        opacity: 0.8;
      }

      &:focus {
        background-color: ${({ theme }) => theme.color.white};
        border: 1px solid ${({ theme }) => theme.color.gray700};
      }
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
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
const ImageWrapper = styled.div`
  max-height: 500px;

  img {
    width: 100%;
    height: 500px;
  }
`;

const SecondsStep = () => {
  const { imageUploadLoad } = useAppSelector(({ image }) => image);
  const { selectedFrame } = useAppSelector(({ frame }) => frame);
  const dispatch = useAppDispatch();

  const handleDropImage = useCallback(
    (acceptedFiles: any, reject, e) => {
      const { id, type } = e.target.dataset;
      if (!acceptedFiles[0].type.includes('image')) {
        return alert('이미지 파일이 아닌건 지원하지 않습니다.');
      }
      if (!imgSizeChecker(acceptedFiles[0])) return;

      const file = acceptedFiles[0];
      const fd = new FormData();
      fd.append('image', file);
      dispatch(postImageUpload({ fd, type: type === '1' ? 1 : 2, id: +id }));
    },
    [dispatch],
  );

  const { getInputProps, getRootProps } = useDropzone({ onDrop: handleDropImage });

  return (
    <>
      <Loading loading={imageUploadLoad} />
      <SecondsContent>
        {/* 선택한 액자가 하나 뿐이면 */}
        <>
          {selectedFrame.length && selectedFrame.length === 1 ? (
            selectedFrame[0].imgUrl ? (
              <>
                <div>
                  <h4>이미지가 맞으신가요?</h4>
                  <p>
                    <Button
                      type="text"
                      {...getRootProps()}
                      data-id={selectedFrame[0].id}
                      data-type={selectedFrame[0].type}
                    >
                      재업로드
                      <input
                        {...getInputProps()}
                        accept="image/*"
                        data-id={selectedFrame[0].id}
                        data-type={selectedFrame[0].type}
                      />
                    </Button>
                  </p>
                </div>
                <ImageWrapper>
                  <img src={selectedFrame[0].imgUrl} />
                </ImageWrapper>
              </>
            ) : (
              // 액자 다중 선택시
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
            <SecondsImageDropZoneWrapper>
              {selectedFrame.map((lst) =>
                lst.imgUrl ? (
                  <div>d</div>
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
