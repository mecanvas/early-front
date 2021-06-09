import React, { useEffect, useMemo } from 'react';
import { animated, useSpring } from 'react-spring';
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

  const [frameRendering, api] = useSpring(() => ({
    to: { translateX: 0 },
    from: { translateX: 100 },
    config: { duration: 400 },
  }));

  useEffect(() => {
    api.update({ from: { translateX: 100 }, to: { translateX: 0 } });
    api.start();
  }, [attribute, api]);

  return (
    <FrameWrapper>
      <animated.div style={frameRendering}>
        {frameList.map((frame, index) => (
          <div key={index}>
            <FrameSizeList data-value={frame.name} data-attribute={frame.attribute} {...frame.size} onClick={onClick}>
              <FrameSizeName>{frame.name}</FrameSizeName>
            </FrameSizeList>
            <small>{frame.cm}</small>
          </div>
        ))}
      </animated.div>
    </FrameWrapper>
  );
};

export default ToolFrame;
