import {
  BasicValueType, Field, FieldType, IField, IFieldMap,
  IGalleryViewStyle, ILookUpField, ISnapshot, IViewRow, Selectors
} from '@apitable/core';
import { store } from 'pc/store';
import { EACH_TEXT_LINE_HEIGHT } from '../record_card/card_text';
import {
  DEFAULT_SINGLE_TEXT_HEIGHT, FIELD_HEIGHT_MAP, FIELD_HEIGHT_MAP_MOBILE,
  FIELD_HEIGHT_VIRTUAL_MAP, FIELD_HEIGHT_VIRTUAL_MAP_MOBILE,
  GalleryGroupItemType, PADDING_RIGHT, PADDING_TOP, SHOW_THUMBIAL_WIDTH
} from './constant';
import { IGalleryGroupItem } from './interface';

/**
 * 返回可以作为相册封面的字段列表，包含普通的附件字段和 lookup 实体字段为附件的字段
 * @param fieldMap fieldMap
 */
export const getCoverFields = (fieldMap: IFieldMap) => {
  const coverFields: IField[] = [];
  Object.values(fieldMap).forEach(field => {
    switch (field.type) {
      case FieldType.Attachment:
        coverFields.push(field);
        break;
      case FieldType.LookUp:
        const entityField = Field.bindModel(field).getLookUpEntityField();
        const { basicValueType } = Field.bindModel(field);
        // 这里跟是否有汇总计算无关， 原样展示/去重 返回的都是原样的附件，都可作为相册封面。
        if (basicValueType === BasicValueType.Array && entityField && entityField.type === FieldType.Attachment) {
          coverFields.push(field);
        }
        break;
      default: return;
    }
  });
  return coverFields;
};

export const hasCover = (fieldMap: IFieldMap, coverFieldId?: string) => {
  const coverFields = getCoverFields(fieldMap);
  return coverFieldId && Boolean(coverFields.find(coverField => coverField.id === coverFieldId));
};

export const getShowFieldType = (field: IField) => {
  let fieldType = field.type;
  const { isComputed, basicValueType } = Field.bindModel(field);
  // 创建/修改人是计算字段，且基础类型为 string，
  // 此处需进行特殊处理，确保在相册/看板正确显示。
  if (isComputed && ![FieldType.CreatedBy, FieldType.LastModifiedBy].includes(fieldType)) {
    switch (basicValueType) {
      case BasicValueType.Boolean:
        fieldType = FieldType.Checkbox;
        break;
      case BasicValueType.String:
      case BasicValueType.Number:
        // 计算字段的文本在卡片中默认以单行文本展示
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

// maxLine 多行文本显示的最大行数
export const getFieldHeight = (field: IField, maxLine: number, isMobile?: boolean) => {
  const showFieldType = getShowFieldType(field);
  if (showFieldType === FieldType.Text) {
    return maxLine * EACH_TEXT_LINE_HEIGHT;
  }
  if (isMobile) return FIELD_HEIGHT_MAP_MOBILE[showFieldType] || DEFAULT_SINGLE_TEXT_HEIGHT;
  return FIELD_HEIGHT_MAP[showFieldType] || DEFAULT_SINGLE_TEXT_HEIGHT;
};

// 暂时兼容虚拟卡片，需要替换不同的 hash 高度映射，存在优化空间
export const getVietualFieldHeight = (field: IField, maxLine: number, isMobile?: boolean) => {
  const showFieldType = getShowFieldType(field);
  if (showFieldType === FieldType.Text) {
    return maxLine * (EACH_TEXT_LINE_HEIGHT - 1);
  }
  if (isMobile) return FIELD_HEIGHT_VIRTUAL_MAP_MOBILE[showFieldType] || DEFAULT_SINGLE_TEXT_HEIGHT;
  return FIELD_HEIGHT_VIRTUAL_MAP[showFieldType] || DEFAULT_SINGLE_TEXT_HEIGHT;
};

/**
 * 根据容器宽度，计算合适的卡片数量。
 */
const getCardCount = (w: number) => {
  // FIXME: 可优化
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
    // 这组隐藏，只渲染组头。
    const groupHeadRecordId = eachGroupRows[0];
    res.push({
      recordId: groupHeadRecordId,
      groupHeadRecordId,
      type: GalleryGroupItemType.GroupTitle,
    });
    // 空白占位
    [...Array((columnCount - 1))].forEach((item, index) => {
      res.push({
        recordId: `${groupHeadRecordId}_${index}`,
        groupHeadRecordId,
        type: GalleryGroupItemType.GroupHeadBlank,
      });
    });
    // 没有被折叠则需要渲染正常卡片。
    if (!groupingCollapseIds.includes(groupHeadRecordId)) {
      // 展示几行
      const cardCount = (eachGroupRows.length + (showAddCard ? 1 : 0));
      const rowCount = Math.ceil(
        cardCount / columnCount
      );
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
        [...Array(blankCardCount)].forEach((item, index) => {
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
 * 获取卡片的宽度，和单行卡片的数量
 */
export const getColumnWidthAndCount = (containerWith: number, isMobile: boolean, galleryStyle: IGalleryViewStyle) => {
  let width = containerWith - (isMobile ? 0 : PADDING_RIGHT);
  let cardWidth = 248;
  let columnCount = Math.floor(width / cardWidth);

  if (galleryStyle) {
    if (galleryStyle.isAutoLayout) {
      // 自动模式下，卡片数量和宽度是通过分辨率计算
      columnCount = getCardCount(width);
    } else {
      // 手动模式下，卡片数量来着用户配置。卡片
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
    columnCount
  };
};

export const getGalleryLinearRows = (rows: IViewRow[], canAddCard: boolean) => {
  const res: IGalleryGroupItem[] = [];
  rows.forEach((row, index) => {
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
  const searchRecordIndex = isGrouped ?
    linearRows.findIndex(item => item.recordId === searchRecordId && item.type === GalleryGroupItemType.Card) :
    _visibleRecords.findIndex(item => item.recordId === searchRecordId);
  const rowIndex = Math.floor(searchRecordIndex / columnCount);
  const columnIndex = searchRecordIndex % columnCount;
  return { rowIndex, columnIndex };
  
};

// 根据标题的上一个类型判断是否需要添加 paddingTop
export const getGroupTitlePaddingTip = (linearRows, index, rowIndex) => {
  if (rowIndex === 0) {
    return 16;
  }
  const prevItem = linearRows[index - 1];
  const paddingTop = !prevItem || (prevItem && prevItem.type === GalleryGroupItemType.GroupHeadBlank) ? PADDING_TOP - 8 : PADDING_TOP;
  return paddingTop;
};