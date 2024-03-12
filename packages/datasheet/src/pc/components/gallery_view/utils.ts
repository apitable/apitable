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

import { BasicValueType, Field, FieldType, IField, IFieldMap, IGalleryViewStyle, ILookUpField, ISnapshot, IViewRow, Selectors } from '@apitable/core';
import { store } from 'pc/store';
import { EACH_TEXT_LINE_HEIGHT } from '../record_card/card_text';
import {
  DEFAULT_SINGLE_TEXT_HEIGHT,
  FIELD_HEIGHT_MAP,
  FIELD_HEIGHT_MAP_MOBILE,
  FIELD_HEIGHT_VIRTUAL_MAP,
  FIELD_HEIGHT_VIRTUAL_MAP_MOBILE,
  GalleryGroupItemType,
  PADDING_RIGHT,
  PADDING_TOP,
  SHOW_THUMBIAL_WIDTH,
} from './constant';
import { IGalleryGroupItem } from './interface';

/**
 * Returns a list of fields that can be used as album covers, including the normal
 * attachment fields and the fields where the lookup entity field is an attachment
 * @param fieldMap fieldMap
 */
export const getCoverFields = (fieldMap: IFieldMap) => {
  const coverFields: IField[] = [];
  Object.values(fieldMap).forEach((field) => {
    switch (field.type) {
      case FieldType.Attachment:
        coverFields.push(field);
        break;
      case FieldType.LookUp:
        const entityField = Field.bindModel(field).getLookUpEntityField();
        const { basicValueType } = Field.bindModel(field);
        if (basicValueType === BasicValueType.Array && entityField && entityField.type === FieldType.Attachment) {
          coverFields.push(field);
        }
        break;
      default:
        return;
    }
  });
  return coverFields;
};

export const hasCover = (fieldMap: IFieldMap, coverFieldId?: string) => {
  const coverFields = getCoverFields(fieldMap);
  return coverFieldId && Boolean(coverFields.find((coverField) => coverField.id === coverFieldId));
};

export const getShowFieldType = (field: IField) => {
  let fieldType = field.type;
  const { isComputed, basicValueType } = Field.bindModel(field);
  // The creator/modifier is a calculated field and the base type is string.
  // Special processing is required here to ensure that it is displayed correctly in the album/kanban.
  if (isComputed && ![FieldType.CreatedBy, FieldType.LastModifiedBy].includes(fieldType)) {
    switch (basicValueType) {
      case BasicValueType.Boolean:
        fieldType = FieldType.Checkbox;
        break;
      case BasicValueType.String:
      case BasicValueType.Number:
        // The text of the calculation field is displayed as a single line of text in the card by default
        fieldType = FieldType.SingleText;
        break;
      case BasicValueType.DateTime:
        fieldType = FieldType.DateTime;
        break;
      case BasicValueType.Array:
      default:
        if (field.type === FieldType.LookUp) {
          const entityField = Field.bindModel(field as ILookUpField).getLookUpEntityField();
          if (entityField) fieldType = entityField.type;
        }
        break;
    }
  }
  return fieldType;
};

// maxLine Maximum number of lines for multi-line text display
export const getFieldHeight = (field: IField, maxLine: number, isMobile?: boolean) => {
  const showFieldType = getShowFieldType(field);
  if (showFieldType === FieldType.Text) {
    return maxLine * EACH_TEXT_LINE_HEIGHT;
  }
  if (isMobile) return FIELD_HEIGHT_MAP_MOBILE[showFieldType] || DEFAULT_SINGLE_TEXT_HEIGHT;
  return FIELD_HEIGHT_MAP[showFieldType] || DEFAULT_SINGLE_TEXT_HEIGHT;
};

// Temporarily compatible with virtual cards, need to replace different hash height mapping, room for optimization
export const getVietualFieldHeight = (field: IField, maxLine: number, isMobile?: boolean) => {
  const showFieldType = getShowFieldType(field);
  if (showFieldType === FieldType.Text) {
    return maxLine * EACH_TEXT_LINE_HEIGHT;
  }
  if (isMobile) return FIELD_HEIGHT_VIRTUAL_MAP_MOBILE[showFieldType] || DEFAULT_SINGLE_TEXT_HEIGHT;
  return FIELD_HEIGHT_VIRTUAL_MAP[showFieldType] || DEFAULT_SINGLE_TEXT_HEIGHT;
};

/**
 * Calculate the right number of cards according to the width of the container.
 */
const getCardCount = (w: number) => {
  // FIXME: Optimisable
  if (w < 560) {
    return 2;
  }
  if (w >= 560 && w < 720) {
    return 3;
  }
  if (w >= 720 && w < 960) {
    return 3;
  }

  if (w >= 960 && w < 1280) {
    return 4;
  }
  if (w >= 1280 && w < 1620) {
    return 4;
  }
  if (w >= 1620 && w < 1920) {
    return 6;
  }
  return Math.floor(w / SHOW_THUMBIAL_WIDTH);
};

