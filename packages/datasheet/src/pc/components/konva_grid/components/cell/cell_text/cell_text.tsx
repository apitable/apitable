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

import { Field, FieldType, getTextFieldType, ISegment, KONVA_DATASHEET_ID, SegmentType } from '@apitable/core';
import {AddOutlined, EmailOutlined, GeoOutlined, LinkOutlined, TelephoneOutlined} from '@apitable/icons';
import { Icon, Text } from 'pc/components/konva_components';
import { ICellProps, KonvaGridContext } from 'pc/components/konva_grid';
import { useEnhanceTextClick } from 'pc/components/multi_grid/cell/hooks/use_enhance_text_click';
import { FC, useContext, useState } from 'react';
import { GRID_CELL_VALUE_PADDING, GRID_ICON_COMMON_SIZE } from '../../../constant';
import { CellScrollContainer } from '../../cell_scroll_container';
import { generateTargetName } from 'pc/components/gantt_view';
import { IRenderContentBase } from '../interface';

// IconPath
const ColumnEmailNonzeroFilledPath = EmailOutlined.toString();
const ColumnUrlOutlinedPath = LinkOutlined.toString();
const ColumnPhoneFilledPath = TelephoneOutlined.toString();
const ColumnGeoFilledPath = GeoOutlined.toString();

const enhanceTextIconMap = {
  [FieldType.URL]: ColumnUrlOutlinedPath,
  [FieldType.Email]: ColumnEmailNonzeroFilledPath,
  [FieldType.Phone]: ColumnPhoneFilledPath,
  [FieldType.Geo]: ColumnGeoFilledPath,
};

export const CellText: FC<React.PropsWithChildren<ICellProps>> = (props) => {
  const {
    x,
    y,
    recordId,
    field,
    rowHeight,
    columnWidth,
    renderData,
    isActive,
    cellValue,
    editable,
    toggleEdit,
  } = props;
  const [isAddIconHover, setAddIconHover] = useState(false);
  const { theme, setTooltipInfo, clearTooltipInfo } = useContext(KonvaGridContext);
  const colors = theme.color;
  const { type: fieldType, id: fieldId } = field;
  const { isEnhanceText } = getTextFieldType(fieldType);
  const _handleEnhanceTextClick = useEnhanceTextClick();
  const name = generateTargetName({
    targetName: KONVA_DATASHEET_ID.GRID_CELL,
    fieldId,
    recordId,
    mouseStyle: 'pointer'
  });
  const { renderContent } = renderData;

  // Verify URL legitimacy when clicking on links.
  const handleURLClick = (type: SegmentType | FieldType, text: string, active?: boolean) => {
    if (!active) return;

    const isRecogURLFlag = field.type === FieldType.URL && field.property?.isRecogURLFlag;

    _handleEnhanceTextClick(type, isRecogURLFlag ? Field.bindModel(field).cellValueToURL(cellValue as ISegment[]) || '' : text);
  };

  const onMouseEnter = (item: {
    offsetX: number;
    offsetY: number;
    text: string;
    width: number;
    linkUrl: string | null;
  }) => {
    if (field.type === FieldType.URL && field.property?.isRecogURLFlag && !!cellValue) {
      const { offsetX: innerX, offsetY: innerY, width } = item;
      let text = '';
      if (field.type === FieldType.URL && field.property?.isRecogURLFlag) {
        text = Field.bindModel(field).cellValueToURL(cellValue)!;
      } else {
        text = Field.bindModel(field).cellValueToString(cellValue as ISegment[]) || '';
      }

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

  const renderText = () => {
    if (renderContent == null) return null;
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

    return (
      <>
        {
          textData == null ?
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
            /> :
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
        }
        {
          isEnhanceText &&
          <Icon
            name={name}
            x={columnWidth - GRID_ICON_COMMON_SIZE - GRID_CELL_VALUE_PADDING - 4}
            y={height - GRID_ICON_COMMON_SIZE}
            size={GRID_ICON_COMMON_SIZE}
            backgroundWidth={24}
            backgroundHeight={20}
            background={colors.defaultBg}
            data={enhanceTextIconMap[fieldType]}
            onClick={() => handleURLClick(fieldType, entityText, isActive)}
            onTap={() => handleURLClick(fieldType, entityText, isActive)}
            scaleX={0.8}
            scaleY={0.8}
            transformsEnabled={'all'}
            listening={linkEnable}
          />
        }
      </>
    );
  };

  return (
    <CellScrollContainer
      x={x}
      y={y}
      columnWidth={columnWidth}
      rowHeight={rowHeight}
      fieldId={fieldId}
      recordId={recordId}
      renderData={renderData}
    >
      {
        fieldType === FieldType.Cascader && renderContent == null && isActive && editable &&
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
      }
      {
        isActive &&
        renderText()
      }
    </CellScrollContainer>
  );
};
