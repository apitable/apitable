import { NodeTypeEnum } from './../enums/node.enum';

export interface IAPINode {
  id: string;
  name: string;
  type: NodeTypeEnum;
  icon: string; // emoji id ，后续开放自定义这里就是 URL
  isFav: boolean;
}

export interface IAPIFolderNode extends IAPINode {
  children: IAPINode[]
}

export type IAPINodeDetail = IAPINode | IAPIFolderNode;