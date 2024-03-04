export interface IAddNodeParams {
  parentId: string;
  type: number;
  nodeName?: string;
  preNodeId?: string;
  extra?: { [key: string]: any };
  unitId?: string;
  aiCreateParams?: {
    datasheet: {
      id: string;
      viewId: string
    }[]
  }
}
