import { Edge, Node as FlowNode } from '@apitable/react-flow';
import { DragNodeType } from './constants';

export enum NodeHandleState {
  Unhandled = 'Unhandled',
  Handled = 'Handled',
  Handling = 'Handling',
}

export interface INodeState {
  collapsed?: boolean;
  handleState?: NodeHandleState;
  position?: { x: number; y: number };
}

export interface INodeStateMap {
  [nodeId: string]: INodeState;
}

export interface IViewNodeStateMap {
  [id: string]: INodeStateMap;
}

export interface INodeData {
  datasheetId: string;
  linkIds: string[];
  recordName: string;
  degree: IDegree;
  parents: INode[];
  width: number;
  height: number;
}

export interface INode extends FlowNode<INodeData> {
  data: INodeData;
  [key: string]: any;
}

export type IEdge = Edge;
export interface IGraphData {
  nodes: INode[];
  edges?: Edge[];
}

export interface IDegree {
  degree: number;
  inDegree: number;
  outDegree: number;
}

export type IDegrees = {
  [id: string]: IDegree;
};

export interface INodesMap {
  [id: string]: INode;
}
export interface IPre {
  [id: string]: INode[];
}

export interface IAdj {
  [id: string]: Array<string>;
}
export interface IDragItem {
  id: string;
  data: INodeData;
  type: DragNodeType;
}

type SetEdgeVisibleFunc = (visible: boolean) => void;
export interface IGhostNodesRef {
  id?: string;
  hiddenLastNode?: () => void;
  setEdgeVisibleFuncsMap?: {
    [id: string]: SetEdgeVisibleFunc;
  };
}

export interface IBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export enum ScrollBarType {
  Vertical,
  Horizontal,
}