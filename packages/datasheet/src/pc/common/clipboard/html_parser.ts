import { ISegment, SegmentType, string2Segment } from '@vikadata/core';
import { ITableCellData, ITableData } from './table_data';

let measureContainer;

(() => {
  if (!process.env.SSR) {
    measureContainer = document.createElement('div');
    measureContainer.style.display = 'none';
    measureContainer.style.font = 'initial';
  }
})();

export function parseHtml(html: string): ITableData | null {
  measureContainer.innerHTML = html;
  const tables = measureContainer.getElementsByTagName('table');
  let tableData: ITableData | null = null;
  const tableCount = tables.length;
  let validTable = tableCount === 1;
  if (tableCount > 1) {
    // Excel 复制有浮动图片时，会在里面包多一个table标签
    const firstTable = tables[0];
    let i = 1;
    for (; i < tableCount; i++) {
      const table = tables[i];
      if (!firstTable.contains(table)) {
        break;
      }
    }
    if (i === tableCount) {
      validTable = true;
    }
  }

  if (validTable) {
    document.body.appendChild(measureContainer);
    tableData = getDataFromTable(tables[0]);
    document.body.removeChild(measureContainer);
  }
  // NOTES: 特别针对 span 标签的处理，会导致除了被 span 包裹的内容之外的信息丢失，
  // else if (tableCount === 0) {
  //   const spans = measureContainer.getElementsByTagName('span');
  //   if (spans.length === 1) {
  //     document.body.appendChild(measureContainer);
  //     const tableCellData = getDataFromSpan(spans[0]);
  //     tableData = {
  //       data: [[tableCellData]],
  //       rowCount: 1,
  //       columnCount: 1,
  //     };
  //     document.body.removeChild(measureContainer);
  //   }
  // }
  measureContainer.innerHTML = '';
  return tableData;
}

function getDataFromTable(table: HTMLTableElement): ITableData {
  const tableCellDatas: ITableCellData[][] = [];
  // 收集行高数据
  const tableRowsHeightList: (number | null)[] = [];
  const columns: (number | null)[] = getColumnWidthsFromTable(table);

  const rows = table.rows;
  const rowCount = rows.length;
  let columnCount = 0;
  for (let row = 0; row < rowCount; row++) {
    const tableRow = rows[row];
    const cells = tableRow.cells;
    const tableRowData = tableCellDatas[row] || (tableCellDatas[row] = []);

    let columnIndex = 0;
    for (let c = 0, cellCount = cells.length; c < cellCount; c++) {
      // 合并单元格会提前写入数据，直接跳过
      while (tableRowData[columnIndex]) {
        columnIndex++;
      }

      const tableCell = cells[c];
      if (tableRowsHeightList[row] == null) {
        tableRowsHeightList[row] = Number(tableCell.getAttribute('height')) || null;
      }
      const tableCellData: ITableCellData = tableRowData[columnIndex] = getDataFromSpan(tableCell);

      const { rowSpan, colSpan } = tableCell;
      tableCellData.rowSpan = rowSpan;
      tableCellData.colSpan = colSpan;

      // 遇到合并单元格，提前把主单元格外的数据写好。
      for (let j = 0; j < rowSpan; j++) {
        for (let k = 0; k < colSpan; k++) {
          if (j === 0 && k === 0) continue;

          const tempTableRowData = tableCellDatas[row + j] || (tableCellDatas[row + j] = []);
          tempTableRowData[columnIndex + k] = { value: [], rowSpan: 1, colSpan: 1 };
        }
      }
      columnIndex += colSpan;
    }
    columnCount = Math.max(columnCount, columnIndex);
  }
  return {
    data: tableCellDatas,
    columns,
    rowCount,
    columnCount,
    rows: tableRowsHeightList,
  };
}

