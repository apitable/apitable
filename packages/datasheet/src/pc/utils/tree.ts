interface IBaseTreeNode<T> {
  children?: T[];
}

export interface ICascaderOption {
  value: string;
  label: string;
  children?: ICascaderOption[];
}

// Convert the original data structure into a data structure supported by Cascader Options
export const mapTreeNodesRecursively = <T extends IBaseTreeNode<T>>(nodes: T[], valueProperty: string): ICascaderOption[]=> nodes.map((node: T) => ({
  value: node[valueProperty],
  label: node[valueProperty],
  children: node.children?.length ? mapTreeNodesRecursively(node.children, valueProperty) : undefined,
}));