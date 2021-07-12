import { PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import { DropEvent, FileRejection, useDropzone } from 'react-dropzone';

const DropZone = styled.div<{ width?: number; height?: number }>`
  border: 1px solid ${({ theme }) => theme.color.gray200};
  width: ${({ width }) => (width ? `${width}px` : '300px')};
  height: ${({ height }) => (height ? `${height}px` : '300px')};
  margin: 0 auto;
  cursor: pointer;
`;

const DropZoneDiv = styled.div<{ isDragActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border: 1px solid ${({ theme }) => theme.color.gray200};
  justify-content: center;
  height: 100%;
  p {
    margin-top: 6px;
  }
  &:hover {
    opacity: 0.4;
  }
  ${({ isDragActive }) =>
    isDragActive
      ? css`
          opacity: 0.4;
        `
      : css`
          opacity: 1;
        `}
  *  > svg {
    font-size: 50px;
    path {
      color: ${({ theme }) => theme.color.primary};
    }
  }
`;

interface Props {
  onDrop: <T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) => void;
  text: string;
  width?: number;
  height?: number;
}

const ImageDrop = ({ onDrop, text = '이미지를 드롭하거나 첨부하세요!', width, height }: Props) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <DropZone width={width} height={height} {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />
      <DropZoneDiv isDragActive={isDragActive}>
        <PlusOutlined />
        <p>{text}</p>
      </DropZoneDiv>
    </DropZone>
  );
};

export default ImageDrop;
