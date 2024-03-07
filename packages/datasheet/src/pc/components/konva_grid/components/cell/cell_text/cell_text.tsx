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

import * as React from 'react';
import { FC, useContext, useState } from 'react';
import {
  Field,
  FieldType,
  getTextFieldType,
  ISegment,
  KONVA_DATASHEET_ID,
  SegmentType,
  Strings,
  t
} from '@apitable/core';
import { AddOutlined, EditOutlined, EmailOutlined, TelephoneOutlined, WebOutlined } from '@apitable/icons';
import { generateTargetName } from 'pc/components/gantt_view';
import { Icon, Image, Text } from 'pc/components/konva_components';
import { Shape } from 'pc/components/konva_components/components/icon';
import { ICellProps, KonvaGridContext } from 'pc/components/konva_grid';
import { useEnhanceTextClick } from 'pc/components/multi_grid/cell/hooks/use_enhance_text_click';
import { GRID_CELL_VALUE_PADDING, GRID_ICON_COMMON_SIZE } from '../../../constant';
import { CellScrollContainer } from '../../cell_scroll_container';
import { IRenderContentBase } from '../interface';

// IconPath
const ColumnEmailNonzeroFilledPath = EmailOutlined.toString();
const ColumnEditOutlinedPath = EditOutlined.toString();
const ColumnPhoneFilledPath = TelephoneOutlined.toString();
const WebOutlinedPath = WebOutlined.toString();

const enhanceTextIconMap = {
  [FieldType.URL]: ColumnEditOutlinedPath,
  [FieldType.Email]: ColumnEmailNonzeroFilledPath,
  [FieldType.Phone]: ColumnPhoneFilledPath,
};

