import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { icons } from 'public/icons';
import React from 'react';
import { DropEvent, FileRejection, useDropzone } from 'react-dropzone';

const DropZone = styled.div<{ width?: string; height?: string; isDragActive: boolean }>`
  ${({ isDragActive }) =>
    isDragActive
      ? css`
          opacity: 0.6;
          z-index: 999;
        `
      : css`
          opacity: 1;
          z-index: 16;
        `}
  max-width: 1000px;
  background-color: ${({ theme }) => theme.color.gray000};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.gray200};
  width: ${({ width }) => (width ? `${width}` : '302px')};
  height: ${({ height }) => (height ? `${height}` : '302px')};
  margin: 0 auto;
  cursor: pointer;
`;

const DropZoneDiv = styled.div`
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.gray200};
  justify-content: center;
  height: 100%;
  p {
    margin-top: 6px;
    font-size: 17px;
    font-weight: 500;
  }

  img {
    width: 60px;
  }
`;

interface Props {
  onDrop: <T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) => void;
  text?: string | React.ReactNode;
  width?: string;
  height?: string;
  isDragDrop?: boolean;
  dataId?: number;
  dataType?: number;
}

const ImageDropZone = ({
  isDragDrop,
  onDrop,
  text = '이미지를 첨부하세요',
  width,
  height,
  dataId,
  dataType,
}: Props) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <DropZone
      data-id={dataId}
      data-type={dataType}
      width={width}
      height={height}
      {...getRootProps()}
      isDragActive={isDragActive}
    >
      <input data-id={dataId} data-type={dataType} {...getInputProps()} accept="image/*" />
      {isDragDrop ? (
        <DropZoneDiv data-id={dataId} data-type={dataType}>
          <img src={icons.add} />
        </DropZoneDiv>
      ) : (
        <DropZoneDiv data-id={dataId} data-type={dataType}>
          <img src={icons.add} />
          <p>{text}</p>
        </DropZoneDiv>
      )}
    </DropZone>
  );
};

export default ImageDropZone;
