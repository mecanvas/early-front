import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    [key: string]: any;
    canvasShadow: string;
    canvasShadowFilter: string;
    size: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    color: {
      white: string;
      gray000: string;
      gray100: string;
      gray200: string;
      gray300: string;
      gray400: string;
      gray500: string;
      gray600: string;
      gray700: string;
      gray800: string;
      gray900: string;
      black: string;

      primary: string;
      secondary: string;
      secondarydark: string;
      secondarybg: string;

      blue: string;
      red: string;
      yellow: string;
      cyan: string;
    };
  }
}
