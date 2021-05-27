import React from 'react';
import { ColorPalette, ColorPaletteWrapper } from './ToolStyle';

const ToolColorPalette = () => {
  return (
    <ColorPaletteWrapper>
      <ColorPalette />
      <ColorPalette color="blue" />
      <ColorPalette color="green" />
      <ColorPalette color="yellow" />
    </ColorPaletteWrapper>
  );
};

export default ToolColorPalette;
