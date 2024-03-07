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

import { KonvaEventObject } from 'konva/lib/Node';
import dynamic from 'next/dynamic';
import { FC, useContext, useState } from 'react';
import { black, getNextShadeColor, Message } from '@apitable/components';
import { KONVA_DATASHEET_ID, Selectors, Strings, t } from '@apitable/core';
import { AddOutlined, CloseOutlined } from '@apitable/icons';
import { expandRecordInCenter } from 'pc/components/expand_record';
import { generateTargetName } from 'pc/components/gantt_view';
import { Icon, Rect, Text } from 'pc/components/konva_components';
import {
  GRID_CELL_DELETE_ITEM_BUTTON_SIZE,
  GRID_CELL_DELETE_ITEM_BUTTON_SIZE_OFFSET,
  GRID_CELL_VALUE_PADDING,
  GRID_OPTION_ITEM_PADDING,
  KonvaGridContext,
} from 'pc/components/konva_grid';
import { KonvaGridViewContext } from 'pc/components/konva_grid/context';
import { store } from 'pc/store';
import { MouseDownType } from '../../../../multi_grid';
import { CellScrollContainer } from '../../cell_scroll_container';
import { ICellProps } from '../cell_value';
import { IRenderContentBase } from '../interface';

const AddOutlinedPath = AddOutlined.toString();
const CloseSmallOutlinedPath = CloseOutlined.toString();
const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });
export const CellLink: FC<React.PropsWithChildren<ICellProps>> = (props) => {
  const { x, y, recordId, cellValue, field, rowHeight, columnWidth, renderData, isActive, toggleEdit, onChange, editable } = props;
  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const state = store.getState();
  const realField = Selectors.findRealField(state, field);
  const operatingEnable = isActive && editable;
  const { setCellDown } = useContext(KonvaGridContext);
  const { fieldPermissionMap } = useContext(KonvaGridViewContext);
  const fieldId = field.id;
  const name = generateTargetName({
    targetName: KONVA_DATASHEET_ID.GRID_CELL,
    fieldId,
    recordId,
    mouseStyle: 'pointer',
  });
  const [isHover, setHover] = useState(false);
  const [closeIconHoverId, setCloseIconHoverId] = useState<null | string>(null);
  const [closeIconDownId, setCloseIconDownId] = useState<null | string>(null);
  const { renderContent } = renderData;

  async function onClick(e: { evt: { button: MouseDownType } }) {
    if (e.evt.button === MouseDownType.Right) {
      return;
    }
    operatingEnable && toggleEdit && (await toggleEdit());
  }

  function deleteItem(e: KonvaEventObject<MouseEvent>, index?: number) {
    e.evt.stopPropagation();
    let value: string[] | null = (cellValue as string[]).filter((_item, idx) => {
      return idx !== index;
    });
    if (value.length === 0) {
      value = null;
    }

    onChange?.(value);
  }

  const getForeignViewId = () => {
    const state = store.getState();
    const snapshot = Selectors.getSnapshot(state, foreignDatasheetId);
    if (!snapshot) {
      return;
    }
    const firstViewId = snapshot.meta.views[0].id;
    let foreignView = Selectors.getCurrentViewBase(snapshot, firstViewId, foreignDatasheetId, fieldPermissionMap);

    if (limitToView) {
      foreignView = Selectors.getCurrentViewBase(snapshot, limitToView, foreignDatasheetId, fieldPermissionMap) || foreignView;
    }
    const hasLimitToView = Boolean(limitToView && foreignView?.id === limitToView);
    return hasLimitToView ? foreignView?.id : undefined;
  };

  function expand(recordId: string) {
    if (!realField) {
      return;
    }
    // Determining Related Datasheet Permissions.
    const readable = Selectors.getPermissions(state, realField.property.foreignDatasheetId).readable;
    if (!readable && realField.property.foreignDatasheetId) {
      Message.warning({
        content: t(Strings.disabled_expand_link_record),
      });
      return;
    }
    expandRecordInCenter({
      activeRecordId: recordId,
      recordIds: (renderContent as IRenderContentBase[])!.map(({ id }) => id),
      viewId: getForeignViewId(),
      datasheetId: foreignDatasheetId,
    });
  }

  if (!realField) {
    return null;
  }
  
  const { limitToView, foreignDatasheetId } = realField.property;
  const addBtnVisible = !realField.property.limitSingleRecord || renderContent == null;

  return (
    <CellScrollContainer x={x} y={y} columnWidth={columnWidth} rowHeight={rowHeight} fieldId={fieldId} recordId={recordId} renderData={renderData}>
      {addBtnVisible && operatingEnable && (
        <Icon
          name={name}
          x={GRID_CELL_VALUE_PADDING}
          y={5}
          data={AddOutlinedPath}
          shape={'circle'}
          backgroundWidth={22}
          backgroundHeight={22}
          background={isHover ? colors.rowSelectedBgSolid : 'transparent'}
          onMouseEnter={() => setHover(true)}
          onMouseOut={() => setHover(false)}
          onClick={onClick}
          onTap={onClick}
        />
      )}
      {isActive &&
        renderContent != null &&
        (renderContent as IRenderContentBase[]).map((item, index) => {
          const { x, y, width, height, text, style, id, disabled } = item;
          const renderText = text.replace(/\n|\r/g, ' ');
          let iconBg = 'transparent';
          if (closeIconHoverId === id) {
            iconBg = getNextShadeColor(black[200], 1);
          }
          if (closeIconDownId === id) {
            iconBg = getNextShadeColor(black[200], 2);
          }
          return (
            <Group x={x} y={y} listening={isActive} key={index}>
              <Rect
                name={disabled ? '' : name}
                width={width}
                height={height}
                fill={colors.shadowColor}
                cornerRadius={4}
                onClick={() => !disabled && expand(id)}
                onTap={() => !disabled && expand(id)}
              />
              <Text x={GRID_OPTION_ITEM_PADDING} height={height} text={renderText} fill={style.color} fontSize={12} />
              {operatingEnable && (
                <Icon
                  name={name}
                  x={width - GRID_OPTION_ITEM_PADDING - GRID_CELL_DELETE_ITEM_BUTTON_SIZE - GRID_CELL_DELETE_ITEM_BUTTON_SIZE_OFFSET}
                  y={2}
                  data={CloseSmallOutlinedPath}
                  fill={colors.secondLevelText}
                  scaleX={0.75}
                  scaleY={0.75}
                  transformsEnabled={'all'}
                  background={iconBg}
                  backgroundHeight={16}
                  backgroundWidth={16}
                  cornerRadius={2}
                  onTap={(e: KonvaEventObject<MouseEvent>) => deleteItem(e, index)}
                  onMouseDown={() => {
                    setCloseIconDownId(id);
                  }}
                  onMouseUp={(e: KonvaEventObject<MouseEvent>) => {
                    if (closeIconDownId) {
                      deleteItem(e, index);
                    }
                    setCellDown(false);
                    setCloseIconDownId(null);
                  }}
                  onMouseEnter={() => setCloseIconHoverId(id)}
                  onMouseOut={() => {
                    setCloseIconDownId(null);
                    setCloseIconHoverId(null);
                  }}
                />
              )}
            </Group>
          );
        })}
    </CellScrollContainer>
  );
};
