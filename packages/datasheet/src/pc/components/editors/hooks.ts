import { useMemo } from 'react';

export function useCellEditorVisibleStyle(value: { editing: boolean, width?: number, height?: number }) {
  const { editing, width, height } = value;
  return useMemo(() => {
    if (editing) {
      if (width && height) {
        return {
          width,
          minHeight: height,
        };
      }
      return {};
    }
  
    return {
      width: 0,
      height: 1,
      border: 'none',
      padding: 0,
      boxShadow: 'none',
      overflow: 'hidden',
    };
  }, [editing, width, height]);
}
