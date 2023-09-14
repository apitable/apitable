import { useMemo } from 'react';
import { useThemeColors } from '@apitable/components';

export const useCssColors = () => {
  const colors = useThemeColors();
  const newColors = useMemo(() => {
    return new Proxy(colors, {
      get: function (target, prop) {
        return `var(--${String(prop)})`;
      },
    });
  }, [colors]);

  return newColors;
};