function getColumnWidthsFromTable(table: HTMLTableElement): (number | null)[] {
  let child = table.firstElementChild;
  let colGroup: HTMLTableColElement | null = null;
  while (child) {
    if (child.tagName.toLowerCase() === 'colgroup') {
      colGroup = child as HTMLTableColElement;
      break;
    }
    child = child.nextElementSibling;
  }

  const widths: (number | null)[] = [];
  child = colGroup && colGroup.firstElementChild;
  while (child) {
    if (child.tagName.toLowerCase() === 'col') {
      let width: number | null = parseInt((child as HTMLTableColElement).width, 10);
      let span = (child as HTMLTableColElement).span;
      width = isNaN(width) || !width ? null : width;
      while (span--) {
        widths.push(width);
      }
    }
    child = child.nextElementSibling;
  }
  return widths;
}

function getDataFromSpan(span: HTMLElement): ITableCellData {
  const originHTML = span.innerHTML;
  let innerHTML = originHTML && originHTML.replace(/\r?\n/g, '');
  // 这里是一个补丁，为了解决解析的时候 <br> 没有被innerText解析为换行
  innerHTML = innerHTML.replace(/<br>/g, '\n');
  if (innerHTML !== originHTML) {
    span.innerHTML = innerHTML;
  }
  const value = getTextFromDOM(span);

  const tableCellData: ITableCellData = {
    value: typeof value === 'string' ? string2Segment(value) : value,
    rowSpan: 1,
    colSpan: 1,
  };

  return tableCellData;
}

/**
 * 遍历 DOM tree，得到 segment 值。
 * 目前 datasheet 只需要解析 span 和 a
 */
function getTextFromDOM(node: Node): string | ISegment[] {
  // 有些 td 没有包 span，直接就是文本 dom
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || [];
  }

  // 防御性判断
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return [];
  }

  const element = node as HTMLElement;
  const tagName = element.tagName.toLowerCase();

  // 解析 span 标签
  if (tagName === 'span') {
    const text = element.innerText;
    // 暂不支持 mention
    // const mentionData = element.getAttribute('data-sheet-mention');
    // if (mentionData && text) {
    //   const { mentionType, mentionNotify, token, link } = JSON.parse(mentionData);
    //   return [{ type: SegmentType.Mention, text, link, token, mentionType, mentionNotify }];
    // }

    return text || [];
  }

  // 解析 a 标签
  if (tagName === 'a') {
    const link = (element as HTMLAnchorElement).href;
    if (link) {
      return [{ type: SegmentType.Url, text: element.innerText || link, link }];
    }

    return element.innerText || [];
  }

  // 暂不支持图片
  // const imgElements = element.getElementsByTagName('img');
  // if (imgElements.length === 1) {
  //   const imgElement: HTMLImageElement = imgElements[0];
  //   const imgSrc = imgElement.src;
  //   const width = imgElement.width;
  //   const height = imgElement.height;
  //   if (imgSrc && width && height) {
  //     return [{ type: SegmentType.EmbedImage, text: '', link: imgSrc, width, height }];
  //   }
  // }

  // 当前 dom 不是 span 和 a，后代也没有 span 也没有 a，就不需要再遍历了
  if (element.getElementsByTagName('a').length === 0 && element.getElementsByTagName('span').length === 0) {
    return element.innerText || [];
  }

  const segments: ISegment[] = [];
  let child: Node | null = element.firstChild;
  // 递归子 dom
  while (child) {
    const text = getTextFromDOM(child);
    let prev = segments[segments.length - 1];
    if (typeof text === 'string') {
      // 合并 Text 类型
      if (prev && prev.type === SegmentType.Text) {
        prev.text += text;
      } else if (text) {
        segments.push({ type: SegmentType.Text, text });
      }
    } else {
      text.forEach(seg => {
        prev = segments[segments.length - 1];
        // 合并 Text 类型
        if (prev && prev.type === SegmentType.Text && seg.type === SegmentType.Text) {
          prev.text += seg.text;
        } else {
          segments.push(seg);
        }
      });
    }
    child = child.nextSibling;
  }

  if (segments.length === 1 && segments[0].type === SegmentType.Text) {
    return segments[0].text;
  }
  return segments;
}
