import { ITableData } from './table_data';
import { CsvDelimiter, parseCsv } from './csv_parser';
import { parseHtml } from './html_parser';
import { FieldType, IField, IStandardValue, IStandardValueTable, escapeHtml } from '@apitable/core';

const DATASHEET_CLASS = 'vika-datasheet';

export interface ISerializer<T, U> {

  serialize (value: T): U;

  parse (text: U): T;
}

// 多选才需要分隔符
function getSeparator(fieldType: FieldType) {
  return fieldType !== FieldType.Text ? ', ' : '';
}

function tableDataToStandardValueTable(tableData: ITableData | null): IStandardValueTable | null {
  if (tableData === null || tableData.rowCount === 0) {
    return null;
  }

  return {
    header: ' '.repeat(tableData.columnCount).split('').map(() => ({ type: FieldType.Text } as IField)),
    body: tableData.data.map(row => row.map(cell => ({
      sourceType: FieldType.Text,
      data: cell.value,
    }))),
  };
}

export class CSVSerializer implements ISerializer<IStandardValueTable | null, string> {

  serialize(value: IStandardValueTable | null): string {
    if (!value) {
      return '';
    }

    return this.serializeTable(value.body);
  }

  private serializeCell(cell: IStandardValue) {
    let cellStr = cell.data.map(v => v.text).join(getSeparator(cell.sourceType));
    const { columnDelimiter, rowDelimiter, cellDelimiter } = CsvDelimiter;

    if (cellStr.indexOf(columnDelimiter) > -1 || cellStr.indexOf(rowDelimiter) > -1) {
      const cellDelimiterReg = new RegExp(cellDelimiter, 'g');
      cellStr = cellDelimiter + cellStr.replace(cellDelimiterReg, cellDelimiter + cellDelimiter) + cellDelimiter;
    }
    return cellStr;
  }

  private serializeRow(row: IStandardValue[]): string {
    return row.map(cell => this.serializeCell(cell)).join(CsvDelimiter.columnDelimiter);
  }

  private serializeTable(table: IStandardValue[][]): string {
    return table.map(row => this.serializeRow(row)).join(CsvDelimiter.rowDelimiter);
  }

  parse(text: string): IStandardValueTable | null {
    const tableData = parseCsv(text);
    return tableDataToStandardValueTable(tableData);
  }
}

export class HtmlSerializer implements ISerializer<IStandardValueTable | null, string> {

  serialize(value: IStandardValueTable | null): string {
    if (!value) {
      return '';
    }

    return `<table class="${DATASHEET_CLASS}">${this.serializeBody(value.body)}</table>`;
  }

  private serializeBody(body: IStandardValue[][]) {
    return body.map(row => this.serializeRow(row)).join('');
  }

  private serializeRow(row: IStandardValue[]) {
    return `<tr>${row.map(cell => this.serializerCell(cell)).join('')}</tr>`;
  }

  private serializerCell(cell: IStandardValue) {
    return `<td>${escapeHtml(cell.data.map(t => t.text).join(getSeparator(cell.sourceType)))}</td>`;
  }

  parse(text: string): IStandardValueTable | null {
    const tableData = parseHtml(text);
    return tableDataToStandardValueTable(tableData);
  }
}

export class JSONSerializer implements ISerializer<IStandardValueTable | null, string> {
  serialize(value: IStandardValueTable | null): string {
    if (!value) {
      return '';
    }

    try {
      return JSON.stringify({
        ...value,
      });
    } catch (e) {
      console.warn('! ' + e);
      return '';
    }
  }

  parse(text: string): IStandardValueTable | null {
    try {
      return JSON.parse(text);
    } catch (e) {
      console.warn('! ' + e);
      return null;
    }
  }
}

export class Serializer {

  static csv = new CSVSerializer();

  static html = new HtmlSerializer();

  static json = new JSONSerializer();
}
