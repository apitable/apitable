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

import { has } from 'lodash';
import * as React from 'react';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
  BasicValueType,
  CollaCommandName,
  DATASHEET_ID,
  ExecuteResult,
  Field,
  FieldOperateType,
  FilterConjunction,
  FilterDuration,
  getNewId,
  IDPrefix,
  IFilterInfo,
  IGridViewColumn,
  ISortInfo,
  IViewProperty,
  Selectors,
  SetFieldFrom,
  StoreActions,
  Strings,
  t,
  ViewType,
} from '@apitable/core';
import { fieldChangeConfirm } from 'pc/components/common/field_change_confirm/field_change_confirm';
import { Message } from 'pc/components/common/message/message';
import { useCacheScroll } from 'pc/context';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { getFieldHeaderByFieldId } from 'pc/utils/dom';
import { executeCommandWithMirror } from 'pc/utils/execute_command_with_mirror';

function returnCurrentOffsetX(newOffsetX: number, lastOffsetX: number): number {
  if (newOffsetX === lastOffsetX) {
    return 0;
  } else if (newOffsetX! > lastOffsetX) {
    return newOffsetX! - lastOffsetX;
  }
  return -(lastOffsetX - newOffsetX!);
}

export const useFieldOperate = (modalWidth: number, datasheetId?: string, targetDOM?: HTMLElement | null) => {
  const { fieldRectLeft, fieldRectBottom, clickLogOffsetX } = useAppSelector((state) => Selectors.gridViewActiveFieldState(state, datasheetId));
  const { scrollLeft = 0 } = useCacheScroll();
  const diffOffsetX = scrollLeft ? returnCurrentOffsetX(scrollLeft, clickLogOffsetX) : 0;

  const [multiGridLeft, multiGridRight] = useMemo(() => {
    if (targetDOM) {
      return [targetDOM!.getBoundingClientRect()['left'], targetDOM!.getBoundingClientRect()['right']];
    }

    function getMultiGridPosition(id: string, direction: string) {
      // Some scenarios (such as forms) can not get the Datasheet DomContainer, using targetDOM as container
      const dom = document.getElementById(id);
      if (!dom) {
        return;
      }
      return dom!.getBoundingClientRect()[direction];
    }

    return [getMultiGridPosition(DATASHEET_ID.DOM_CONTAINER, 'left'), getMultiGridPosition(DATASHEET_ID.DOM_CONTAINER, 'right')];
  }, [targetDOM]);

  let left = fieldRectLeft - diffOffsetX;

  if (left < multiGridLeft) {
    left = multiGridLeft;
  } else if (left + modalWidth > multiGridRight) {
    left = multiGridRight - modalWidth;
  }

  const positionStyle: React.CSSProperties = {
    top: fieldRectBottom,
    left,
  };

  return positionStyle;
};

export const useHideField = (currentView: IViewProperty | undefined, hiddenProp = 'hidden', datasheetId?: string) => {
  const hideField = (fieldIds: string[], isHidden: boolean) => {
    if (!currentView) {
      return;
    }
    const isCalendar = currentView.type === ViewType.Calendar;
    const isGantt = currentView.type === ViewType.Gantt;
    // When column display is turned on, the calendar view is limited to displaying up to 10 columns of fields
    if (isCalendar && !isHidden) {
      let noHiddenFieldLength = 0;
      currentView.columns.forEach((column) => {
        if (has(column, 'hidden') && !column.hidden) {
          noHiddenFieldLength++;
        }
      });
      if (noHiddenFieldLength >= 10) {
        Message.warning({ content: t(Strings.hidden_field_calendar_tips) });
        return;
      }
    }
    return executeCommandWithMirror(
      () => {
        const { result } = resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.ModifyViews,
          data: [
            {
              viewId: currentView.id,
              key: 'columns',
              value: (currentView.columns as IGridViewColumn[]).map((item) => {
                if (fieldIds.includes(item.fieldId)) {
                  if (isGantt) return { ...item, [hiddenProp]: isHidden };
                  return { ...item, hidden: isHidden, [hiddenProp]: isHidden };
                }
                return item;
              }),
            },
          ],
          datasheetId,
        });
        return result;
      },
      {
        columns: (currentView.columns as IGridViewColumn[]).map((item) => {
          if (fieldIds.includes(item.fieldId)) {
            if (isGantt) return { ...item, [hiddenProp]: isHidden };
            return { ...item, hidden: isHidden, [hiddenProp]: isHidden };
          }
          return item;
        }),
      },
      () => {
        return ExecuteResult.Success;
      },
    );
  };
  return hideField;
};

