import React from 'react';
import { ColorPaletteWrapper } from './ToolStyle';
import { CirclePicker, ColorResult } from 'react-color';

interface Props {
  handleColorChange: (color: ColorResult) => void;
}

const ToolColorPalette = ({ handleColorChange }: Props) => {
  return (
    <ColorPaletteWrapper>
      <CirclePicker
        onChange={handleColorChange}
        colors={['#ffffff', '#333', '#D9E3F0', '#F47373', '#697689']}
        circleSpacing={7}
      />
    </ColorPaletteWrapper>
  );
};

export default ToolColorPalette;
