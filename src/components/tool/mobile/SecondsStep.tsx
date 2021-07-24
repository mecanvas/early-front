import styled from '@emotion/styled';
import React, { useCallback } from 'react';
import ImageDropZone from 'src/components/common/ImageDropZone';
import { useAppDispatch, useAppSelector } from 'src/hooks/useRedux';
import { postImageUpload } from 'src/store/api/image';
import { imgSizeChecker } from 'src/utils/imgSizeChecker';

const FirstContent = styled.div`
  display: flex;
  text-align: center;
  flex-direction: column;
  align-items: center;
  padding: 2em 0;
  width: 100%;
`;

const FirstContentDropZoneText = styled.div`
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

const SecondsStep = () => {
  const { imageUrl, imageUploadDone, imageUploadLoad } = useAppSelector(({ image }) => image);
  const { selectedFrame } = useAppSelector(({ frame }) => frame);
  const dispatch = useAppDispatch();

  const handleDropImage = useCallback(
    (acceptedFiles: any) => {
      if (!acceptedFiles[0].type.includes('image')) {
        return alert('이미지 파일이 아닌건 지원하지 않습니다.');
      }
      if (!imgSizeChecker(acceptedFiles[0])) return;

      const file = acceptedFiles[0];
      const fd = new FormData();
      fd.append('image', file);
      const id = new Date().getTime();
      dispatch(postImageUpload({ fd, type: 'single', id }));
    },
    [dispatch],
  );

  return (
    <FirstContent>
      {/* 선택한 액자가 하나 뿐이면 */}
      {selectedFrame.length && selectedFrame.length === 1 ? (
        <>
          <div>
            <h4>이미지를 업로드해 주세요.</h4>
            <p>해상도가 높을수록 퀄리티 있는 작품을 받아 보실 수 있어요.</p>
          </div>
          <ImageDropZone
            onDrop={handleDropImage}
            text={
              <FirstContentDropZoneText>
                <small>jpg, png, webp, svg 등 이미지 확장자</small>
                <small> 최소 1MB 이상</small>
              </FirstContentDropZoneText>
            }
          />
        </>
      ) : (
        <div>다중 선택의 경우</div>
      )}
    </FirstContent>
  );
};

export default SecondsStep;
