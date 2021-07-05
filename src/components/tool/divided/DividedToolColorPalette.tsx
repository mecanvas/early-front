import React, { useCallback, useState } from 'react';
import { ColorPaletteFreeColor, ColorPaletteWrapper } from './DividedToolStyle';
import { CirclePicker, ColorResult, ChromePicker } from 'react-color';
import { CaretDownOutlined } from '@ant-design/icons';
import { Popover } from 'antd';

interface Props {
  onChange: (color: ColorResult) => void;
  type: 'bg' | 'frame';
}

const ToolColorPalette = ({ onChange, type }: Props) => {
  const [yourPickHex, setYourPickHex] = useState('#ffffff');

  const colors = {
    bg: ['#ffffff', '#333', '#D9E3F0', '#F47373', '#697689'],
    frame: ['#333', '#dbdbdb', '#F47373'],
  };

  const handlePickerChange = useCallback((color: ColorResult) => {
    setYourPickHex(color.hex);
  }, []);

  return (
    <>
      <ColorPaletteWrapper>
        <CirclePicker onChange={onChange} colors={colors[type]} circleSpacing={4} circleSize={18} />
      </ColorPaletteWrapper>
      <Popover
        trigger="click"
        placement="bottom"
        overlayClassName="antd-popover-no-padding"
        content={
          <ChromePicker color={yourPickHex} onChange={handlePickerChange} onChangeComplete={onChange} disableAlpha />
        }
      >
        <ColorPaletteFreeColor>
          <CaretDownOutlined />
        </ColorPaletteFreeColor>
      </Popover>
    </>
  );
};

export default ToolColorPalette;
