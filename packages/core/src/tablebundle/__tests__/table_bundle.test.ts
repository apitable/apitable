import { ITableBundleInitOptions, ITableBundleLoader, ITableBundleSaver, TableBundle } from '../table_bundle';
import { TableBundleSnapshot } from '../table_bundle_snapshot';
import { TableBundleDataSheet } from '../table_bundle_datasheet';
import * as fs from 'fs';

const assetFilePath = `${__dirname}/test.zip`;

const transformSnapshot = (data: any): TableBundleSnapshot => {
  if (typeof data === 'string') {
    return JSON.parse(data) as TableBundleSnapshot;
  }
  return data as TableBundleSnapshot;
};

class TestLoader implements ITableBundleLoader {
  load(path: string): Buffer {
    return fs.readFileSync(path);
  }
}
class TestSaver implements ITableBundleSaver {
  save(array: Uint8Array, path: string): void {
    return fs.writeFileSync(path, array);
  }

}
const generateOption = (): ITableBundleInitOptions => {
  const options: ITableBundleInitOptions = {
    loader: new TestLoader(),
    saver: new TestSaver()
  };
  return options;
};

describe('TableBundle', () => {
  it('add data sheet', () => {
    const tableBundle = TableBundle.new(generateOption());
    tableBundle.apply(new TableBundleDataSheet(transformSnapshot(snapshot)));
    expect(tableBundle.nodeMap().size).toEqual(1);
    expect(tableBundle.nodeMap()).toMatchSnapshot();
    expect(tableBundle.getDataSheet('dst001')).toMatchSnapshot();
  });

  it('generate zip file', () => {
    const tableBundle = TableBundle.new(generateOption());
    tableBundle.apply(new TableBundleDataSheet(transformSnapshot(snapshot)));
    tableBundle.save(assetFilePath);

    expect(fs.existsSync(assetFilePath)).toBe(true);
  });

  it('parser zip file', () => {
    expect(fs.existsSync(assetFilePath)).toBe(true);
    const tableBundle = TableBundle.new(generateOption());
    tableBundle.loadFile(assetFilePath);
    expect(tableBundle.nodeMap().size).toEqual(1);
    expect(tableBundle.nodeMap()).toMatchSnapshot();
    expect(tableBundle.getDataSheet('dst001')).toMatchSnapshot();
    fs.unlinkSync(assetFilePath);
  });

});

const snapshot = `
{
\t"recordMap": {
\t\t"fldMNKMZ7X4P6": {
\t\t\t"data": {
\t\t\t\t"flds5VCUKUZMH": ["optQAZBO9LO3t"],
\t\t\t\t"fldMNKMZ7X4P6": [{
\t\t\t\t\t"type": 1,
\t\t\t\t\t"text": "x z c x z c "
\t\t\t\t}],
\t\t\t\t"fldt3qT5kfsBk": [{
\t\t\t\t\t"mimeType": "image/png",
\t\t\t\t\t"token": "space/2023/05/17/0026b58ee1654c439bffc3974f9cb4dc",
\t\t\t\t\t"bucket": "QNY1",
\t\t\t\t\t"size": 60983,
\t\t\t\t\t"name": "image.png",
\t\t\t\t\t"width": 856,
\t\t\t\t\t"id": "atcW6tzBymOzF",
\t\t\t\t\t"height": 646
\t\t\t\t}]
\t\t\t},
\t\t\t"id": "recXXXX",
\t\t\t"recordMeta": null
\t\t}
\t},
\t"meta": {
\t\t"fieldMap": {
\t\t\t"flds5VCUKUZMH": {
\t\t\t\t"type": 4,
\t\t\t\t"name": "选项",
\t\t\t\t"property": {
\t\t\t\t\t"options": [{
\t\t\t\t\t\t"color": 0,
\t\t\t\t\t\t"name": "想啊啥",
\t\t\t\t\t\t"id": "optQAZBO9LO3t"
\t\t\t\t\t}]
\t\t\t\t},
\t\t\t\t"id": "flds5VCUKUZMH"
\t\t\t},
\t\t\t"fldMNKMZ7X4P6": {
\t\t\t\t"type": 19,
\t\t\t\t"name": "标题",
\t\t\t\t"property": {
\t\t\t\t\t"defaultValue": ""
\t\t\t\t},
\t\t\t\t"id": "fldMNKMZ7X4P6"
\t\t\t},
\t\t\t"fldt3qT5kfsBk": {
\t\t\t\t"type": 6,
\t\t\t\t"name": "附件",
\t\t\t\t"id": "fldt3qT5kfsBk"
\t\t\t}
\t\t},
\t\t"views": [{
\t\t\t"frozenColumnCount": 1,
\t\t\t"columns": [{
\t\t\t\t"statType": 1,
\t\t\t\t"fieldId": "fldMNKMZ7X4P6"
\t\t\t}, {
\t\t\t\t"fieldId": "flds5VCUKUZMH"
\t\t\t}, {
\t\t\t\t"fieldId": "fldt3qT5kfsBk"
\t\t\t}],
\t\t\t"rows": [{
\t\t\t\t"recordId": "recfte8MK9TWd"
\t\t\t}, {
\t\t\t\t"recordId": "recc2klate85d"
\t\t\t}, {
\t\t\t\t"recordId": "recMWYWw95sVi"
\t\t\t}],
\t\t\t"type": 1,
\t\t\t"autoSave": false,
\t\t\t"name": "维格视图",
\t\t\t"id": "viwruy3vMmo70"
\t\t}]
\t}

}
`;