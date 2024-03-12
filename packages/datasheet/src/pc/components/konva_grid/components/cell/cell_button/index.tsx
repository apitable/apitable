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

import { useAtom, useSetAtom } from 'jotai';
import { KonvaEventObject } from 'konva/lib/Node';
import { debounce } from 'lodash';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { Box, useThemeColors } from '@apitable/components';
import { ButtonStyleType, getColorValue, IButtonField, KONVA_DATASHEET_ID, Selectors } from '@apitable/core';
import { CheckFilled } from '@apitable/icons';
import { AutomationConstant } from 'pc/components/automation/config';
import { automationHistoryAtom, automationStateAtom } from 'pc/components/automation/controller';
import { automationTaskMap, AutomationTaskStatus } from 'pc/components/editors/button_editor/automation_task_map';
import { ButtonFieldItem, handleStart } from 'pc/components/editors/button_editor/buton_item';
import { useJobTaskContext } from 'pc/components/editors/button_editor/job_task';
import { generateTargetName } from 'pc/components/gantt_view';
import { autoSizerCanvas, Icon, Rect, Text } from 'pc/components/konva_components';
import {
  CellScrollContainer,
  GRID_CELL_MULTI_ITEM_MARGIN_TOP,
  GRID_CELL_MULTI_ITEM_MIN_WIDTH,
  GRID_CELL_MULTI_PADDING_TOP,
  GRID_CELL_VALUE_PADDING,
  GRID_ICON_SMALL_SIZE,
  GRID_OPTION_ITEM_PADDING,
} from 'pc/components/konva_grid';
import { setColor } from 'pc/components/multi_grid/format';
import { useAppSelector } from 'pc/store/react-redux';
import { KeyCode, stopPropagation } from 'pc/utils';
import { ICellProps } from '../cell_value';
import { IRenderData } from '../interface';
import { TextEllipsisEngine } from './text_ellipsis_engine';

const GRID_OPTION_ITEM_HEIGHT = 22;

const CONST_ACTIVE_OPACITY = 0.6;
const CONST_HOVER_OPACITY = 0.8;
const RotatingLoading = dynamic(() => import('pc/components/konva_grid/components/cell/cell_button/rotating_loading'), { ssr: false });

type ACellProps = Pick<ICellProps, 'field' | 'recordId'> & {
  datasheetId: string;
};

export const CellButtonItem: React.FC<React.PropsWithChildren<ACellProps>> = (props) => {
  const record = useAppSelector((state) => Selectors.getRecord(state, props.recordId, props.datasheetId));
  if (!record) return null;
  return (
    <Box flex={'1'} padding={'0'} height={'22px'}>
      <span>
        <ButtonFieldItem field={props.field as IButtonField} recordId={props.recordId} record={record} />
      </span>
    </Box>
  );
};

export type IButtonCellProps = Omit<ICellProps, 'field'> & {
  field: IButtonField;
};
const textFontSize = 13;

