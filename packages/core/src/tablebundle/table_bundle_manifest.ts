import { TableBundleNode } from './table_bundle_node';

export class TableBundleManifest{
    public version: number;
    public id: string;
    public createdAt: number;
    public creatorURL: string;
    public root: TableBundleNode;

    public constructor() {
      this.version = 1;
      this.createdAt = new Date().getTime();
      this.id = this.createdAt.toString();
      this.creatorURL = 'xxxx';
      this.root = new TableBundleNode('root', 'root', 0, '', '');
    }

    public addDataSheetNode(nodeId: string, nodeName: string): void {
      this.root.addChild(new TableBundleNode(nodeId, nodeName, 2, nodeId + '.json', ''));
    }

    public allChildNodes(): string[] {
      const result: string[] = [];
      this.root.child.forEach((node: TableBundleNode) => {
        result.push(node.nodeId);
      });
      return result;
    }
    
    public static build(data: any): TableBundleManifest {
      const tableBundleManifest = new TableBundleManifest();
      if (data != undefined) {
        tableBundleManifest.version = data.version||tableBundleManifest.version;
        tableBundleManifest.id = data.id || tableBundleManifest.id;
        tableBundleManifest.createdAt = data.createdAt || tableBundleManifest.createdAt;
        tableBundleManifest.creatorURL = data.creatorURL || tableBundleManifest.creatorURL;
            
        if (data.root && data.root.child) {
          data.root.child.forEach((node: any) => {
            tableBundleManifest.root.addChild(TableBundleNode.build(node));
          });
        }
      }
      return tableBundleManifest;
    }
}