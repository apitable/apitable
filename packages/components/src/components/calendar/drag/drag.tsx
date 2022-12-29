import React from 'react';
import { useDrag, DragSourceMonitor } from 'react-dnd';
import { TYPE } from '../constants';
import { IDrag } from '../interface';

export const Drag = ({ children, id, task }: IDrag) => {
  const [{ opacity }, drag] = useDrag(() => ({ 
    type: TYPE,
    item: { id, task },
    collect: (monitor: DragSourceMonitor) => ({
      opacity: monitor.isDragging() ? 0.6 : 1,
    }),
  }));
  return (
    <div ref={drag} className="list" style={{ opacity }}>
      {children}
    </div>
  );
};