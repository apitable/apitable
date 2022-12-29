export const COVER_HEIGHT = 140;
export const CARD_WIDTH = 246;
export const DRAG_ITEM_WIDTH = 232;
export const ORG_NODE_MENU = 'ORG_NODE_MENU';
export const ORG_EDGE_MENU = 'ORG_EDGE_MENU';

export const RANKSEP = 36;
export const NODESEP = 64;

export const GHOST_NODE_SIZE = 48;

export const CYCLE_NODE_WIDTH = 108;
export const CYCLE_NODE_HEIGHT = 36;

export const DEFAULT_ZOOM = 0.5;
export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 2;

export const SCROLL_SPEED = 20;

export const QUICK_ADD_MODAL_WIDTH = 300;
export const QUICK_ADD_MODAL_HEIGHT = 128;

export const BOUNDS_PADDING = 100;

export enum Direction {
  Vertical = 'TB',
  Horizontal = 'LR',
}

export enum DragNodeType {
  OTHER_NODE = 'OTHER_NODE',
  RENDER_NODE = 'RENDER_NODE'
}

export enum NodeType {
  Default = 'default',
  CustomNode = 'CustomNode',
  CycleNode = 'CycleNode',
  BezierEdge = 'BezierEdge',
  CustomEdge = 'CustomEdge',
  CustomCycleEdge = 'CustomCycleEdge',
  GhostEdge = 'GhostEdge',
  GhostNode = 'GhostNode',
}

export const SHOW_EPMTY_COVER = true;
export const SHOW_EPMTY_FIELD = true;
