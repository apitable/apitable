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

export const DropWrapper: React.FC<IDrop> = ({ 
  children, 
  onDrop, 
  onMouseOver,
  mask, 
  className, 
  id,
  accept, 
  style 
}) => {

  const {
    nodesMap,
    horizontal,
  } = useContext(FlowContext);

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