export const useFilterField = () => {
  const currentView = useAppSelector((state) => Selectors.getCurrentView(state));
  const activeViewFilter: undefined | IFilterInfo = useAppSelector((state) => Selectors.getFilterInfo(state));
  const fieldMap = useAppSelector((state) => Selectors.getFieldMap(state, state.pageParams.datasheetId!))!;
  const filterField = (fieldId: string) => {
    if (!currentView) {
      return;
    }
    const field = fieldMap[fieldId];
    const acceptFilterOperators = Field.bindModel(field).acceptFilterOperators;
    const newOperate = acceptFilterOperators[0];
    const exitIds = activeViewFilter ? activeViewFilter.conditions.map((item) => item.conditionId) : [];

    const newFilterInfo = {
      conjunction: activeViewFilter ? activeViewFilter.conjunction : FilterConjunction.And,
      conditions: [
        ...(activeViewFilter ? activeViewFilter.conditions : []),
        {
          conditionId: getNewId(IDPrefix.Condition, exitIds),
          fieldId,
          operator: newOperate,
          fieldType: field.type as any,
          value: Field.bindModel(field).valueType === BasicValueType.DateTime ? [FilterDuration.ExactDate, null] : null,
        },
      ],
    };

    return executeCommandWithMirror(
      () => {
        const { result } = resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.SetViewFilter,
          viewId: currentView.id,
          data: newFilterInfo,
        });
        return result;
      },
      {
        filterInfo: newFilterInfo,
      },
    );
  };
  return filterField;
};

export const useGroupField = () => {
  const currentView = useAppSelector((state) => Selectors.getCurrentView(state));
  const activeViewGroupInfo = useAppSelector((state) => Selectors.getActiveViewGroupInfo(state)); // store Total stored data
  const canGroup = activeViewGroupInfo.length < 3;
  const groupField = (fieldId: string) => {
    if (!currentView) {
      return;
    }
    if (activeViewGroupInfo.find((item) => item.fieldId === fieldId)) {
      return ExecuteResult.Success;
    }

    const groupInfo = [
      ...activeViewGroupInfo,
      {
        fieldId,
        desc: false,
      },
    ];

    return executeCommandWithMirror(
      () => {
        const { result } = resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.SetGroup,
          viewId: currentView.id,
          data: groupInfo,
        });
        return result;
      },
      {
        groupInfo,
      },
    );
  };
  return { canGroup, groupField };
};

export const useSortField = () => {
  const currentView = useAppSelector((state) => Selectors.getCurrentView(state));

  const sortField = (desc: boolean, fieldId: string) => {
    if (!currentView) {
      return;
    }

    const newSortInfo: ISortInfo = {
      keepSort: true,
      rules: [],
    };

    if (currentView.sortInfo) {
      const rules = currentView.sortInfo.rules;
      const sortFieldIndex = rules.findIndex((item) => item.fieldId === fieldId);
      newSortInfo.keepSort = currentView.sortInfo.keepSort;
      if (sortFieldIndex > -1) {
        newSortInfo.rules = rules.map((item) => {
          if (item.fieldId === fieldId) {
            return {
              desc,
              fieldId,
            };
          }
          return item;
        });
      } else {
        newSortInfo.rules = [...rules, { desc, fieldId }];
      }
    } else {
      newSortInfo.rules = [{ desc, fieldId }];
    }
    return executeCommandWithMirror(
      () => {
        const { result } = resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.SetSortInfo,
          viewId: currentView.id,
          data: newSortInfo || undefined,
        });
        return result;
      },
      {
        sortInfo: newSortInfo || undefined,
      },
    );
  };
  return sortField;
};

export const useActiveFieldSetting = () => {
  const permissions = useAppSelector((state) => Selectors.getPermissions(state));
  const datasheetId = useAppSelector((state) => Selectors.getActiveDatasheetId(state)!);
  const { scrollLeft } = useCacheScroll();

  const activeFieldSetting = (fieldId: string, from?: SetFieldFrom): boolean => {
    const fieldHeaderEle = getFieldHeaderByFieldId(fieldId);
    const fieldIndex = fieldHeaderEle && fieldHeaderEle.getAttribute('data-column-index');
    if (fieldHeaderEle && permissions.manageable) {
      const fieldHeaderRect = fieldHeaderEle.getBoundingClientRect();
      const bottom = fieldHeaderRect.bottom;
      const left = fieldHeaderRect.left;
      if (fieldIndex) {
        const commonOptions = {
          from: from,
          fieldId,
          fieldRectLeft: left,
          fieldRectBottom: bottom,
          clickLogOffsetX: scrollLeft,
          fieldIndex: parseInt(fieldIndex, 10),
        };
        store.dispatch(
          StoreActions.setActiveFieldState(datasheetId, {
            ...commonOptions,
            operate: FieldOperateType.FieldSetting,
          }),
        );
        return true;
      }
    }
    return false;
  };
  return activeFieldSetting;
};

export const useDeleteField = (fieldId: string, datasheetId: string) => {
  const dispatch = useDispatch();

  return () => {
    fieldChangeConfirm({
      fieldId: fieldId,
      datasheetId,
      onOk: () => {
        dispatch(StoreActions.clearSelection(datasheetId));
      },
    });
  };
};
