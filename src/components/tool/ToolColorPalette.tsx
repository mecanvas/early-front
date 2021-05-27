import React from 'react';
import { ColorPaletteWrapper } from './ToolStyle';
import { CirclePicker, ColorResult } from 'react-color';

interface Props {
  onChange: (color: ColorResult) => void;
  type: 'bg' | 'frame';
}

const ToolColorPalette = ({ onChange, type }: Props) => {
  const colors = {
    bg: ['#ffffff', '#333', '#D9E3F0', '#F47373', '#697689'],
    frame: ['#333', '#dbdbdb', '#F47373'],
  };
  return (
    <ColorPaletteWrapper>
      <CirclePicker onChange={onChange} colors={colors[type]} circleSpacing={7} />
    </ColorPaletteWrapper>
  );
};

export default ToolColorPalette;
