import { memo, useEffect, useState } from 'react';
import * as React from 'react';
import SplitPane, { SplitPaneProps } from 'react-split-pane';
import styles from './style.module.less';
import classNames from 'classnames';
import { EmitterEventName, SimpleEmitter } from 'modules/shared/simple_emitter';

interface IVikaSplitPanelProps extends Omit<SplitPaneProps, 'SplitPaneProps'> {
  panelLeft: JSX.Element;
  panelRight: JSX.Element;
}

export const simpleEmitter = new SimpleEmitter();

export const VikaSplitPanel: React.FC<IVikaSplitPanelProps> = memo((props) => {
  const { panelLeft, panelRight, onDragFinished, ...rest } = props;
  const [dragging, setDragging] = useState(false);
  const onDragEnd = (newSize: number) => {
    onDragFinished && onDragFinished(newSize);
    setDragging(false);
  };
  const onDragStart = () => {
    setDragging(true);
  };

  useEffect(() => {
    simpleEmitter.emit(EmitterEventName.PanelDragging, dragging);
  }, [dragging]);

  return <SplitPane
    onDragStarted={onDragStart}
    onDragFinished={onDragEnd}
    resizerClassName={
      classNames({
        [styles.resizeBarStyle]: true,
        [styles.isDragging]: dragging,
      })
    }
    {...rest}
  >
    {panelLeft}
    {panelRight}
  </SplitPane>;
});
