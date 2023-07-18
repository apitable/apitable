export interface IAddNodeParams {
  parentId: string;
  type: number;
  nodeName?: string;
  preNodeId?: string;
  extra?: { [key: string]: any };
  aiCreateParams?: {
    datasheet: {
      id: string;
      viewId: string
    }[]
  }
}
