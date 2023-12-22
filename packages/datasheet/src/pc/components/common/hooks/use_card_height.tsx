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

import { sum } from 'lodash';
import { IViewColumn, Selectors } from '@apitable/core';
import { getFieldHeight, getVietualFieldHeight, hasCover } from 'pc/components/gallery_view/utils';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';

const FIRST_FIELD_HEIGHT = 14;
const FIELD_PADDING_BOTTOM = 12;
const FIELD_TITLE_HEIGHT = 18;
const FIELD_PADDING = 8;

// Field heights in virtual lists
// Field title height, content top margin, overall content spacing, default field content height
const FIELD_TITLE_HEIGHT_VIRTUAL = 18;
const FIELD_CONTENT_TOP_SPACE = 4;
const FIELD_CONTENT_SPACE = 12;
// Single line margins for albums, multi-line margins for albums, margins for Kanban
const GALLERY_SIGNLE_ROW = 4;
const GALLERY_MULTI_ROW = 12;
const VIEW_BOARD_ROW = 8;

interface IUseCardHeightProps {
  showEmptyCover: boolean;
  // The default height of the card cover
  cardCoverHeight: number;
  multiTextMaxLine?: number;
  showEmptyField: boolean; // Show placeholder or not when record value is empty.
  coverFieldId?: string;
  isColNameVisible?: boolean;
  visibleColumns?: IViewColumn[];
  isVirtual?: boolean;
  titleHeight?: number;
  isGallery?: boolean;
}

export const useCardHeight = (props: IUseCardHeightProps) => {
  const {
    cardCoverHeight,
    showEmptyCover,
    coverFieldId,
    multiTextMaxLine = 4,
    showEmptyField,
    isColNameVisible,
    isVirtual,
    titleHeight = 22,
    isGallery,
  } = props;
  const snapshot = useAppSelector(Selectors.getSnapshot)!;
  const fieldMap = useAppSelector((state) => Selectors.getFieldMap(state, state.pageParams.datasheetId!));
  let visibleColumns = useAppSelector(Selectors.getVisibleColumns);
  visibleColumns = props.visibleColumns || visibleColumns;

  /**
   * @description Get the height of the card cover. Unlike albums, which all have the same cover height,
   * kanban needs to be calculated to show or not show depending on the actual value.
   * recordId Active null is passed in to indicate that the record is irrelevant.
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
        // 4 - single line title for album cards, 12 - multi-line attribute text for album cards, 8 - Kanban view title
        const cartHeightPadding = isGallery ? (visibleColumns.length === 1 ? GALLERY_SIGNLE_ROW : GALLERY_MULTI_ROW) : VIEW_BOARD_ROW;
        const total = visibleColumns.reduce((pre: number, cur: IViewColumn, i) => {
          // Height of header on first line of card + spacing
          if (i === 0) {
            return (pre += titleHeight + cartHeightPadding);
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
          return (pre += height);
        }, 0);

        // Handling the inner margin of the last attribute of the Kanban view
        const sub = isGallery ? 0 : VIEW_BOARD_ROW;
        return total - sub;
      }

      const fieldsHeight = visibleColumns.map((item: IViewColumn, index: number) => {
        if (index === 0) {
          return FIRST_FIELD_HEIGHT + FIELD_PADDING_BOTTOM;
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
        return (isColNameVisible ? FIELD_TITLE_HEIGHT : 0) + fieldHeight + FIELD_PADDING_BOTTOM;
      });
      return sum(fieldsHeight) + FIELD_PADDING + 2;
    }
    return FIELD_PADDING * 2;
  }

  const getCardHeight = (recordId: string | null, isMobile?: boolean) => {
    const padding = isGallery ? 0 : FIELD_PADDING;
    const cardCoverHeight = getCoverHeight(recordId);
    const cardBodyHeight = padding + getCardBodyHeight(multiTextMaxLine, recordId, isMobile);
    if (isVirtual) {
      return cardCoverHeight + cardBodyHeight + (isGallery ? 0 : padding + 2);
    }
    return cardCoverHeight + cardBodyHeight + padding * 2;
  };

  return getCardHeight;
};
