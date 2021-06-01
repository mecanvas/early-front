import React, { useCallback, useState } from 'react';
import { ColorPaletteFreeColor, ColorPaletteWrapper } from './ToolStyle';
import { CirclePicker, ColorResult, ChromePicker } from 'react-color';
import { CaretDownOutlined } from '@ant-design/icons';

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
        <CirclePicker onChange={onChange} colors={colors[type]} circleSpacing={4} circleSize={18} />
      </ColorPaletteWrapper>
      <ColorPaletteFreeColor onClick={handleFreeColor}>
        <CaretDownOutlined />
      </ColorPaletteFreeColor>
    </>
  );
};

export default ToolColorPalette;