export const getGroupLinearRows = (
  groupedRows: string[][],
  groupingCollapseIds: string[],
  showAddCard: boolean,
  columnCount: number,
): IGalleryGroupItem[] => {
  const res: IGalleryGroupItem[] = [];
  groupedRows.forEach((eachGroupRows) => {
    // This group is hidden and only the group header is rendered.
    const groupHeadRecordId = eachGroupRows[0];
    res.push({
      recordId: groupHeadRecordId,
      groupHeadRecordId,
      type: GalleryGroupItemType.GroupTitle,
    });
    // Blank placeholder
    [...Array(columnCount - 1)].forEach((_item, index) => {
      res.push({
        recordId: `${groupHeadRecordId}_${index}`,
        groupHeadRecordId,
        type: GalleryGroupItemType.GroupHeadBlank,
      });
    });
    // If the card is not collapsed, it needs to be rendered normally.
    if (!groupingCollapseIds.includes(groupHeadRecordId)) {
      // Showing a few lines
      const cardCount = eachGroupRows.length + (showAddCard ? 1 : 0);
      const rowCount = Math.ceil(cardCount / columnCount);
      const blankCardCount = rowCount * columnCount - cardCount;
      eachGroupRows.forEach((recordId) => {
        res.push({
          recordId,
          groupHeadRecordId,
          type: GalleryGroupItemType.Card,
        });
      });
      if (showAddCard) {
        res.push({
          recordId: groupHeadRecordId,
          groupHeadRecordId,
          type: GalleryGroupItemType.AddCard,
        });
      }
      if (blankCardCount > 0) {
        [...Array(blankCardCount)].forEach((_item, index) => {
          res.push({
            recordId: `${groupHeadRecordId}_${index}`,
            groupHeadRecordId,
            type: GalleryGroupItemType.BlankCard,
          });
        });
      }
    }
  });
  return res;
};

export const getAddValue = (recordId?: string, fieldId?: string) => {
  if (!recordId || !fieldId) return undefined;
  const state = store.getState();
  const snapshot: ISnapshot | undefined = Selectors.getSnapshot(state)!;
  const value = Selectors.getCellValue(state, snapshot, recordId, fieldId);
  return { [fieldId]: value };
};

/**
 * Get the width of the card, and the number of cards in a row
 */
export const getColumnWidthAndCount = (containerWith: number, isMobile: boolean, galleryStyle: IGalleryViewStyle) => {
  let width = containerWith - (isMobile ? 0 : PADDING_RIGHT);
  let cardWidth = 248;
  let columnCount = Math.floor(width / cardWidth);

  if (galleryStyle) {
    if (galleryStyle.isAutoLayout) {
      // In automatic mode, the number and width of cards are calculated from the resolution
      columnCount = getCardCount(width);
    } else {
      // In manual mode, the number of cards comes to the user to configure. Cards
      columnCount = galleryStyle.cardCount;
    }
  }

  const isOneColumnMode = columnCount === 1;
  if (isOneColumnMode && !isMobile) {
    width = 720;
  }

  if (isMobile) {
    columnCount = Math.min(columnCount, 2);
  }
  cardWidth = width / columnCount;
  return {
    cardWidth,
    columnCount,
  };
};

export const getGalleryLinearRows = (rows: IViewRow[], canAddCard: boolean) => {
  const res: IGalleryGroupItem[] = [];
  rows.forEach((row) => {
    res.push({
      recordId: row.recordId,
      type: GalleryGroupItemType.Card,
    });
  });
  if (canAddCard) {
    res.push({
      recordId: 'addCard',
      type: GalleryGroupItemType.AddCard,
    });
  }
  return res;
};

export const getSearchItemIndex = (
  searchRecordId: string,
  linearRows: IGalleryGroupItem[],
  _visibleRecords: IViewRow[],
  columnCount: number,
  isGrouped: boolean,
) => {
  const searchRecordIndex = isGrouped
    ? linearRows.findIndex((item) => item.recordId === searchRecordId && item.type === GalleryGroupItemType.Card)
    : _visibleRecords.findIndex((item) => item.recordId === searchRecordId);
  const rowIndex = Math.floor(searchRecordIndex / columnCount);
  const columnIndex = searchRecordIndex % columnCount;
  return { rowIndex, columnIndex };
};

// Determine if paddingTop should be added based on the previous type of the header
export const getGroupTitlePaddingTip = (linearRows: IGalleryGroupItem[], index: number, rowIndex: number) => {
  if (rowIndex === 0) {
    return 16;
  }
  const prevItem = linearRows[index - 1];
  return !prevItem || (prevItem && prevItem.type === GalleryGroupItemType.GroupHeadBlank) ? PADDING_TOP - 8 : PADDING_TOP;
};
