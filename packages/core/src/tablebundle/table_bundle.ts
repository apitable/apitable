import * as fflate from 'fflate';
import { TableBundleManifest } from './table_bundle_manifest';
import { TableBundleDataSheet } from './table_bundle_datasheet';
import { TableBundleSnapshot } from './table_bundle_snapshot';

export class TableBundle {
  public manifest: TableBundleManifest;
  private _nodeMap: Map<string, TableBundleDataSheet>;
  private _saver!: ITableBundleSaver;
  private _loader!: ITableBundleLoader;
  private constructor() {
    this.manifest = new TableBundleManifest();
    this._nodeMap = new Map<string, TableBundleDataSheet>();
  }

  public static new(options: ITableBundleInitOptions): TableBundle {
    const { loader, saver } = options;
    const tableBundle = new TableBundle();
    tableBundle.setTableBundleSaver(saver);
    tableBundle.setTableBundleLoader(loader);
    return tableBundle;
  }

  setTableBundleSaver(provider: ITableBundleSaver): void {
    this._saver = provider;
  }

  setTableBundleLoader(loader: ITableBundleLoader): void {
    this._loader = loader;
  }

  public nodeMap(): Map<string, TableBundleDataSheet> {
    return this._nodeMap;
  }

  public apply(sheet: TableBundleDataSheet, id: string = 'dst001', name: string = 'datasheet'): void {
    this._nodeMap.set(id, sheet);
    this.manifest.addDataSheetNode(id, name);
  }

  public getDataSheet(id: string): TableBundleDataSheet {
    return <TableBundleDataSheet>this._nodeMap.get(id);
  }

  save(path: string) {
    if (this._saver === undefined) {
      return;
    }
    const sheetData = {};
    this.nodeMap().forEach((value: TableBundleDataSheet, key: string) => {
      sheetData[key + '.json'] = fflate.strToU8(JSON.stringify(value.snapshot));
      if (value.extras !== undefined) {
        sheetData[key + '.extras.json'] = fflate.strToU8(value.extras);
      }
    });
    const zipped = fflate.zipSync({
      data: sheetData,
      'manifest.json': fflate.strToU8(JSON.stringify(this.manifest))
    }, {
      level: 1,
      mtime: new Date()
    });
    this._saver.save(zipped, path);
  }

  loadFile(path: string) {
    if (this._loader === undefined) {
      return;
    }
    this._nodeMap = new Map<string, TableBundleDataSheet>();
    const buffer = this._loader.load(path);
    const unzipped = fflate.unzipSync(buffer);
    if (unzipped['manifest.json'] === undefined) {
      throw new Error('manifest.json not found');
    }

    this.manifest = TableBundleManifest.build(JSON.parse(fflate.strFromU8(unzipped['manifest.json'])));
    const allChildNodes = this.manifest.allChildNodes();
    for (let i = 0; i < allChildNodes.length; i++) {
      const nodeId = allChildNodes[i];
      if (nodeId === undefined) {
        throw new Error('nodeId ' + nodeId + ' is undefined');
      }
      const fileName = 'data/' + nodeId + '.json';
      if (unzipped[fileName] === undefined) {
        throw new Error(fileName + ' not found');
      }
      // @ts-ignore
      const sn = JSON.parse(fflate.strFromU8(unzipped[fileName])) as TableBundleSnapshot;

      const extrasFileName = 'data/' + nodeId + '.extras.json';
      let extras;
      if (unzipped[extrasFileName] !== undefined) {
        // @ts-ignore
        extras = fflate.strFromU8(unzipped[extrasFileName]);
      }
      const dataSheet = new TableBundleDataSheet(sn, extras);
      this._nodeMap.set(nodeId, dataSheet);
    }
  }

}

export interface ITableBundleInitOptions {
  loader: ITableBundleLoader;
  saver: ITableBundleSaver;
}

export interface ITableBundleLoader{
    load(path: string): Buffer;
}
export interface ITableBundleSaver{
    save(bundle: Uint8Array, path: string): void;
}
