import React, { useCallback, useState } from 'react';
import { ColorPaletteWrapper } from './ToolStyle';
import { CirclePicker, ColorResult, ChromePicker } from 'react-color';

interface Props {
  onChange: (color: ColorResult) => void;
  type: 'bg' | 'frame';
}

const ToolColorPalette = ({ onChange, type }: Props) => {
  const [isFreeColorPalette, setIsFreeColorPalette] = useState(false);
  const [yourPickHex, setYourPickHex] = useState('#ffffff');

  const colors = {
    bg: ['#ffffff', '#333', '#D9E3F0', '#F47373', '#697689'],
    frame: ['#333', '#dbdbdb', '#F47373'],
  };

  const handleFreeColor = useCallback(() => {
    setIsFreeColorPalette((prev) => !prev);
  }, []);

  const handlePickerChange = useCallback((color: ColorResult) => {
    setYourPickHex(color.hex);
  }, []);

  return (
    <>
      <ColorPaletteWrapper>
        {isFreeColorPalette ? (
          <ChromePicker
            color={yourPickHex}
            onChange={handlePickerChange}
            onChangeComplete={onChange}
            disableAlpha={true}
          />
        ) : null}
        <CirclePicker onChange={onChange} colors={colors[type]} circleSpacing={7} />
      </ColorPaletteWrapper>
      <div onClick={handleFreeColor}>난 다른거..</div>
    </>
  );
};

export default ToolColorPalette;
