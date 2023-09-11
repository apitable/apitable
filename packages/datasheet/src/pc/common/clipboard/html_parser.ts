/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { ISegment, SegmentType, string2Segment } from '@apitable/core';
import { ITableCellData, ITableData } from './table_data';

let measureContainer: HTMLDivElement;

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
    // Excel will wrap an extra table tag inside when copying with floating images
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
  // NOTES: The handling of span tags in particular can result in the loss of information other than the content wrapped in the span.
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
  // Collection of line height data
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
      // Merging cells will write data in advance, skipping directly
      while (tableRowData[columnIndex]) {
        columnIndex++;
      }

      const tableCell = cells[c];
      if (tableRowsHeightList[row] == null) {
        tableRowsHeightList[row] = Number(tableCell.getAttribute('height')) || null;
      }
      const tableCellData: ITableCellData = (tableRowData[columnIndex] = getDataFromSpan(tableCell));

      const { rowSpan, colSpan } = tableCell;
      tableCellData.rowSpan = rowSpan;
      tableCellData.colSpan = colSpan;

      // When you encounter a merged cell, write the data outside the main cell in advance.
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
  // Here is a patch to fix the fact that <br> is not parsed as a newline by innerText when parsing
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
 * Iterate through the DOM tree to get the segment value.
 * Currently the datasheet only needs to resolve span and a
 */
function getTextFromDOM(node: Node): string | ISegment[] {
  // Some td's don't have a package span, they are just text dom
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || [];
  }

  // Defensive judgement
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return [];
  }

  const element = node as HTMLElement;
  const tagName = element.tagName.toLowerCase();

  // Parse span tag
  if (tagName === 'span') {
    const text = element.innerText;
    // No support for mention
    // const mentionData = element.getAttribute('data-sheet-mention');
    // if (mentionData && text) {
    //   const { mentionType, mentionNotify, token, link } = JSON.parse(mentionData);
    //   return [{ type: SegmentType.Mention, text, link, token, mentionType, mentionNotify }];
    // }

    return text || [];
  }

  // Parsing a tag
  if (tagName === 'a') {
    const link = (element as HTMLAnchorElement).href;
    if (link) {
      return [{ type: SegmentType.Url, text: element.innerText || link, link }];
    }

    return element.innerText || [];
  }

  // Image not supported at this time
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

  // If the current dom is not span and a, and the descendant does not have span or a, there is no need to traverse it again
  if (element.getElementsByTagName('a').length === 0 && element.getElementsByTagName('span').length === 0) {
    return element.innerText || [];
  }

  const segments: ISegment[] = [];
  let child: Node | null = element.firstChild;
  // Recursive sub dom
  while (child) {
    const text = getTextFromDOM(child);
    let prev = segments[segments.length - 1];
    if (typeof text === 'string') {
      // Merge Text types
      if (prev && prev.type === SegmentType.Text) {
        prev.text += text;
      } else if (text) {
        segments.push({ type: SegmentType.Text, text });
      }
    } else {
      text.forEach((seg) => {
        prev = segments[segments.length - 1];
        // Merge Text types
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
