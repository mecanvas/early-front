import { faArrowLeft, faArrowRight, faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import { FrameAttributes, FrameSize } from 'src/interfaces/ToolInterface';
import { FrameWrapper, FrameSizeList, FrameSizeName } from './ToolStyle';

interface Props extends FrameAttributes {
  frameSize: FrameSize[];
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onChangeVertical: () => void;
}

const ToolFrame = ({ frameSize, attribute, onClick, onChangeVertical }: Props) => {
  const frameList = useMemo(() => {
    return frameSize.filter((lst) => lst.attribute === attribute);
  }, [attribute, frameSize]);

  const [isFold, setIsFold] = useState(false);

  const handleFoldFrameList = useCallback(() => {
    setIsFold((prev) => !prev);
  }, []);

  const [frameRendering, api] = useSpring(() => ({
    to: { translateX: 0 },
    from: { translateX: 200 },
    config: { duration: 400 },
  }));

  useEffect(() => {
    api.update({ from: { translateX: 200 }, to: { translateX: 0 } });
    api.start();
  }, [attribute, api]);

  useEffect(() => {
    if (isFold) {
      api.update({ from: { translateX: 0 }, to: { translateX: 200 } });
      api.start();
    } else {
      api.update({ from: { translateX: 200 }, to: { translateX: 0 } });
      api.start();
    }
  }, [api, isFold]);

  return (
    <FrameWrapper>
      <span onClick={handleFoldFrameList}>
        <FontAwesomeIcon icon={!isFold ? faArrowRight : faArrowLeft} />
      </span>
      <animated.div style={frameRendering}>
        {frameList.map((frame, index) => (
          <div key={index}>
            <FrameSizeList data-value={frame.name} data-attribute={frame.attribute} {...frame.size} onClick={onClick}>
              <FrameSizeName>{frame.name}</FrameSizeName>
            </FrameSizeList>
            <small>{frame.cm}</small>
          </div>
        ))}
        <Button type="dashed" onClick={onChangeVertical}>
          <FontAwesomeIcon icon={faSync} />
        </Button>
      </animated.div>
    </FrameWrapper>
  );
};

export default ToolFrame;
