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

import { useContext } from 'react';
import * as React from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { FlowContext } from '../../context/flow_context';
import { IDragItem } from '../../interfaces';

type Identifier = string | symbol;

interface IDrop {
  onDrop?: (item: IDragItem, monitor: DropTargetMonitor) => void;
  onMouseOver?: (item: IDragItem, monitor: DropTargetMonitor) => void;
  mask?: React.ReactNode;
  accept: Identifier | Identifier[];
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

export const DropWrapper: React.FC<React.PropsWithChildren<IDrop>> = ({ children, onDrop, onMouseOver, mask, className, id, accept, style }) => {
  const { nodesMap, horizontal } = useContext(FlowContext);

  const [{ isOver, isOverCurrent }, drop] = useDrop(
    () => ({
      accept,
      drop: (item: IDragItem, monitor: DropTargetMonitor) => {
        const didDrop = monitor.didDrop();
        if (didDrop) {
          return;
        }
        if (onDrop) {
          onDrop(item, monitor);
        }
      },
      hover: (item: IDragItem, monitor: DropTargetMonitor) => {
        if (onMouseOver) {
          onMouseOver(item, monitor);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
      }),
    }),
    [nodesMap, horizontal],
  );

  const active = isOver || isOverCurrent;

  return (
    <div ref={drop} id={id} className={className} style={style}>
      {active && mask}
      {children}
    </div>
  );
};
