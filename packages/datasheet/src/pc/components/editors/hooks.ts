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
    /**
     *  为了解决中文输入法输入第一个字符被切掉的问题
     * 在非编辑状态要变成一个不可见的编辑框，继续监听各种用户键盘事件
     */
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