export const CellText: FC<React.PropsWithChildren<ICellProps>> = (props) => {
  const { x, y, recordId, field, rowHeight, columnWidth, renderData, isActive, cellValue, toggleEdit, editable } = props;
  const [isAddIconHover, setAddIconHover] = useState(false);
  const [isHover, setHover] = useState(false);
  const { theme, setTooltipInfo, clearTooltipInfo, setActiveUrlAction } = useContext(KonvaGridContext);
  
  const colors = theme.color;
  const { type: fieldType, id: fieldId } = field;
  const { isEnhanceText } = getTextFieldType(fieldType);
  const _handleEnhanceTextClick = useEnhanceTextClick();
  const name = generateTargetName({
    targetName: KONVA_DATASHEET_ID.GRID_CELL,
    fieldId,
    recordId,
    mouseStyle: 'pointer',
  });
  const { renderContent } = renderData;

  // Verify URL legitimacy when clicking on links.
  const handleURLClick = (type: SegmentType | FieldType, text: string, active?: boolean) => {
    if (!active) return;

    _handleEnhanceTextClick(type, field.type === FieldType.URL ? Field.bindModel(field).cellValueToURL(cellValue as ISegment[]) || '' : text);
  };

  const onMouseEnter = (item: { offsetX: number; offsetY: number; text: string; width: number; linkUrl: string | null }) => {
    if (field.type === FieldType.URL && !!cellValue) {
      const { offsetX: innerX, offsetY: innerY, width } = item;
      const text = Field.bindModel(field).cellValueToString(cellValue as any) || '';

      setTooltipInfo({
        title: text,
        visible: true,
        x: x + innerX,
        y: y + innerY,
        width,
        height: 1,
      });
    }
  };

  const AddOutlinedPath = AddOutlined.toString();
  const favicon = (renderContent as IRenderContentBase | null)?.favicon;

  const restIconProps =
    field.type === FieldType.URL
      ? {
        y: 24 - GRID_ICON_COMMON_SIZE - 3,
        shape: 'square' as Shape,
        cornerRadius: 4,
        backgroundWidth: 22,
        backgroundHeight: 22,
        background: isHover ? colors.rowSelectedBgSolid : colors.defaultBg,
        onMouseEnter: () => {
          setHover(true);
          setTooltipInfo({
            title: t(Strings.url_cell_edit),
            visible: true,
            x: x + columnWidth - GRID_ICON_COMMON_SIZE - GRID_CELL_VALUE_PADDING + 4,
            y,
            width: 1,
            height: 1,
          });
        },
        onMouseOut: () => {
          setHover(false);
          clearTooltipInfo();
        },
      }
      : {};

  const renderText = () => {
    if (renderContent == null) {
      if (field.type !== FieldType.URL) {
        return null;
      }
      return (
        <Icon
          name={name}
          x={columnWidth - GRID_ICON_COMMON_SIZE - GRID_CELL_VALUE_PADDING - 4}
          y={24 - GRID_ICON_COMMON_SIZE}
          size={GRID_ICON_COMMON_SIZE}
          backgroundWidth={18}
          backgroundHeight={16}
          background={colors.defaultBg}
          data={enhanceTextIconMap[fieldType]}
          onClick={() => setActiveUrlAction(true)}
          onTap={() => setActiveUrlAction(true)}
          transformsEnabled={'all'}
          listening
          {...restIconProps}
        />
      );
    }
    const { width, height, text: entityText, textData, style } = renderContent as IRenderContentBase;
    const linkEnable = style?.textDecoration === 'underline';
    const commonProps = {
      name,
      lineHeight: 1.84,
      ellipsis: false,
      verticalAlign: 'top',
      align: style?.textAlign || 'left',
      fontStyle: style?.fontWeight || 'normal',
    };

    const handleClick = () => {
      if (field.type === FieldType.URL) {
        setActiveUrlAction(true);
      } else {
        handleURLClick(fieldType, entityText, isActive);
      }
    };

    return (
      <>
        {textData == null ? (
          <Text
            x={GRID_CELL_VALUE_PADDING}
            y={4.5}
            width={width}
            heigh={height}
            text={entityText}
            wrap={'word'}
            fill={colors.firstLevelText}
            {...commonProps}
            onMoun
          />
        ) : (
          textData.map((item, index) => {
            const { offsetX, offsetY, text, linkUrl } = item;
            const listening = linkEnable || Boolean(linkUrl);
            return (
              <Text
                key={index}
                x={offsetX + GRID_CELL_VALUE_PADDING}
                y={offsetY + 4.5}
                heigh={24}
                text={text}
                listening={listening}
                textDecoration={listening ? 'underline' : ''}
                fill={listening ? colors.primaryColor : colors.firstLevelText}
                {...commonProps}
                onClick={() => handleURLClick(fieldType, linkEnable ? entityText : linkUrl!, isActive)}
                onTap={() => handleURLClick(fieldType, linkEnable ? entityText : linkUrl!, isActive)}
                onMouseEnter={() => onMouseEnter(item)}
                onMouseOut={() => clearTooltipInfo()}
              />
            );
          })
        )}
        {isEnhanceText && (
          <Icon
            name={name}
            x={columnWidth - GRID_ICON_COMMON_SIZE - GRID_CELL_VALUE_PADDING - 4}
            y={height - GRID_ICON_COMMON_SIZE}
            size={GRID_ICON_COMMON_SIZE}
            backgroundWidth={18}
            backgroundHeight={16}
            data={enhanceTextIconMap[fieldType]}
            onClick={() => handleClick()}
            onTap={() => handleClick()}
            background={colors.defaultBg}
            transformsEnabled={'all'}
            listening={linkEnable}
            {...restIconProps}
          />
        )}
      </>
    );
  };

  return (
    <CellScrollContainer x={x} y={y} columnWidth={columnWidth} rowHeight={rowHeight} fieldId={fieldId} recordId={recordId} renderData={renderData}>
      {fieldType === FieldType.Cascader && renderContent == null && isActive && editable && (
        <Icon
          name={name}
          x={GRID_CELL_VALUE_PADDING}
          y={5}
          data={AddOutlinedPath}
          shape={'circle'}
          backgroundWidth={22}
          backgroundHeight={22}
          background={isAddIconHover ? colors.rowSelectedBgSolid : 'transparent'}
          onMouseEnter={() => setAddIconHover(true)}
          onMouseOut={() => setAddIconHover(false)}
          onClick={toggleEdit}
          onTap={toggleEdit}
        />
      )}
      {Boolean(favicon) && (
        <Image
          url={favicon!}
          x={GRID_CELL_VALUE_PADDING}
          failedDisplay={<Icon data={WebOutlinedPath} x={GRID_CELL_VALUE_PADDING} y={8} width={16} height={16} fill={colors.textCommonPrimary} />}
          y={7}
          width={16}
          height={16}
          alt="url favicon"
        />
      )}
      {isActive && renderText()}
    </CellScrollContainer>
  );
};
