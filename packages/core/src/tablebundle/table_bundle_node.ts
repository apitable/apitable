export class TableBundleNode{
    public nodeId: string;
    public nodeName: string;
    public type: number;
    public data: string;
    public child: TableBundleNode[];
    public parentId: string;

    public constructor(nodeId: string, nodeName: string, type: number, data: string, parentId: string) {
      this.nodeId = nodeId;
      this.nodeName = nodeName;
      this.type = type;
      this.data = data;
      this.child = [];
      this.parentId = parentId;
    }

    public addChild(child: TableBundleNode): void {
      this.child.push(child);
    }
    
    public static build(root: any): TableBundleNode {
      const tableBundleNode = new TableBundleNode(root.nodeId, root.nodeName, root.type, root.data, root.parentId);
      if (root.child) {
        root.child.forEach((node: any) => {
          tableBundleNode.addChild(this.build(node));
        });
      }
      return tableBundleNode;
    }
}