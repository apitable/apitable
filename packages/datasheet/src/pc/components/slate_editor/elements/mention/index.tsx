import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as React from 'react';

import { Transforms } from 'slate';
import { useSlate, ReactEditor, useReadOnly } from 'slate-react';
import { IElement, IElementRenderProps, IMentionElementData } from '../../interface/element';
import { MemberItem } from 'pc/components/multi_grid/cell/cell_member/member_item';

import styles from './mention.module.less';

const Mention = React.memo(({ children, element, attributes }: IElementRenderProps<IElement<IMentionElementData>>) => {
  const elementData = useMemo(() => (element.data || {}), [element.data]);
  const editor = useSlate() as ReactEditor;
  const readOnly = useReadOnly();
  const timer = useRef<number | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (timer.current) {
      window.clearTimeout(timer.current);
    }
    if (readOnly) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    try {
      const path = ReactEditor.findPath(editor, element);
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      /**
       * 插入的时候默认多插入一个空格,所以光标回退两格
       * 不用异步马上回退，大多数时候光标回在目标元素的后两格处闪一下，然后又聚焦到点击的元素上，加了preventDefault也未能阻止，待研究...
       */
      timer.current = window.setTimeout(() => {
        Transforms.move(editor, { distance: 2, unit: 'offset' });
        timer.current = null;
      }, 300);
    } catch (error) {
      console.log(error);
    }
  }, [editor, element, readOnly]);

  /**
   * 主要解决：加了异步设置光标位置可能会导致光标位置乱跳
   * 场景：点击后马上输入，此时光标位置在输入字符后面，当setTimeout到期光标会后移两格，监听到键盘输入取消异步移动光标
   */
  useEffect(() => {
    const clearTimeout = () => {
      if (timer.current) {
        window.clearTimeout(timer.current);
        timer.current = null;
      }
    };
    document.addEventListener('keydown', clearTimeout);

    return () => {
      document.removeEventListener('keydown', clearTimeout);
      clearTimeout();
    };
  }, []);

  const adjustStyle: React.CSSProperties = elementData.avatar ? {} : { top: 0 };

  return (
    <span {...attributes} className={styles.wrap} onMouseDownCapture={handleMouseDown}>
      <span contentEditable={false} className={styles.mention} style={adjustStyle}>
        {/* 样式需要调整: 在不同标题下显示效果较差 */}
        <MemberItem unitInfo={elementData} style={{ margin: 0 }}/>
      </span>
      {children}
    </span>
  );
});

export default Mention;