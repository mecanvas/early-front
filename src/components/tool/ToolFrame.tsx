import React, { useMemo } from 'react';
import { FrameAttributes, FrameSize } from 'src/interfaces/ToolInterface';
import { FrameWrapper, FrameSizeList, FrameSizeName } from './ToolStyle';

interface Props extends FrameAttributes {
  frameSize: FrameSize[];
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const ToolFrame = ({ frameSize, attribute, onClick }: Props) => {
  const frameList = useMemo(() => {
    return frameSize.filter((lst) => lst.attribute === attribute);
  }, [attribute, frameSize]);

  return (
    <FrameWrapper>
      {frameList.map((frame, index) => (
        <div>
          <FrameSizeList
            key={index}
            data-value={frame.name}
            data-attribute={frame.attribute}
            {...frame.size}
            onClick={onClick}
          >
            <FrameSizeName>{frame.name}</FrameSizeName>
          </FrameSizeList>
          <small>{frame.cm}</small>
        </div>
      ))}
    </FrameWrapper>
  );
};

export default ToolFrame;
