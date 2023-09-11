/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import classNames from 'classnames';
import { memo, useEffect, useState } from 'react';
import * as React from 'react';
import SplitPane, { SplitPaneProps } from 'react-split-pane';
import { EmitterEventName, SimpleEmitter } from 'modules/shared/simple_emitter';
import styles from './style.module.less';

const _SplitPane: any = SplitPane;

interface IVikaSplitPanelProps extends Omit<SplitPaneProps, 'SplitPaneProps'> {
  panelLeft: JSX.Element;
  panelRight: JSX.Element;
}

export const simpleEmitter = new SimpleEmitter();

export const VikaSplitPanel: React.FC<React.PropsWithChildren<IVikaSplitPanelProps>> = memo((props) => {
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

  return (
    <_SplitPane
      onDragStarted={onDragStart}
      onDragFinished={onDragEnd}
      resizerClassName={classNames({
        [styles.resizeBarStyle]: true,
        [styles.isDragging]: dragging,
      })}
      {...rest}
    >
      {panelLeft}
      {panelRight}
    </_SplitPane>
  );
});
