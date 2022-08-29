import { IViewColumn, Selectors } from '@vikadata/core';
import { sum } from 'lodash';
import { getFieldHeight, getVietualFieldHeight, hasCover } from 'pc/components/gallery_view/utils';
import { store } from 'pc/store';
import { useSelector } from 'react-redux';

const FIRST_FIELD_HEIGHT = 26;
const FIELD_PADDING_TOP = 4;
const FIELD_PADDING_BOTTOM = 12;
// 字段名称
const FIELD_TITLE_HEIGHT = 17;

// 虚拟列表中的字段高度
// 字段 title 高度，内容上边距，内容整体间距，默认字段内容高度
const FIELD_TITLE_HEIGHT_VIRTUAL = 18;
const FIELD_CONTENT_TOP_SPACE = 4;
const FIELD_CONTENT_SPACE = 12;
// 相册类单行内边距，相册类多行内边距，看板类内边距
const GALLERY_SIGNLE_ROW = 4;
const GALLERY_MULTI_ROW = 12;
const VIEW_BOARD_ROW = 8;

interface IUseCardHeightProps {
  showEmptyCover: boolean;
  // 卡片的封面的默认高度
  cardCoverHeight: number;
  multiTextMaxLine?: number;
  showEmptyField: boolean; // 记录值为空时显示占位还是不显示。
  coverFieldId?: string;
  isColNameVisible?: boolean;
  visibleColumns?: IViewColumn[];
  isVirtual?: boolean;
  titleHeight?: number;
  isGallery?: boolean;
}

export const useCardHeight = (props: IUseCardHeightProps) => {
  const { cardCoverHeight, showEmptyCover, coverFieldId, multiTextMaxLine = 4, showEmptyField,
    isColNameVisible, isVirtual, titleHeight = 22, isGallery } = props;
  const snapshot = useSelector(Selectors.getSnapshot)!;
  const fieldMap = useSelector(state => Selectors.getFieldMap(state, state.pageParams.datasheetId!));
  let visibleColumns = useSelector(Selectors.getVisibleColumns);
  visibleColumns = props.visibleColumns || visibleColumns;

  /**
   * @description 获取卡片封面的高度。相册和看板不同，相册的封面高度都是一样的，看板需要根据实际值来计算展示或者不展示。
   * recordId 主动传入 null 表示，记录无关。
   * @param {string} recordId
   * @returns
   */
  function getCoverHeight(recordId: string | null) {
    if (!hasCover(fieldMap!, coverFieldId)) {
      return 0;
    }
    if (hasCover(fieldMap!, coverFieldId) && !showEmptyCover) {
      if (recordId == null) {
        return cardCoverHeight;
      }
      const cv = Selectors.getCellValue(store.getState(), snapshot!, recordId, coverFieldId!);
      const isCoverCellValueEmpty = cv == null || (Array.isArray(cv) && cv.length === 0);
      return isCoverCellValueEmpty ? 0 : cardCoverHeight;
    }
    return cardCoverHeight;
  }

  /**
   * @description
   * @param {number} maxLine
   * @param {string} recordId
   * @returns
   */
  function getCardBodyHeight(maxLine: number, recordId: string | null, isMobile?: boolean) {
    if (visibleColumns.length) {
      if (isVirtual) {
        const finalTitleHeight = !isColNameVisible ? (isGallery ? 0 : -FIELD_CONTENT_TOP_SPACE) : FIELD_TITLE_HEIGHT_VIRTUAL;
        // 4 - 相册卡片单行标题，12 - 相册卡片多行属性文本，8 - 看板视图标题
        const cartHeightPadding = isGallery ? (visibleColumns.length === 1 ? GALLERY_SIGNLE_ROW : GALLERY_MULTI_ROW) : VIEW_BOARD_ROW;
        const total = visibleColumns.reduce((pre: number, cur: IViewColumn, i) => {
          // 卡片第一行的标题高度 + 间距
          if (i === 0) {
            return pre += (titleHeight + cartHeightPadding);
          }
          const field = fieldMap && fieldMap[cur.fieldId];
          if (!field) {
            return pre;
          }
          if (!showEmptyField) {
            if (recordId == null) return pre;
            const cv = Selectors.getCellValue(store.getState(), snapshot!, recordId, field.id);
            if (cv == null) {
              return pre;
            }
          }
          const fieldHeight = getVietualFieldHeight(field, maxLine, isMobile);
          const height = finalTitleHeight + fieldHeight + FIELD_CONTENT_SPACE;
          return pre += height;
        }, 0);

        // 处理看板视图的最后一个属性的内边距
        const sub = isGallery ? 0 : VIEW_BOARD_ROW;
        return total - sub;
      }

      const fieldsHeight = visibleColumns.map((item: IViewColumn, index: number) => {
        if (index === 0) {
          return FIRST_FIELD_HEIGHT + FIELD_PADDING_TOP + FIELD_PADDING_BOTTOM;
        }
        const field = fieldMap![item.fieldId];
        const fieldHeight = field ? getFieldHeight(field, maxLine, isMobile) : 0;
        if (!showEmptyField) {
          if (recordId == null) return 0;
          const cv = Selectors.getCellValue(store.getState(), snapshot!, recordId, field.id);
          if (cv == null) {
            return 0;
          }
        }
        return (isColNameVisible ? FIELD_TITLE_HEIGHT : 0) + fieldHeight + FIELD_PADDING_TOP + FIELD_PADDING_BOTTOM;
      });
      return sum(fieldsHeight);
    }
    return 8 * 2;
  }

  const getCardHeight = (recordId: string | null, isMobile?: boolean) => {
    // 兼容相册视图
    const padding = isGallery ? 0 : 8;
    const cardCoverHeight = getCoverHeight(recordId);
    const cardBodyHeight = padding + getCardBodyHeight(multiTextMaxLine, recordId, isMobile);
    if (isVirtual) {
      return cardCoverHeight + cardBodyHeight + (isGallery ? 0 : padding + 2);
    }
    return cardCoverHeight + cardBodyHeight + padding * 2;
  };

  return getCardHeight;
};
