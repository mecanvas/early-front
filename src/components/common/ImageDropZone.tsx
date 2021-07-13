import { PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import { DropEvent, FileRejection, useDropzone } from 'react-dropzone';

const DropZone = styled.div<{ width?: string; height?: string; isDragActive: boolean }>`
  ${({ isDragActive }) =>
    isDragActive
      ? css`
          opacity: 0.9;
          z-index: 999;
        `
      : css`
          opacity: 1;
        `}
  position: absolute;
  background-color: ${({ theme }) => theme.color.gray000};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.gray200};
  width: ${({ width }) => (width ? `${width}` : '300px')};
  height: ${({ height }) => (height ? `${height}` : '300px')};
  margin: 0 auto;
  cursor: pointer;
`;

const DropZoneDiv = styled.div`
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.color.gray000};
  border: 1px solid ${({ theme }) => theme.color.gray200};
  justify-content: center;
  height: 100%;
  h4 {
    margin-top: 6px;
  }

  * > svg {
    font-size: 50px;
    path {
      color: ${({ theme }) => theme.color.primary};
    }
  }
`;

interface Props {
  onDrop: <T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) => void;
  text?: string;
  width?: string;
  height?: string;
  isDragDrop?: boolean;
}

const ImageDropZone = ({ isDragDrop, onDrop, text = '이미지를 드롭 or 첨부하세요!', width, height }: Props) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <DropZone width={width} height={height} {...getRootProps()} isDragActive={isDragActive}>
      <input {...getInputProps()} accept="image/*" />
      {isDragDrop ? (
        <DropZoneDiv>
          <PlusCircleOutlined />
        </DropZoneDiv>
      ) : (
        <DropZoneDiv>
          <PlusOutlined />
          <h4>{text}</h4>
        </DropZoneDiv>
      )}
    </DropZone>
  );
};

export default ImageDropZone;
