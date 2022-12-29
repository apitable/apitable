import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { createDragDropManager } from 'dnd-core';

export const dndH5Manager = createDragDropManager(HTML5Backend);
export const dndTouchManager = createDragDropManager(TouchBackend);
