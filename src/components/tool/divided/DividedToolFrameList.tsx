import { faArrowLeft, faArrowRight, faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import { useGlobalState } from 'src/hooks';
import { FrameAttributes, FrameSize } from 'src/interfaces/ToolInterface';
import { FrameWrapper, FrameSizeList, FrameSizeName } from './DividedToolStyle';

interface Props extends FrameAttributes {
  frameSize: FrameSize[];
  clickedValue: string;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onChangeVertical: () => void;
}

const ToolFrame = ({ frameSize, attribute, clickedValue, onClick, onChangeVertical }: Props) => {
  const frameList = useMemo(() => {
    return frameSize.filter((lst) => lst.attribute === attribute);
  }, [attribute, frameSize]);

  const [isFold, setIsFold] = useState(false);
  const [isPreview] = useGlobalState('isPreview');
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

  useEffect(() => {
    if (isPreview) {
      api.update({ from: { translateX: 0 }, to: { translateX: 200 } });
      api.start();
    } else {
      api.update({ from: { translateX: 200 }, to: { translateX: 0 } });
      api.start();
    }
  }, [api, isPreview]);

  return (
    <FrameWrapper>
      <span onClick={handleFoldFrameList}>
        <FontAwesomeIcon icon={!isFold ? faArrowRight : faArrowLeft} />
      </span>
      <animated.div style={frameRendering}>
        {frameList.map((frame, index) => (
          <div key={index}>
            <FrameSizeList
              clicked={frame.name === clickedValue}
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
        {attribute === '정방' || (
          <Button type="dashed" onClick={onChangeVertical}>
            <FontAwesomeIcon icon={faSync} />
          </Button>
        )}
      </animated.div>
    </FrameWrapper>
  );
};

export default ToolFrame;
