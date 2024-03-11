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

import { get, keyBy, sortBy } from 'lodash';
import LRU from 'lru-cache';
import { colors, ThemeName } from '@apitable/components';
import {
  Api,
  ArrayValueField,
  BasicValueType,
  ButtonStyleType,
  ConfigConstant,
  DatasheetApi,
  Field,
  FieldType,
  FormulaBaseError,
  handleNullArray,
  IAttachmentValue,
  IButtonField,
  ICellValue,
  IField,
  ILookUpField,
  IMemberField,
  IMultiSelectedIds,
  ISegment,
  isGif,
  IUnitIds,
  IWorkDocValue,
  LinkField,
  LOOKUP_VALUE_FUNC_SET,
  LookUpField,
  MemberField,
  MemberType,
  ORIGIN_VALUES_FUNC_SET,
  OtherTypeUnitId,
  RollUpFuncType,
  RowHeightLevel,
  Selectors,
  Settings,
  StoreActions,
  string2Segment,
  Strings,
  SymbolAlign,
  t,
  ViewType,
} from '@apitable/core';
import { FileOutlined } from '@apitable/icons';
import { assertSignatureManager } from '@apitable/widget-sdk';
import { AutomationConstant } from 'pc/components/automation/config';
import { AvatarSize, AvatarType } from 'pc/components/common';
import { GANTT_SHORT_TASK_MEMBER_ITEM_HEIGHT } from 'pc/components/gantt_view';
import { isUnitLeave } from 'pc/components/multi_grid/cell/cell_member/member_item';
import { setColor } from 'pc/components/multi_grid/format';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { emojiUrl, getCellValueThumbSrc, renderFileIconUrl, showOriginImageThumbnail, UploadManager } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import { getDatasheetOrLoad } from 'pc/utils/get_datasheet_or_load';
import { loadRecords } from 'pc/utils/load_records';
import { getOptionNameColor, inquiryValueByKey } from '../components/cell';
import {
  GRID_CEL_ICON_GAP_SIZE,
  GRID_CELL_ABBR_MIN_WIDTH,
  GRID_CELL_ADD_ITEM_BUTTON_SIZE,
  GRID_CELL_ATTACHMENT_ITEM_MARGIN_LEFT,
  GRID_CELL_ATTACHMENT_PADDING,
  GRID_CELL_DELETE_ITEM_BUTTON_SIZE,
  GRID_CELL_LINK_ITEM_HEIGHT,
  GRID_CELL_LINK_ITEM_PADDING,
  GRID_CELL_MEMBER_ITEM_HEIGHT,
  GRID_CELL_MEMBER_ITEM_MARGIN_TOP,
  GRID_CELL_MEMBER_ITEM_PADDING_LEFT,
  GRID_CELL_MULTI_ITEM_MARGIN_LEFT,
  GRID_CELL_MULTI_ITEM_MARGIN_TOP,
  GRID_CELL_MULTI_ITEM_MIN_WIDTH,
  GRID_CELL_MULTI_PADDING_TOP,
  GRID_CELL_VALUE_PADDING,
  GRID_ICON_SMALL_SIZE,
  GRID_MEMBER_ITEM_AVATAR_MARGIN_RIGHT,
  GRID_MEMBER_ITEM_PADDING_RIGHT,
  GRID_OPTION_ITEM_HEIGHT,
  GRID_OPTION_ITEM_PADDING,
} from '../constant';
import { IRenderProps } from '../interface';
import { KonvaDrawer } from './drawer';
import { imageCache } from './image_cache';
import { IWrapTextDataProps } from './interface';

const FileOutlinedPath = FileOutlined.toString();

