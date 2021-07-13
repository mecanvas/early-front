import React, { useEffect } from 'react';
import { animated, useSpring } from 'react-spring';

export const useOpacity = (imgUrl: string) => {
  const [opacityAnimation, api] = useSpring(() => ({
    from: { opacity: 0, translateY: `15px` },
    to: { opacity: 1, translateY: `0px` },
    config: { duration: 600 },
  }));

  useEffect(() => {
    if (imgUrl) {
      api.update({
        from: { opacity: 0, translateY: `15px` },
        to: { opacity: 1, translateY: `0px` },
        config: { duration: 400 },
      });
      api.start();
    }
  }, [imgUrl, api]);

  const OpacityComponent = ({ children }: { children: React.ReactChild }) => {
    return <animated.div style={opacityAnimation}>{children}</animated.div>;
  };

  return { OpacityComponent };
};