export const CellButton: React.FC<React.PropsWithChildren<IButtonCellProps>> = (props) => {
  const { x, y, isActive, recordId, field, cellValue, columnWidth, rowHeight, onChange } = props;
  const fieldId = field.id;
  const name = generateTargetName({
    targetName: KONVA_DATASHEET_ID.GRID_CELL,
    fieldId,
    recordId,
    mouseStyle: 'pointer',
  });

  const state = useAppSelector((state) => state);

  const datasheetId = useAppSelector(Selectors.getActiveDatasheetId);
  const record = useAppSelector((state) => Selectors.getRecord(state, recordId, datasheetId));

  const GRID_CELL_VALUE_PADDING = 0;
  const [automationTaskMapData, setAutomationTaskMap] = useAtom(automationTaskMap);

  const key = `${recordId}-${field.id}`;

  const taskStatus: AutomationTaskStatus = automationTaskMapData.get(key) ?? 'initial';

  const cacheTheme = useAppSelector(Selectors.getTheme);
  const colors = useThemeColors();

  const bg = field.property.style.color ? setColor(field.property.style.color, cacheTheme) : colors.defaultBg;
  const isValid = true;

  let textColor: string = colors.textStaticPrimary;

  const maxTextWidth = columnWidth - 2 * (GRID_CELL_VALUE_PADDING + GRID_OPTION_ITEM_PADDING) - GRID_ICON_SMALL_SIZE;

  const operatingMaxWidth = maxTextWidth - 6;
  let currentX = GRID_CELL_VALUE_PADDING;

  let currentY = GRID_CELL_MULTI_PADDING_TOP + 2;

  // item no space to display, then perform a line feed
  let realMaxTextWidth = maxTextWidth;
  if (operatingMaxWidth <= 10) {
    currentX = GRID_CELL_VALUE_PADDING;
    currentY += GRID_OPTION_ITEM_HEIGHT + GRID_CELL_MULTI_ITEM_MARGIN_TOP;
  } else {
    realMaxTextWidth = operatingMaxWidth;
  }

  const setAutomationStateAtom = useSetAtom(automationStateAtom);

  const setAutomationHistoryPanel = useSetAtom(automationHistoryAtom);
  const {
    text: renderText,
    textWidth,
    isEllipsis,
  } = TextEllipsisEngine.textEllipsis(
    {
      text: field.property.text,
      maxWidth: columnWidth && realMaxTextWidth,
      fontSize: 12,
    },
    autoSizerCanvas.context!,
  );

  const itemWidth = Math.max(textWidth + 2 * GRID_OPTION_ITEM_PADDING - (isEllipsis ? 8 : 0), GRID_CELL_MULTI_ITEM_MIN_WIDTH);

  if (field.property.style.type === ButtonStyleType.Background) {
    if (cacheTheme === 'dark') {
      if (field.property.style.color === AutomationConstant.whiteColor) {
        textColor = colors.textReverseDefault;
      }
    }
  }

  const { handleTaskStart } = useJobTaskContext();

  const onStart = useCallback(() => {
    if (!datasheetId) {
      return;
    }
    if (!record) {
      return;
    }

    handleStart(datasheetId, record, state, recordId, taskStatus, field, colors, handleTaskStart, setAutomationStateAtom, setAutomationHistoryPanel);
  }, [colors, datasheetId, field, handleTaskStart, record, recordId, setAutomationHistoryPanel, setAutomationStateAtom, state, taskStatus]);

  const onClickStart = debounce(() => {
    onStart();
  }, 300);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.metaKey) return;
    if (e.keyCode === KeyCode.Enter) {
      isActive && onChange && onChange(!cellValue);
      stopPropagation(e);
    }
  };

  const itemX1 = 10 + (columnWidth - itemWidth) / 2;

  const itemY = currentY - 2;

  const [isHover, setHover] = useState(false);
  const [isMouseActive, setIsActive] = useState(false);

  const handleMouseEnter = (e: KonvaEventObject<MouseEvent>) => {
    // @ts-ignore
    const container = e.target.getStage().container();
    container.style.cursor = 'pointer';
    setHover(true);
  };

  const handleMouseDown = useCallback(() => {
    setIsActive(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsActive(false);
  }, []);

  const handleMouseLeave = (e: KonvaEventObject<MouseEvent>) => {
    // @ts-ignore
    const container = e.target.getStage().container();
    container.style.cursor = 'default';
    setHover(false);
  };

  const textColorBg = isMouseActive ? getColorValue(bg, CONST_ACTIVE_OPACITY) : isHover ? getColorValue(bg, CONST_HOVER_OPACITY) : bg;
  const itemLoadingX1 = (columnWidth - 22) / 2;
  if (field.property.style.type === ButtonStyleType.OnlyText) {
    // @ts-ignore
    return (
      <CellScrollContainer
        x={x}
        y={y}
        columnWidth={columnWidth}
        rowHeight={rowHeight}
        fieldId={fieldId}
        recordId={recordId}
        renderData={{} as IRenderData}
        onClick={onClickStart}
        onTap={onClickStart}
      >
        <Rect
          x={itemX1 - 10}
          name={name}
          onKeyDown={handleKeyDown}
          onClick={onClickStart}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          y={itemY}
          width={itemWidth}
          height={GRID_OPTION_ITEM_HEIGHT}
          fill={'transparent'}
          cornerRadius={2}
          listening
        />

        {taskStatus === 'running' && <RotatingLoading name={name} x={itemLoadingX1} y={itemY + 1} textColor={bg} />}

        {taskStatus === 'success' && (
          <Icon name={name} x={itemLoadingX1} y={itemY} data={CheckFilled.toString()} backgroundWidth={22} backgroundHeight={22} fill={bg} />
        )}

        {taskStatus === 'initial' && (
          <Text
            onClick={onClickStart}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            width={itemWidth}
            name={name}
            x={itemX1}
            y={itemY}
            height={GRID_OPTION_ITEM_HEIGHT}
            text={renderText}
            fontSize={textFontSize}
            fill={isValid ? textColorBg : colors.textCommonTertiary}
          />
        )}
      </CellScrollContainer>
    );
  }

  return (
    <CellScrollContainer
      x={x}
      y={y}
      columnWidth={columnWidth}
      rowHeight={rowHeight}
      fieldId={fieldId}
      recordId={recordId}
      renderData={{} as IRenderData}
      onClick={onClickStart}
      onTap={onClickStart}
    >
      <Rect
        x={itemX1 - 10}
        name={name}
        onKeyDown={handleKeyDown}
        onClick={onClickStart}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        y={itemY}
        width={itemWidth}
        height={GRID_OPTION_ITEM_HEIGHT}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        fill={isMouseActive ? getColorValue(bg, CONST_ACTIVE_OPACITY) : isHover ? getColorValue(bg, CONST_HOVER_OPACITY) : bg}
        cornerRadius={2}
        listening
      />

      {taskStatus === 'running' && <RotatingLoading name={name} x={itemLoadingX1} y={itemY + 1} textColor={textColor} />}

      {taskStatus === 'success' && (
        <Icon
          name={name}
          rotation={50}
          x={itemLoadingX1}
          y={itemY}
          data={CheckFilled.toString()}
          backgroundWidth={22}
          backgroundHeight={22}
          fill={textColor}
        />
      )}

      {taskStatus === 'initial' && (
        <Text x={itemX1} width={itemWidth} y={itemY} height={GRID_OPTION_ITEM_HEIGHT} text={renderText} fontSize={textFontSize} fill={textColor} />
      )}
    </CellScrollContainer>
  );
};