// Simple recognition rules are used to process single line text enhancement fields.
const isEmail = (text: string) => text && /.+@.+/.test(text);
const isPhoneNumber = (text: string) => text && /^[0-9\-()（）#+]+$/.test(text);

const calcFileWidth = (file: IAttachmentValue, ratioHeight: number) => {
  if (!(file.width && file.height)) {
    return Infinity;
  }
  if (!showOriginImageThumbnail(file)) {
    return Infinity;
  }
  const ratio = file.width / file.height;
  return ratioHeight * ratio;
};

const MAX_SHOW_LINK_IDS_COUNT = 20;

const getMaxLine = (rowHeightLevel: RowHeightLevel, viewType: ViewType) => {
  switch (rowHeightLevel) {
    case RowHeightLevel.Short:
      return 1;
    case RowHeightLevel.Medium:
      return 2;
    case RowHeightLevel.Tall:
      return viewType === ViewType.Gantt ? 2 : 4;
    case RowHeightLevel.ExtraTall:
      return 6;
  }
};

const httpCache = new LRU<string, any>(500);

const DEFAULT_RENDER_DATA = {
  width: 0,
  height: 0,
  isOverflow: false,
  renderContent: null,
};

export class CellHelper extends KonvaDrawer {
  public initStyle(field: IField, styleProps: { fontWeight: any }): void | null {
    const { type: fieldType } = field;
    const { fontWeight = 'normal' } = styleProps;

    switch (fieldType) {
      case FieldType.SingleSelect:
      case FieldType.MultiSelect:
      case FieldType.Link:
      case FieldType.OneWayLink: {
        return this.setStyle({ fontSize: 12, fontWeight });
      }
      case FieldType.Number:
      case FieldType.Percent:
      case FieldType.Currency:
      case FieldType.AutoNumber:
      case FieldType.URL:
      case FieldType.Email:
      case FieldType.Phone:
      case FieldType.Text:
      case FieldType.SingleText:
      case FieldType.DateTime:
      case FieldType.CreatedTime:
      case FieldType.LastModifiedTime:
      case FieldType.Formula:
      case FieldType.Member:
      case FieldType.Rating:
      case FieldType.CreatedBy:
      case FieldType.LastModifiedBy:
      case FieldType.Cascader:
      case FieldType.Button:
      case FieldType.WorkDoc: {
        return this.setStyle({ fontSize: 13, fontWeight });
      }
      case FieldType.LookUp: {
        const realField = (Field.bindModel(field) as any as LookUpField).getLookUpEntityField();
        const rollUpType = (field as ILookUpField).property.rollUpType || RollUpFuncType.VALUES;
        if (realField && ORIGIN_VALUES_FUNC_SET.has(rollUpType)) {
          return this.initStyle(realField, styleProps);
        }
        return this.setStyle({ fontSize: 13, fontWeight });
      }
      default:
        return null;
    }
  }

  public renderCellValue(renderProps: IRenderProps, ctx?: CanvasRenderingContext2D | undefined) {
    const { field } = renderProps;
    const fieldType = field.type;

    switch (fieldType) {
      case FieldType.SingleSelect: {
        return this.renderCellSingleSelect(renderProps, ctx);
      }
      case FieldType.MultiSelect: {
        return this.renderCellMultiSelect(renderProps, ctx);
      }
      case FieldType.Number:
      case FieldType.Percent:
      case FieldType.Currency:
      case FieldType.AutoNumber:
      case FieldType.URL:
      case FieldType.Email:
      case FieldType.Phone:
      case FieldType.Text:
      case FieldType.SingleText:
      case FieldType.Cascader: {
        return this.renderCellText(renderProps, ctx);
      }
      case FieldType.Button: {
        return this.renderCellButton(renderProps, ctx);
      }
      case FieldType.WorkDoc: {
        return this.renderCellWorkdoc(renderProps, ctx);
      }
      case FieldType.DateTime:
      case FieldType.CreatedTime:
      case FieldType.LastModifiedTime: {
        return this.renderCellDateTime(renderProps, ctx);
      }
      case FieldType.Formula: {
        return this.renderCellFormula(renderProps, ctx);
      }
      case FieldType.Checkbox: {
        return this.renderCellCheckbox(renderProps, ctx);
      }
      case FieldType.Rating: {
        return this.renderCellRating(renderProps, ctx);
      }
      case FieldType.Attachment: {
        return this.renderCellAttachment(renderProps, ctx);
      }
      case FieldType.Member:
      case FieldType.CreatedBy:
      case FieldType.LastModifiedBy: {
        return this.renderCellMember(renderProps, ctx);
      }
      case FieldType.Link:
      case FieldType.OneWayLink: {
        return this.renderCellLink(renderProps, ctx);
      }
      case FieldType.LookUp: {
        return this.renderCellLookUp(renderProps, ctx);
      }
      default:
        return null;
    }
  }

  private renderCellSingleSelect(renderProps: IRenderProps, ctx?: any) {
    const { x, y, cellValue, field, columnWidth, isActive, editable, callback, style, cacheTheme } = renderProps;
    if (cellValue == null) return DEFAULT_RENDER_DATA;
    const isOperating = isActive && editable;
    const color = cacheTheme === ThemeName.Light ? getOptionNameColor(cellValue as string, field) : colors.staticWhite0;
    const background = inquiryValueByKey('color', cellValue as string, field, cacheTheme);
    const itemName = inquiryValueByKey('name', cellValue as string, field, cacheTheme);
    const initPadding = GRID_CELL_VALUE_PADDING;
    const maxTextWidth = isOperating
      ? columnWidth - 2 * (GRID_CELL_VALUE_PADDING + GRID_OPTION_ITEM_PADDING) - GRID_CELL_DELETE_ITEM_BUTTON_SIZE - 12
      : columnWidth - 2 * (GRID_CELL_VALUE_PADDING + GRID_OPTION_ITEM_PADDING);
    const { text, textWidth } = this.textEllipsis({
      text: itemName,
      maxWidth: columnWidth && maxTextWidth,
      fontSize: 12,
    });
    const width = Math.max(
      isOperating ? textWidth + 2 * GRID_OPTION_ITEM_PADDING + GRID_CELL_DELETE_ITEM_BUTTON_SIZE + 12 : textWidth + 2 * GRID_OPTION_ITEM_PADDING,
      GRID_CELL_MULTI_ITEM_MIN_WIDTH,
    );
    if (ctx) {
      ctx.save();
      ctx.globalAlpha = 1;
      const stroke = style?.bgColor === background ? colors.defaultBg : '';
      this.label({
        x: x + initPadding,
        y: y + GRID_CELL_MULTI_PADDING_TOP,
        width,
        height: GRID_OPTION_ITEM_HEIGHT,
        text,
        background,
        color,
        radius: 16,
        padding: GRID_OPTION_ITEM_PADDING,
        fontSize: 12,
        stroke,
        textAlign: 'center',
      });
      ctx.restore();
      callback?.({ width: width + initPadding });
    }

    const renderContent = {
      id: cellValue,
      x: GRID_CELL_VALUE_PADDING,
      y: GRID_CELL_MULTI_PADDING_TOP,
      width,
      height: GRID_OPTION_ITEM_HEIGHT,
      text,
      style: {
        color,
        background,
      },
    };
    return {
      width: columnWidth,
      height: GRID_OPTION_ITEM_HEIGHT,
      isOverflow: false,
      renderContent,
    };
  }

  private renderCellButton(renderProps: IRenderProps, ctx?: any) {
    const { x, y, rowHeight, rowHeightLevel, columnWidth, isActive, callback } = renderProps;

    const GRID_OPTION_ITEM_HEIGHT = 22;
    const buttonField = renderProps.field as IButtonField;
    const cellValue = [1];
    const isOperating = isActive;
    const GRID_CELL_VALUE_PADDING = 0;
    let currentX = GRID_CELL_VALUE_PADDING;
    let currentY = GRID_CELL_MULTI_PADDING_TOP;
    const isShortHeight = rowHeightLevel === RowHeightLevel.Short;
    const maxHeight = isActive ? 130 - GRID_CELL_MULTI_PADDING_TOP : rowHeight - GRID_CELL_MULTI_PADDING_TOP;
    const maxTextWidth = columnWidth - 2 * (GRID_CELL_VALUE_PADDING + GRID_OPTION_ITEM_PADDING) - GRID_ICON_SMALL_SIZE;
    const renderDataList: any[] = [];
    const listCount = cellValue.length;
    let isOverflow = false;

    const isValid = true;

    const defaultColor = buttonField.property.style.color ? setColor(buttonField.property.style.color, renderProps.cacheTheme) : colors.defaultBg;
    let bg = '';
    if (buttonField.property.style.type === ButtonStyleType.Background) {
      if (isValid) {
        bg = defaultColor;
      } else {
        bg = colors.bgControlsDisabled;
      }
    }

    for (let index = 0; index < listCount; index++) {
      let color = isValid ? defaultColor : colors.textCommonDisabled;
      if (buttonField.property.style.type === ButtonStyleType.Background) {
        if (isValid) {
          color = colors.textStaticPrimary;
          if (renderProps.cacheTheme === 'dark') {
            if (buttonField.property.style.color === AutomationConstant.whiteColor) {
              color = colors.textReverseDefault;
            }
          }
        } else {
          color = colors.textCommonDisabled;
        }
      }
      const background = bg;

      const itemName = buttonField.property.text;
      let realMaxTextWidth = maxTextWidth;

      if (index === 0 && isOperating) {
        const operatingMaxWidth = maxTextWidth - 6;
        // item no space to display, then perform a line feed
        if (operatingMaxWidth <= 10) {
          currentX = GRID_CELL_VALUE_PADDING;
          currentY += GRID_OPTION_ITEM_HEIGHT + GRID_CELL_MULTI_ITEM_MARGIN_TOP;
        } else {
          realMaxTextWidth = operatingMaxWidth;
        }
      }
      const {
        text: renderText,
        textWidth,
        isEllipsis,
      } = this.textEllipsis({
        text: itemName,
        maxWidth: columnWidth && realMaxTextWidth,
        fontSize: 12,
      });
      // GRID_ICON_SMALL_SIZE
      const itemWidth = Math.max(textWidth + 2 * GRID_OPTION_ITEM_PADDING - (isEllipsis ? 8 : 0), GRID_CELL_MULTI_ITEM_MIN_WIDTH);

      if (columnWidth != null) {
        // In the inactive state, subsequent items are not rendered when the line width is exceeded
        if (!isActive && currentX >= columnWidth) break;
        // If it is not the last line in the inactive state, perform a line feed on the overflow item
        if (
          !isActive &&
          !isShortHeight &&
          currentY + GRID_OPTION_ITEM_HEIGHT < maxHeight &&
          currentX + itemWidth > columnWidth - GRID_CELL_VALUE_PADDING
        ) {
          currentX = GRID_CELL_VALUE_PADDING;
          currentY += GRID_OPTION_ITEM_HEIGHT + GRID_CELL_MULTI_ITEM_MARGIN_TOP;
        }
        if (isActive && currentX + itemWidth > columnWidth - GRID_CELL_VALUE_PADDING) {
          currentX = GRID_CELL_VALUE_PADDING;
        }
        if (isActive && currentY >= maxHeight) isOverflow = true;
      }

      const itemY = y + currentY;
      if (ctx && !isActive) {
        const itemX1 = x + (columnWidth - itemWidth) / 2;
        this.label({
          x: itemX1,
          y: itemY,
          width: itemWidth,
          height: GRID_OPTION_ITEM_HEIGHT,
          background,
          color,
          radius: 2,
          padding: GRID_OPTION_ITEM_PADDING,
          text: renderText,
          fontSize: 12,
          // textAlign: 'right',
        });
      }

      renderDataList.push({
        x: currentX,
        y: currentY,
        width: itemWidth,
        height: GRID_OPTION_ITEM_HEIGHT,
        text: renderText,
        style: {
          background,
          color,
        },
      });
      currentX += itemWidth + GRID_CELL_MULTI_ITEM_MARGIN_LEFT;
    }

    callback?.({ width: currentX - GRID_CELL_MULTI_ITEM_MARGIN_LEFT });
    return {
      width: columnWidth,
      height: currentY + GRID_OPTION_ITEM_HEIGHT + GRID_CELL_MULTI_ITEM_MARGIN_TOP,
      renderContent: renderDataList,
      isOverflow,
    };
  }

  private renderCellWorkdoc(renderProps: IRenderProps, ctx?: any) {
    const { x, y, cellValue, rowHeight, rowHeightLevel, columnWidth, isActive, callback } = renderProps;
    if (!(cellValue as IWorkDocValue[])?.length || !Array.isArray(cellValue)) return DEFAULT_RENDER_DATA;
    const isOperating = isActive;
    let currentX = GRID_CELL_VALUE_PADDING;
    let currentY = GRID_CELL_MULTI_PADDING_TOP;
    const maxHeight = isActive ? 130 - GRID_CELL_MULTI_PADDING_TOP : rowHeight - GRID_CELL_MULTI_PADDING_TOP;
    const maxTextWidth = columnWidth - 2 * GRID_CELL_VALUE_PADDING - GRID_ICON_SMALL_SIZE - GRID_CEL_ICON_GAP_SIZE;
    const renderDataList: any[] = [];
    const listCount = cellValue.length;
    let isOverflow = false;

    for (let index = 0; index < listCount; index++) {
      const docItem = cellValue[index] as IWorkDocValue;
      const color = colors.textBrandDefault;
      const background = colors.bgBrandLightDefault;
      const itemName = docItem.title || t(Strings.workdoc_unnamed);
      let realMaxTextWidth = maxTextWidth;

      if (index === 0 && isOperating) {
        const operatingMaxWidth = maxTextWidth - 6;
        // item no space to display, then perform a line feed
        if (operatingMaxWidth <= 10) {
          currentY += GRID_OPTION_ITEM_HEIGHT + GRID_CELL_MULTI_ITEM_MARGIN_TOP;
        } else {
          realMaxTextWidth = operatingMaxWidth;
        }
      }
      const {
        text: renderText,
        textWidth,
        isEllipsis,
      } = this.textEllipsis({
        text: itemName,
        maxWidth: columnWidth && realMaxTextWidth,
        fontSize: 12,
      });
      const itemWidth = Math.max(
        textWidth + 2 * GRID_OPTION_ITEM_PADDING + GRID_ICON_SMALL_SIZE - (isEllipsis ? 8 : 0),
        GRID_CELL_MULTI_ITEM_MIN_WIDTH,
      );

      if (columnWidth != null) {
        // In the inactive state, subsequent items are not rendered when the line width is exceeded
        if (!isActive && currentX >= columnWidth) break;
        if (isActive && currentY >= maxHeight) isOverflow = true;
      }

      const itemX = x + currentX;
      const itemY = y + currentY;
      if (ctx && !isActive) {
        this.label({
          x: itemX,
          y: itemY,
          width: itemWidth,
          height: GRID_OPTION_ITEM_HEIGHT,
          background,
          color,
          radius: 4,
          padding: 6,
          text: renderText,
          fontSize: 12,
          textAlign: 'right',
        });
        this.path({
          x: itemX + 4,
          y: itemY + 2,
          data: FileOutlinedPath,
          size: 12,
          fill: colors.textBrandDefault,
        });
      }

      renderDataList.push({
        x: currentX,
        y: currentY,
        width: itemWidth,
        height: GRID_OPTION_ITEM_HEIGHT,
        text: renderText,
        style: {
          background,
          color,
        },
      });
      currentX += itemWidth + GRID_CELL_MULTI_ITEM_MARGIN_LEFT;
    }

    callback?.({ width: currentX - GRID_CELL_MULTI_ITEM_MARGIN_LEFT });
    return {
      width: columnWidth,
      height: currentY + GRID_OPTION_ITEM_HEIGHT + GRID_CELL_MULTI_ITEM_MARGIN_TOP,
      renderContent: renderDataList,
      isOverflow,
    };
  }

  private renderCellMultiSelect(renderProps: IRenderProps, ctx?: any) {
    const { x, y, field, cellValue, rowHeight, rowHeightLevel, columnWidth, isActive, editable, callback, cacheTheme } = renderProps;
    if (!(cellValue as IMultiSelectedIds)?.length || !Array.isArray(cellValue)) return DEFAULT_RENDER_DATA;
    const isOperating = editable && isActive;
    let currentX = isOperating ? GRID_CELL_VALUE_PADDING + GRID_CELL_ADD_ITEM_BUTTON_SIZE + 4 : GRID_CELL_VALUE_PADDING;
    let currentY = GRID_CELL_MULTI_PADDING_TOP;
    const isShortHeight = rowHeightLevel === RowHeightLevel.Short;
    const maxHeight = isActive ? 130 - GRID_CELL_MULTI_PADDING_TOP : rowHeight - GRID_CELL_MULTI_PADDING_TOP;
    const maxTextWidth = isOperating
      ? columnWidth - 2 * (GRID_CELL_VALUE_PADDING + GRID_OPTION_ITEM_PADDING) - GRID_CELL_DELETE_ITEM_BUTTON_SIZE - 12
      : columnWidth - 2 * (GRID_CELL_VALUE_PADDING + GRID_OPTION_ITEM_PADDING);
    const renderDataList: any[] = [];
    const listCount = cellValue.length;
    let isOverflow = false;

    for (let index = 0; index < listCount; index++) {
      const optId = cellValue[index];
      const color = cacheTheme === ThemeName.Light ? getOptionNameColor(optId as string, field) : colors.textStaticPrimary;
      const background = inquiryValueByKey('color', optId as string, field, cacheTheme);
      const itemName = inquiryValueByKey('name', optId as string, field, cacheTheme);
      let realMaxTextWidth = maxTextWidth;
      if (index === 0 && isOperating) {
        const operatingMaxWidth = maxTextWidth - (GRID_CELL_ADD_ITEM_BUTTON_SIZE + 4);
        // item no space to display, then perform a line feed
        if (operatingMaxWidth <= 10) {
          currentX = GRID_CELL_VALUE_PADDING;
          currentY += GRID_OPTION_ITEM_HEIGHT + GRID_CELL_MULTI_ITEM_MARGIN_TOP;
        } else {
          realMaxTextWidth = operatingMaxWidth;
        }
      }
      const { text: renderText, textWidth } = this.textEllipsis({
        text: itemName,
        maxWidth: columnWidth && realMaxTextWidth,
        fontSize: 12,
      });
      const itemWidth = Math.max(
        isOperating ? textWidth + 2 * GRID_OPTION_ITEM_PADDING + GRID_CELL_DELETE_ITEM_BUTTON_SIZE + 12 : textWidth + 2 * GRID_OPTION_ITEM_PADDING,
        GRID_CELL_MULTI_ITEM_MIN_WIDTH,
      );

      if (columnWidth != null) {
        // In the inactive state, subsequent items are not rendered when the line width is exceeded
        if (!isActive && currentX >= columnWidth) break;
        // If it is not the last line in the inactive state, perform a line feed on the overflow item
        if (
          !isActive &&
          !isShortHeight &&
          currentY + GRID_OPTION_ITEM_HEIGHT < maxHeight &&
          currentX + itemWidth > columnWidth - GRID_CELL_VALUE_PADDING
        ) {
          currentX = GRID_CELL_VALUE_PADDING;
          currentY += GRID_OPTION_ITEM_HEIGHT + GRID_CELL_MULTI_ITEM_MARGIN_TOP;
        }
        if (isActive && currentX + itemWidth > columnWidth - GRID_CELL_VALUE_PADDING) {
          currentX = GRID_CELL_VALUE_PADDING;
          currentY += GRID_OPTION_ITEM_HEIGHT + GRID_CELL_MULTI_ITEM_MARGIN_TOP;
        }
        if (isActive && currentY >= maxHeight) isOverflow = true;
      }

      const itemX = x + currentX;
      const itemY = y + currentY;
      if (ctx && !isActive) {
        this.label({
          x: itemX,
          y: itemY,
          width: itemWidth,
          height: GRID_OPTION_ITEM_HEIGHT,
          background,
          color,
          radius: 16,
          padding: GRID_OPTION_ITEM_PADDING,
          text: renderText,
          fontSize: 12,
          textAlign: 'center',
        });
      }

      renderDataList.push({
        x: currentX,
        y: currentY,
        width: itemWidth,
        height: GRID_OPTION_ITEM_HEIGHT,
        text: renderText,
        style: {
          background,
          color,
        },
      });
      currentX += itemWidth + GRID_CELL_MULTI_ITEM_MARGIN_LEFT;
    }

    callback?.({ width: currentX - GRID_CELL_MULTI_ITEM_MARGIN_LEFT });
    return {
      width: columnWidth,
      height: currentY + GRID_OPTION_ITEM_HEIGHT + GRID_CELL_MULTI_ITEM_MARGIN_TOP,
      renderContent: renderDataList,
      isOverflow,
    };
  }

  private renderCellText(renderProps: IRenderProps, ctx?: any) {
    const { x, y, cellValue, field, columnWidth, rowHeightLevel, isActive, style, callback, viewType = ViewType.Grid, realField } = renderProps;

    const generateRenderText = (): string | null => {
      if (cellValue != null && cellValue instanceof FormulaBaseError) return cellValue?.message;

      if (field.type === FieldType.URL) {
        return Field.bindModel(field).cellValueToTitle(cellValue);
      }

      return Field.bindModel(field).cellValueToString(cellValue);
    };

    let renderText: string | null = generateRenderText();

    if (renderText == null) return DEFAULT_RENDER_DATA;

    const isNumberField =
      Field.bindModel(field).basicValueType === BasicValueType.Number ||
      (Field.bindModel(field) as any as ArrayValueField).innerBasicValueType === BasicValueType.Number;
    const isComputedField = Field.bindModel(field).isComputed;
    const isFromGantt = !columnWidth && !isActive;
    const isSingleLine = (rowHeightLevel === RowHeightLevel.Short || !columnWidth) && !isActive;
    const fieldType = field.type;
    const realFieldType = realField?.type;
    const isTextField = (!isNumberField && !isComputedField) || realFieldType === FieldType.URL;

    if (isTextField && isSingleLine) {
      renderText = renderText.replace(/\r|\n/g, ' ');
    }

    let originValue = isTextField ? (cellValue as ISegment[]) : null;
    // The formula needs to be segmented to show the url feature enhancement
    if (fieldType === FieldType.Formula) {
      originValue = string2Segment(renderText);
    }

    let isLinkSplit = false;
    // Lookup url enhancement
    if (fieldType === FieldType.LookUp) {
      const rollUpType = (field as ILookUpField).property.rollUpType || RollUpFuncType.VALUES;
      // Segmentation is required for the string/single multi-line text as-is case
      if (
        LOOKUP_VALUE_FUNC_SET.has(rollUpType) ||
        (ORIGIN_VALUES_FUNC_SET.has(rollUpType) && (realFieldType === FieldType.SingleText || realFieldType === FieldType.Text))
      ) {
        originValue = string2Segment(renderText);
      }
      // For the as-is display, a flag needs to be set to split the reference of multiple URL field type values
      if (ORIGIN_VALUES_FUNC_SET.has(rollUpType) && realFieldType === FieldType.URL) {
        originValue = cellValue as ISegment[];
        isLinkSplit = true;
      }
    }

    const favicon = field.property?.isRecogURLFlag ? get(cellValue, '0.favicon', '') : '';

    const color = style?.color || colors.firstLevelText;
    const textAlign = style?.textAlign || (isNumberField && columnWidth ? 'right' : 'left');
    const fontWeight = style?.fontWeight;
    const textMaxWidth = columnWidth - 2 * GRID_CELL_VALUE_PADDING - (favicon ? 20 : 0) - (isActive && field.type === FieldType.URL ? 16 : 0);
    const renderX = textAlign === 'right' ? x + columnWidth - GRID_CELL_VALUE_PADDING : x + GRID_CELL_VALUE_PADDING;
    const renderY = y + 10;
    let linkEnable = Boolean(renderText);
    switch (field.type) {
      case FieldType.URL:
        linkEnable = true; // Recognized as URL regardless of compliance
        break;
      case FieldType.Email:
        linkEnable = Boolean(linkEnable && isEmail(renderText));
        break;
      case FieldType.Phone:
        linkEnable = Boolean(linkEnable && renderText && isPhoneNumber(renderText));
        break;
      default:
        linkEnable = false;
    }
    const textDecoration = linkEnable ? 'underline' : 'none';
    let textHeight = 24;
    let textData: IWrapTextDataProps | null = null;

    if (isNumberField || isFromGantt || fieldType === FieldType.AutoNumber) {
      const { text, textWidth } = this.textEllipsis({
        text: renderText,
        maxWidth: columnWidth && textMaxWidth,
        fontWeight,
      });
      if (ctx) {
        let pureText = text;
        const isCurrencyAndAlignLeft = fieldType === FieldType.Currency && field.property.symbolAlign === SymbolAlign.left;
        if (isCurrencyAndAlignLeft && columnWidth) {
          const symbol = field.property.symbol;
          pureText = pureText.replace(symbol, '');
          this.text({
            x: x + GRID_CELL_VALUE_PADDING,
            y: renderY,
            text: symbol,
            fillStyle: color,
            fontWeight,
            textDecoration,
          });
        }

        this.text({
          x: renderX,
          y: renderY,
          text: pureText,
          textAlign,
          fillStyle: color,
          fontWeight,
          textDecoration,
        });
      }
      callback?.({ width: textWidth + GRID_CELL_VALUE_PADDING });
    } else {
      const result = this.wrapText({
        x: renderX,
        y: renderY,
        text: renderText,
        favicon,
        maxWidth: textMaxWidth,
        maxRow: isActive ? Infinity : getMaxLine(rowHeightLevel, viewType),
        lineHeight: 24,
        textAlign,
        fillStyle: color,
        fontWeight,
        textDecoration,
        originValue,
        isLinkSplit,
        fieldType,
        needDraw: !isActive,
      });
      textHeight = result.height;
      textData = result.data;
    }

    const renderContent = {
      x: GRID_CELL_VALUE_PADDING,
      y: GRID_CELL_VALUE_PADDING,
      width: textMaxWidth,
      height: textHeight,
      text: renderText,
      favicon,
      textData,
      style: {
        ...style,
        textAlign,
        textDecoration,
      },
    };
    return {
      width: columnWidth,
      height: textHeight + GRID_CELL_VALUE_PADDING,
      isOverflow: textHeight > 130,
      renderContent,
    };
  }

  private renderCellDateTime(renderProps: IRenderProps, ctx?: any) {
    const { x, y, cellValue, field, columnWidth, style, callback } = renderProps;
    const cellString = Field.bindModel(field).cellValueToString(cellValue);
    const [date, time, timeRule, abbr] = cellString ? cellString.split(' ') : [];
    let cellText = date;
    let abbrWidth = 0;

    if (time != null) {
      cellText = `${date} ${time}`;
    }
    if (timeRule != null) {
      if (abbr != null) {
        cellText = `${date} ${time} ${timeRule} ${abbr}`;
        abbrWidth = GRID_CELL_ABBR_MIN_WIDTH;
      } else {
        cellText = `${date} ${time} ${timeRule}`;
      }
    }

    if (cellText == null) return DEFAULT_RENDER_DATA;

    const textMaxWidth = columnWidth - 2 * GRID_CELL_VALUE_PADDING - abbrWidth;
    const { text, textWidth } = this.textEllipsis({ text: cellText, maxWidth: columnWidth && textMaxWidth });
    if (ctx) {
      const color = style?.color || colors.firstLevelText;
      this.text({
        x: x + GRID_CELL_VALUE_PADDING,
        y: y + GRID_CELL_VALUE_PADDING,
        text,
        fillStyle: color,
        fontWeight: style?.fontWeight,
      });
      callback?.({ width: textWidth + GRID_CELL_VALUE_PADDING });
    }

    const renderContent = {
      x: GRID_CELL_VALUE_PADDING,
      y: GRID_CELL_VALUE_PADDING,
      width: textMaxWidth,
      height: 24,
      text: text,
      style,
    };

    return {
      width: columnWidth,
      height: 24,
      isOverflow: false,
      renderContent,
    };
  }

  private renderCellCheckbox(renderProps: IRenderProps, ctx?: CanvasRenderingContext2D | undefined) {
    const { x, y, field, cellValue, columnWidth, callback, style, isActive } = renderProps;
    const { isComputed } = Field.bindModel(field);
    const icon = isComputed ? ConfigConstant.DEFAULT_CHECK_ICON : field.property.icon;
    const iconId = typeof icon === 'string' ? icon : icon.id;
    const iconUrl = emojiUrl(iconId) as string;
    const isChecked = Boolean(cellValue);

    if (ctx && iconUrl && (isChecked || isActive)) {
      const offsetX = columnWidth ? (columnWidth - ConfigConstant.CELL_EMOJI_SIZE) / 2 : GRID_CELL_VALUE_PADDING;
      const realX = style?.textAlign === 'left' ? 10 : offsetX;
      const isChecked = Boolean(cellValue);
      this.image({
        url: iconUrl,
        x: x + realX,
        y: y + 7,
        width: ConfigConstant.CELL_EMOJI_SIZE,
        height: ConfigConstant.CELL_EMOJI_SIZE,
        opacity: isChecked ? 1 : 0.2,
      });
      callback?.({ width: ConfigConstant.CELL_EMOJI_SIZE + GRID_CELL_VALUE_PADDING });
    }
  }

  private renderCellMultiCheckbox(renderProps: IRenderProps, ctx?: any) {
    const { x, y, field, cellValue, columnWidth, callback } = renderProps;

    if (ctx && cellValue != null) {
      const { isComputed } = Field.bindModel(field);
      const icon = isComputed ? ConfigConstant.DEFAULT_CHECK_ICON : field.property.icon;
      const iconId = typeof icon === 'string' ? icon : icon.id;
      const iconUrl = emojiUrl(iconId) as string;
      let offsetX = GRID_CELL_VALUE_PADDING;

      (cellValue as boolean[])
        .filter((i) => i)
        .map((_, index) => {
          if (index > 0) offsetX += ConfigConstant.CELL_EMOJI_SIZE + 4;
          if (columnWidth && offsetX >= columnWidth) return;
          this.image({
            url: iconUrl,
            x: x + offsetX,
            y: y + 7,
            width: ConfigConstant.CELL_EMOJI_SIZE,
            height: ConfigConstant.CELL_EMOJI_SIZE,
          });
        });
      callback?.({ width: offsetX + ConfigConstant.CELL_EMOJI_SIZE });
    }
  }

  private renderCellRating(renderProps: IRenderProps, ctx?: CanvasRenderingContext2D | undefined) {
    const { x, y, field, cellValue: _cellValue, callback } = renderProps;
    const { icon, max } = field.property;
    const cellValue = (_cellValue as number) || 0;
    const getTransValue = (): number => {
      const hasValue = Boolean(cellValue);
      if (hasValue) {
        const v = Math.round(cellValue);
        if (v >= max) return max;
        return v;
      }
      return 0;
    };
    // Scoring numbers converted from other cells, possibly as floating point numbers
    const transValue = getTransValue();
    const transMax = max + 1;
    const iconId = typeof icon === 'string' ? icon : icon.id;
    const iconUrl = emojiUrl(iconId) as string;
    const size = ConfigConstant.CELL_EMOJI_SIZE;

    callback?.({ width: transValue * 20 + GRID_CELL_VALUE_PADDING });
    return [...Array(transMax).keys()].splice(1).map((item, index) => {
      const checked = item <= transValue;
      const iconX = index * 20 + GRID_CELL_VALUE_PADDING;
      const iconY = 7;

      if (ctx && checked) {
        this.image({
          url: iconUrl,
          x: x + iconX,
          y: y + iconY,
          width: size,
          height: size,
        });
      }

      return {
        x: iconX,
        y: iconY,
        width: size,
        height: size,
        checked,
      };
    });
  }

  private renderCellAttachment(renderProps: IRenderProps, ctx?: CanvasRenderingContext2D | undefined) {
    const { x, y, cellValue, rowHeight, columnWidth, isActive, editable, callback, recordId, field } = renderProps;
    const loadedList: IAttachmentValue[] = (cellValue as IAttachmentValue[]) || [];
    const cellId = UploadManager.getCellId(recordId, field.id);
    const uploadManager = resourceService.instance?.uploadManager;
    const loadingList = uploadManager ? uploadManager.get(cellId) : [];
    if (!loadedList?.length && !loadingList.length) return DEFAULT_RENDER_DATA;
    const fileList: Array<IAttachmentValue | ReturnType<typeof uploadManager.get>[0]> = [...loadedList, ...loadingList];
    const height = rowHeight - GRID_CELL_ATTACHMENT_PADDING;
    const isOperating = editable && isActive;
    const initPadding = isOperating ? GRID_CELL_VALUE_PADDING + GRID_CELL_ADD_ITEM_BUTTON_SIZE + 4 : GRID_CELL_VALUE_PADDING;
    let currentX = initPadding;
    const currentY = GRID_CELL_ATTACHMENT_PADDING / 2;
    const renderDataList: any[] = [];
    const listCount = fileList.length;

    for (let i = 0; i < listCount; i++) {
      const file = fileList[i];
      let imgUrl = '';
      // The attachment being uploaded uses a placeholder image of the corresponding type as loading
      if ('fileId' in file) {
        const { name, type } = file.file;
        imgUrl = renderFileIconUrl({ name, type }) as any as string;
      } else {
        const token = assertSignatureManager.getAssertSignatureUrl(file.token);
        const preview = assertSignatureManager.getAssertSignatureUrl(file.preview || '');

        if (!token || (file.preview && !preview)) {
          continue;
        }

        // The icons in the cell are scaled
        imgUrl = getCellValueThumbSrc(
          { ...file, token, preview },
          {
            h: height * (window.devicePixelRatio || 1),
            formatToJPG: isGif({ name: file.name, type: file.mimeType }),
          },
        );
      }
      const name = imgUrl;
      const img = imageCache.getImage(name);

      if (img == null) {
        imageCache.loadImage(name, imgUrl);
        continue;
      }

      const imageWidth = img === false ? 1 : img.width;
      const imageHeight = img === false ? 1 : img.height;
      const width = calcFileWidth(file as unknown as IAttachmentValue, height);
      const aspectRatio = Math.min(width / imageWidth, height / imageHeight);
      const finalWidth = Math.ceil(aspectRatio * imageWidth);
      const finalHeight = Math.ceil(aspectRatio * imageHeight);
      if (ctx) {
        img && ctx.drawImage(img, x + currentX, y + currentY, finalWidth, finalHeight);
        this.line({
          x: x + currentX - 1,
          y: y + currentY - 1,
          points: [0, 0, finalWidth + 2, 0, finalWidth + 2, finalHeight + 2, 0, finalHeight + 2],
          closed: true,
          stroke: colors.lineColor,
        });
      }

      renderDataList.push({
        x: currentX,
        y: currentY,
        width: finalWidth,
        height: finalHeight,
        url: imgUrl,
        text: (file as unknown as IAttachmentValue).name,
      });
      currentX += finalWidth + GRID_CELL_ATTACHMENT_ITEM_MARGIN_LEFT;
      if (columnWidth != null && currentX >= columnWidth) break;
    }

    callback?.({ width: currentX - GRID_CELL_ATTACHMENT_ITEM_MARGIN_LEFT });
    return {
      width: columnWidth || currentX - GRID_CELL_MULTI_ITEM_MARGIN_LEFT,
      height: rowHeight,
      renderContent: renderDataList,
      isOverflow: false,
    };
  }

  private renderCellMember(renderProps: IRenderProps, ctx?: CanvasRenderingContext2D | undefined) {
    const {
      x,
      y,
      field,
      cellValue: _cellValue,
      rowHeight,
      columnWidth,
      rowHeightLevel,
      isActive,
      editable,
      callback,
      unitTitleMap,
      cacheTheme,
    } = renderProps;
    const isMemberField = field.type === FieldType.Member;
    const cellValue = isMemberField
      ? MemberField.polyfillOldData((_cellValue as IUnitIds)?.flat())
      : [_cellValue as IUnitIds].flat().filter((v) => v);

    if (!cellValue?.length) return DEFAULT_RENDER_DATA;

    const isShortHeight = rowHeightLevel === RowHeightLevel.Short;
    const isFromGanttShortHeight = !columnWidth && isShortHeight;
    const avatarSize = isFromGanttShortHeight ? AvatarSize.Size16 : AvatarSize.Size20;
    const itemHeight = isFromGanttShortHeight ? GANTT_SHORT_TASK_MEMBER_ITEM_HEIGHT : GRID_CELL_MEMBER_ITEM_HEIGHT;
    const isOperating = editable && isActive;
    const isMulti = isMemberField && (field as IMemberField).property.isMulti;
    const initPadding = isOperating
      ? isMulti
        ? GRID_CELL_VALUE_PADDING + GRID_CELL_ADD_ITEM_BUTTON_SIZE + 4
        : GRID_CELL_VALUE_PADDING
      : GRID_CELL_VALUE_PADDING;
    let currentX = initPadding;
    let currentY = isFromGanttShortHeight ? GRID_CELL_MULTI_ITEM_MARGIN_TOP + 2 : GRID_CELL_MULTI_ITEM_MARGIN_TOP;
    const itemOtherWidth = avatarSize + GRID_CELL_MEMBER_ITEM_PADDING_LEFT + GRID_MEMBER_ITEM_PADDING_RIGHT + GRID_MEMBER_ITEM_AVATAR_MARGIN_RIGHT;
    const maxHeight = isActive ? 130 - GRID_CELL_MULTI_PADDING_TOP : rowHeight - GRID_CELL_MULTI_PADDING_TOP;
    const maxTextWidth = isOperating
      ? columnWidth - 2 * GRID_CELL_VALUE_PADDING - itemOtherWidth - GRID_CELL_DELETE_ITEM_BUTTON_SIZE - 12
      : columnWidth - 2 * GRID_CELL_VALUE_PADDING - itemOtherWidth;

    const state = store.getState();
    const unitMap = isMemberField ? Selectors.getUnitMap(state) : Selectors.getUserMap(state);
    const missInfoUnitIds: string[] = cellValue.filter((v) => {
      return !unitMap?.[v] && v !== OtherTypeUnitId.Alien;
    });
    const cacheKey = missInfoUnitIds.length ? sortBy(missInfoUnitIds).join(',') : null;

    // Handling missing Unit information
    if (cacheKey && !httpCache.has(cacheKey)) {
      const { shareId, templateId, datasheetId } = state.pageParams;

      httpCache.set(cacheKey, true);
      if (isMemberField) {
        const linkId = shareId || templateId;
        Api.loadOrSearch({ unitIds: cacheKey, linkId })
          .then((res) => {
            const {
              data: { data: resData, success },
            } = res;
            if (!resData.length || !success) return;
            store.dispatch(StoreActions.updateUnitMap(keyBy(resData, 'unitId')));
          })
          .finally(() => httpCache.del(cacheKey));
      } else {
        DatasheetApi.fetchUserList(datasheetId!, cellValue as string[])
          .then((res) => {
            const {
              data: { data: resData, success },
            } = res as any;
            if (!resData?.length || !success) return;
            store.dispatch(StoreActions.updateUserMap(keyBy(resData, 'userId')));
          })
          .finally(() => httpCache.del(cacheKey));
      }
    }

    const renderDataList: any[] = [];
    const listCount = cellValue.length;
    let isOverflow = false;

    for (let index = 0; index < listCount; index++) {
      // The member is unitId, the modifier and creator is userId
      const unitOrUserId = cellValue[index];
      let unitInfo = unitMap?.[unitOrUserId];
      const title = unitTitleMap?.[unitInfo?.unitId];

      // Special treatment for anonymous people
      if (unitOrUserId === OtherTypeUnitId.Alien) {
        unitInfo = {
          type: MemberType.Member,
          uuid: OtherTypeUnitId.Alien,
          unitId: OtherTypeUnitId.Alien,
          avatar: `${getEnvVariables().QNY1}${Settings.datasheet_unlogin_user_avatar.value}`,
          name: t(Strings.anonymous),
          isActive: true,
          isSelf: true,
        };
      }
      if (!unitInfo) continue;
      const { name, type, avatar, nickName, avatarColor } = unitInfo as any;

      let realMaxTextWidth = maxTextWidth < 0 ? 0 : maxTextWidth;
      if (index === 0 && isOperating) {
        const operatingMaxWidth = maxTextWidth - (GRID_CELL_ADD_ITEM_BUTTON_SIZE + 4);
        // item No space to display, then perform a line feed
        if (operatingMaxWidth <= 20) {
          currentX = GRID_CELL_VALUE_PADDING;
          currentY += GRID_OPTION_ITEM_HEIGHT + GRID_CELL_MULTI_ITEM_MARGIN_TOP;
        } else {
          realMaxTextWidth = operatingMaxWidth;
        }
      }

      const { text, textWidth: primaryWidth } = this.textEllipsis({
        text: name,
        maxWidth: columnWidth && realMaxTextWidth,
      });

      const itemNameWidth = primaryWidth;

      const itemWidth = isOperating ? itemNameWidth + itemOtherWidth + GRID_CELL_DELETE_ITEM_BUTTON_SIZE + 12 : itemNameWidth + itemOtherWidth;

      if (columnWidth != null) {
        // In the inactive state, subsequent items are not rendered when the line width is exceeded
        if (!isActive && currentX >= columnWidth) break;
        // If it is not the last line in the inactive state, perform a line feed on the overflow item
        if (!isActive && !isShortHeight && currentY + itemHeight < maxHeight && currentX + itemWidth > columnWidth - GRID_CELL_VALUE_PADDING) {
          currentX = GRID_CELL_VALUE_PADDING;
          currentY += itemHeight + GRID_CELL_MEMBER_ITEM_MARGIN_TOP;
        }
        if (isActive && currentX + itemWidth > columnWidth - GRID_CELL_VALUE_PADDING) {
          currentX = GRID_CELL_VALUE_PADDING;
          currentY += itemHeight + GRID_CELL_MEMBER_ITEM_MARGIN_TOP;
        }
        if (isActive && currentY >= maxHeight) isOverflow = true;
      }

      if (ctx && !isActive) {
        ctx.save();
        const opacity = isUnitLeave(unitInfo) ? 0.5 : 1;
        ctx.globalAlpha = opacity;
        this.rect({
          x: x + currentX,
          y: y + currentY,
          width: itemWidth,
          height: itemHeight,
          radius: type === MemberType.Member ? (isFromGanttShortHeight ? 10 : 16) : 4,
          fill: colors.fc11,
        });
        this.avatar({
          x: x + currentX + GRID_CELL_MEMBER_ITEM_PADDING_LEFT,
          y: y + currentY + (itemHeight - avatarSize) / 2,
          url: avatar,
          bgColor: avatarColor,
          id: unitOrUserId,
          title: nickName || name,
          size: avatarSize,
          type: type === MemberType.Member ? AvatarType.Member : AvatarType.Team,
          opacity,
          cacheTheme,
        });

        this.text({
          x: x + currentX + avatarSize + GRID_MEMBER_ITEM_AVATAR_MARGIN_RIGHT,
          y: y + currentY + (itemHeight - 13) / 2,
          fillStyle: colors.fc1,
          text: title || text,
        });
        ctx.restore();
      }

      renderDataList.push({
        x: currentX,
        y: currentY,
        width: itemWidth,
        height: itemHeight,
        text,
        id: unitOrUserId,
        unitInfo,
      });
      currentX += itemWidth + GRID_CELL_MULTI_ITEM_MARGIN_LEFT;
    }

    callback?.({ width: currentX - GRID_CELL_MULTI_ITEM_MARGIN_LEFT });
    return {
      width: columnWidth || currentX - GRID_CELL_MULTI_ITEM_MARGIN_LEFT,
      height: currentY + GRID_CELL_MEMBER_ITEM_HEIGHT + GRID_CELL_MEMBER_ITEM_MARGIN_TOP,
      renderContent: renderDataList,
      isOverflow,
    };
  }

  private renderCellLink(renderProps: IRenderProps, ctx?: any) {
    /**
     * What is currentResourceId?
     * See here: issue #1229
     * When currentResourceId exists, it means that the current link field is not rendered directly,
     * but indirectly by way of lookup, so when there is an intermediate route,
     * it is necessary to find out on whose (which table) basis the data of the associated table is requested.
     * currentDatasheetId is the id of the table (or mirror) that is acting as a springboard at this time
     * Then if it's a directly rendered associated field, pageParams.nodeId === currentResourceId
     */
    const { x, y, field, cellValue, rowHeight, columnWidth, rowHeightLevel, isActive, editable, callback, currentResourceId } = renderProps;
    const linkRecordIds = Array.isArray(cellValue) ? (cellValue as string[]).slice(0, MAX_SHOW_LINK_IDS_COUNT) : [];
    const state = store.getState();
    const NO_DATA = Symbol('NO_DATA');
    const ERROR_DATA = Symbol('ERROR_DATA');
    const ARCHIVED_DATA = Symbol('ARCHIVED_DATA');
    const foreignDatasheetId = field.property.foreignDatasheetId;
    const datasheet = getDatasheetOrLoad(state, foreignDatasheetId, currentResourceId, true);
    const isLoading = Selectors.getDatasheetLoading(state, foreignDatasheetId);
    const datasheetClient = Selectors.getDatasheetClient(state, foreignDatasheetId);
    const snapshot = datasheet && datasheet.snapshot;
    const archivedRecordIds = snapshot?.meta.archivedRecordIds || [];

    const emptyRecords: string[] = [];

    if (!linkRecordIds?.length) return DEFAULT_RENDER_DATA;
    let linkInfoList: { recordId: string; text: string | symbol | null, disabled?: boolean }[] = [];
    linkInfoList = linkRecordIds.map((recordId) => {
      if (!snapshot) {
        return {
          recordId,
          text: ERROR_DATA,
        };
      }

      if (!snapshot.recordMap[recordId]) {
        if (archivedRecordIds.includes(recordId)) {
          return {
            recordId,
            text: ARCHIVED_DATA,
            disabled: true
          };
        }
        if (!isLoading && datasheetClient!.loadingRecord[recordId] === 'error') {
          return {
            recordId,
            text: ERROR_DATA,
            disabled: true
          };
        }
        emptyRecords.push(recordId);
        return {
          recordId,
          text: NO_DATA,
          disabled: true
        };
      }
      return {
        recordId,
        text: (Field.bindModel(field) as LinkField).getLinkedRecordCellString(recordId),
      };
    });

    /**
     * Because the front-end only maintains a portion of the data in the association table that has already been associated.
     * When the recordId associated with the current table does not exist in the associated table snapshot,
     * it means that this associated record is a new associated record.
     * In this case, you need to load the record data of this new associated record into the associated table snapshot.
     */
    const cacheKey = emptyRecords.length ? sortBy(emptyRecords).join(',') : null;
    if (cacheKey && datasheet && !httpCache.has(cacheKey)) {
      httpCache.set(cacheKey, true);
      loadRecords(datasheet.id, emptyRecords);
    }

    const isShortHeight = rowHeightLevel === RowHeightLevel.Short;
    const maxHeight = isActive ? 130 - GRID_CELL_MULTI_PADDING_TOP : rowHeight - GRID_CELL_MULTI_PADDING_TOP;
    const addBtnVisible = !field.property.limitSingleRecord;
    const isOperating = editable && isActive;
    let currentX = addBtnVisible && isOperating ? GRID_CELL_VALUE_PADDING + GRID_CELL_ADD_ITEM_BUTTON_SIZE + 4 : GRID_CELL_VALUE_PADDING;
    let currentY = GRID_CELL_MULTI_PADDING_TOP;
    const displayText = (text: string | symbol | null): string => {
      if (text == null) return t(Strings.record_unnamed);
      switch (text) {
        case NO_DATA:
          return t(Strings.loading);
        case ERROR_DATA:
          return t(Strings.record_fail_data);
        case ARCHIVED_DATA:
          return t(Strings.record_archived_data);
        default:
          return text as string;
      }
    };

    const maxTextWidth = isOperating
      ? columnWidth - 2 * (GRID_CELL_VALUE_PADDING + GRID_CELL_LINK_ITEM_PADDING) - GRID_CELL_DELETE_ITEM_BUTTON_SIZE - 12
      : columnWidth - 2 * (GRID_CELL_VALUE_PADDING + GRID_CELL_LINK_ITEM_PADDING);
    const renderDataList: any[] = [];
    const listCount = linkInfoList.length;
    let isOverflow = false;

    for (let index = 0; index < listCount; index++) {
      const { recordId, text: _text, disabled } = linkInfoList[index];
      const color = typeof _text === 'string' ? colors.firstLevelText : colors.thirdLevelText;
      const text = displayText(_text);
      let realMaxTextWidth = maxTextWidth < 0 ? 0 : maxTextWidth;
      if (index === 0 && addBtnVisible && isOperating) {
        const operatingMaxWidth = maxTextWidth - (GRID_CELL_ADD_ITEM_BUTTON_SIZE + 4);
        // item No space to display, then perform a line feed
        if (operatingMaxWidth <= 10) {
          currentX = GRID_CELL_VALUE_PADDING;
          currentY += GRID_CELL_LINK_ITEM_HEIGHT + GRID_CELL_MULTI_ITEM_MARGIN_TOP;
        } else {
          realMaxTextWidth = operatingMaxWidth;
        }
      }
      const { text: renderText, textWidth } = this.textEllipsis({
        text,
        maxWidth: columnWidth && realMaxTextWidth,
        fontSize: 12,
      });
      const itemWidth = Math.max(
        isOperating
          ? textWidth + 2 * GRID_CELL_LINK_ITEM_PADDING + GRID_CELL_DELETE_ITEM_BUTTON_SIZE + 12
          : textWidth + 2 * GRID_CELL_LINK_ITEM_PADDING,
        GRID_CELL_MULTI_ITEM_MIN_WIDTH,
      );

      if (columnWidth != null) {
        if (!isActive && currentX >= columnWidth) break;
        if (
          !isActive &&
          !isShortHeight &&
          currentY + GRID_CELL_LINK_ITEM_HEIGHT < maxHeight &&
          currentX + itemWidth > columnWidth - GRID_CELL_VALUE_PADDING
        ) {
          currentX = GRID_CELL_VALUE_PADDING;
          currentY += GRID_CELL_LINK_ITEM_HEIGHT + GRID_CELL_MULTI_ITEM_MARGIN_TOP;
        }
        if (isActive && currentX + itemWidth > columnWidth - GRID_CELL_VALUE_PADDING) {
          currentX = GRID_CELL_VALUE_PADDING;
          currentY += GRID_CELL_LINK_ITEM_HEIGHT + GRID_CELL_MULTI_ITEM_MARGIN_TOP;
        }
        if (isActive && currentY >= maxHeight) isOverflow = true;
      }

      if (ctx && !isActive) {
        this.label({
          x: x + currentX,
          y: y + currentY,
          width: itemWidth,
          height: GRID_CELL_LINK_ITEM_HEIGHT,
          background: colors.shadowColor,
          color,
          radius: 4,
          text: renderText,
          fontSize: 12,
          padding: GRID_CELL_LINK_ITEM_PADDING,
          textAlign: 'center',
        });
      }

      renderDataList.push({
        x: currentX,
        y: currentY,
        canvasX: x + currentX,
        canvasY: y + currentY,
        width: itemWidth,
        height: GRID_OPTION_ITEM_HEIGHT,
        text: renderText,
        style: { color },
        id: recordId,
        disabled,
      });
      currentX += itemWidth + GRID_CELL_MULTI_ITEM_MARGIN_LEFT;
    }

    callback?.({ width: currentX - GRID_CELL_MULTI_ITEM_MARGIN_LEFT });
    return {
      width: columnWidth || currentX - GRID_CELL_MULTI_ITEM_MARGIN_LEFT,
      height: currentY + GRID_CELL_LINK_ITEM_HEIGHT + GRID_CELL_MULTI_ITEM_MARGIN_TOP,
      renderContent: renderDataList,
      isOverflow,
    };
  }

  private renderCellLookUp(renderProps: IRenderProps, ctx?: any) {
    renderProps = { ...renderProps, cellValue: handleNullArray(renderProps.cellValue) };
    const { field, cellValue } = renderProps;
    const realField = (Field.bindModel(field) as any as LookUpField).getLookUpEntityField();
    const entityFieldInfo = (Field.bindModel(field) as any as LookUpField).getLookUpEntityFieldInfo();
    const valueType = (Field.bindModel(field) as any as LookUpField).basicValueType;
    if (cellValue != null && realField != null) {
      const rollUpType = (field as ILookUpField).property.rollUpType || RollUpFuncType.VALUES;
      if (!ORIGIN_VALUES_FUNC_SET.has(rollUpType)) {
        switch (valueType) {
          case BasicValueType.String:
          case BasicValueType.Number:
            return this.renderCellText(renderProps, ctx);
          case BasicValueType.Boolean:
            return this.renderCellCheckbox(renderProps, ctx);
          case BasicValueType.DateTime:
            return this.renderCellDateTime(renderProps, ctx);
          case BasicValueType.Array:
          default:
            break;
        }
      }

      if (!Array.isArray(cellValue)) {
        return {
          width: 0,
          height: 0,
          isOverflow: false,
          renderContent: {
            text: String(cellValue),
          },
        };
      }

      if (LOOKUP_VALUE_FUNC_SET.has(rollUpType)) {
        return this.renderCellText(renderProps, ctx);
      }

      const realCellValue = cellValue?.flat(1) as ICellValue;
      const realRenderProps = { ...renderProps, cellValue: realCellValue, editable: false };
      const realFieldRenderProps = {
        ...realRenderProps,
        cellValue: realCellValue,
        field: realField,
        currentResourceId: entityFieldInfo?.datasheetId,
      };

      // Non-plain text fields are displayed as is
      switch (realField.type) {
        case FieldType.Attachment:
          return this.renderCellAttachment(realRenderProps, ctx);
        case FieldType.SingleSelect:
        case FieldType.MultiSelect:
          return this.renderCellMultiSelect(realFieldRenderProps, ctx);
        case FieldType.Member:
        case FieldType.CreatedBy:
        case FieldType.LastModifiedBy:
          return this.renderCellMember(realFieldRenderProps, ctx);
        case FieldType.Link:
        case FieldType.OneWayLink:
          return this.renderCellLink(realFieldRenderProps, ctx);
        case FieldType.Checkbox:
          return this.renderCellMultiCheckbox(realRenderProps, ctx);
        // Text comma segmentation
        case FieldType.DateTime:
        case FieldType.Number:
        case FieldType.Email:
        case FieldType.Phone:
        case FieldType.Rating:
        case FieldType.Formula:
        case FieldType.Percent:
        case FieldType.Currency:
        case FieldType.CreatedTime:
        case FieldType.LastModifiedTime:
        case FieldType.AutoNumber:
          return this.renderCellText(realRenderProps, ctx);
        case FieldType.URL:
        case FieldType.Text:
        case FieldType.SingleText:
        case FieldType.Cascader:
        case FieldType.Button:
        case FieldType.WorkDoc:
          realRenderProps.realField = realField;
          return this.renderCellText(realRenderProps, ctx);
        case FieldType.NotSupport:
        default:
          return null;
      }
    }
  }

  private renderCellFormula(renderProps: IRenderProps, ctx?: any) {
    const { field, cellValue } = renderProps;
    const isCheckbox = Field.bindModel(field).basicValueType === BasicValueType.Boolean;
    if (isCheckbox && !(cellValue instanceof FormulaBaseError)) {
      return this.renderCellCheckbox(renderProps, ctx);
    }
    return this.renderCellText(renderProps, ctx);
  }
}

export const cellHelper = new CellHelper();
