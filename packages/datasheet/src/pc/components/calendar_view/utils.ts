import { IPosition } from './calendar_context';

const MODAL_WIDTH = 420;

export const getPosition = (e: React.MouseEvent) => {
  const rect = (e.target as any).getBoundingClientRect();
  const position: IPosition = {
    left: Math.min(rect.left + rect.width + 8, window.innerWidth - MODAL_WIDTH) + 'px',
  };
  if (rect.top < window.innerHeight / 2) {
    position.top = rect.top + rect.height + 8 + 'px';
  } else {
    position.bottom = (window.innerHeight - rect.top) + 'px';
  }
  return position;
};

export const formatString2Date = (value: string) => {
  return value.replace(/年| /, '-').replace(/月/, '');
};

export const isClickDragDropModal = (e: MouseEvent) => {
  const modalElement = document.querySelector('.dragDropModal');
  const moveElement = document.querySelector('.isMove');
  if (
    (modalElement && modalElement.contains(e.target as HTMLElement)) ||
    (moveElement && moveElement.contains(e.target as HTMLElement))
  ) return true;
  return false;
};