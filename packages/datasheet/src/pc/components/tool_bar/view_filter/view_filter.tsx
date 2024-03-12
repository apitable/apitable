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

import classNames from 'classnames';
import * as React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { IUseListenTriggerInfo, useListenVisualHeight, useThemeColors, WrapperTooltip } from '@apitable/components';
import {
  BasicValueType,
  CollaCommandName,
  Field,
  FilterConjunction as CoreFilterConjunction,
  FilterDuration,
  getNewId,
  IDPrefix,
  IFilterInfo,
  IGridViewProperty,
  Selectors,
  Strings,
  t,
} from '@apitable/core';
import { AddOutlined } from '@apitable/icons';
import { PopUpTitle } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { ViewFilterContext } from 'pc/components/tool_bar/view_filter/view_filter_context';
import { useShowViewLockModal } from 'pc/components/view_lock/use_show_view_lock_modal';
import { useResponsive } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { executeCommandWithMirror } from 'pc/utils/execute_command_with_mirror';
import { SyncViewTip } from '../sync_view_tip';
import ConditionList from './condition_list';
import { ExecuteFilterFn } from './interface';
import styles from './style.module.less';

interface IViewFilter {
  triggerInfo?: IUseListenTriggerInfo;
}

const MIN_HEIGHT = 70;
const MAX_HEIGHT = 260;
const ViewFilterBase = (props: IViewFilter) => {
  const { triggerInfo } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const colors = useThemeColors();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const view = useAppSelector((state) => Selectors.getCurrentView(state))! as IGridViewProperty;
  const columns = view.columns;
  const fieldMap = useAppSelector((state) => Selectors.getFieldMap(state, state.pageParams.datasheetId!))!;
  const activeViewFilter = useAppSelector((state) => Selectors.getFilterInfo(state))!;
  const scrollShadowRef = useRef<HTMLDivElement>(null);
  const isViewLock = useShowViewLockModal();

  const { style, onListenResize } = useListenVisualHeight({
    listenNode: containerRef,
    childNode: childRef,
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
    triggerInfo,
    position: 'sticky',
    showOnParent: false,
    onScroll: ({ height, scrollHeight, scrollTop }) => {
      const ele = scrollShadowRef.current;
      if (!ele) return;
      if (scrollTop + height > scrollHeight - 10) {
        // Masked scrollable styles.
        ele.style.display = 'none';
        return;
      }
      // Display scrollable style.
      if (ele.style.display === 'block') {
        return;
      }
      ele.style.display = 'block';
    },
  });

  const filterCommand = useCallback(
    (data: IFilterInfo | null) => {
      executeCommandWithMirror(
        () => {
          resourceService.instance!.commandManager.execute({
            cmd: CollaCommandName.SetViewFilter,
            viewId: view.id,
            data: data || undefined,
          });
        },
        {
          filterInfo: data || undefined,
        },
      );
    },
    [view.id],
  );

  const changeFilter = useCallback(
    (cb: ExecuteFilterFn) => {
      const result = cb(activeViewFilter!);
      filterCommand(result);
    },
    [activeViewFilter, filterCommand],
  );

  // Mark if a new filter has been added, scrolling directly to the bottom in the commandForAddViewFilter function is not valid.
  const added = useRef<boolean>(false);

  function commandForAddViewFilter(_e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const firstColumns = fieldMap[columns[0].fieldId];
    const exitIds = activeViewFilter ? activeViewFilter.conditions.map((item) => item.conditionId) : [];
    const acceptFilterOperators = Field.bindModel(firstColumns).acceptFilterOperators;
    const newOperate = acceptFilterOperators[0];

    filterCommand({
      conjunction: activeViewFilter ? activeViewFilter.conjunction : CoreFilterConjunction.And,
      conditions: [
        ...(activeViewFilter ? activeViewFilter.conditions : []),
        {
          conditionId: getNewId(IDPrefix.Condition, exitIds),
          fieldId: columns[0].fieldId,
          operator: newOperate,
          fieldType: firstColumns.type as any,
          value: Field.bindModel(firstColumns).valueType === BasicValueType.DateTime ? [FilterDuration.ExactDate, null] : null,
        },
      ],
    });
    added.current = true;
  }

  useEffect(() => {
    if (added.current) {
      const conditionWrapper = document.querySelector(`.${styles.condition}`) as HTMLDivElement;
      conditionWrapper.scrollTop = conditionWrapper.scrollHeight;
      added.current = false;
    }
    onListenResize();
  }, [activeViewFilter?.conditions.length, onListenResize]);

  function deleteFilter(idx: number) {
    if (isViewLock) return;
    if (activeViewFilter!.conditions.length === 1) {
      filterCommand(null);
      return;
    }
    filterCommand({
      conjunction: activeViewFilter!.conjunction,
      conditions: activeViewFilter!.conditions.filter((_item, index) => {
        return index !== idx;
      }),
    });
  }

  return (
    <ViewFilterContext.Provider value={{ isViewLock }}>
      <div ref={containerRef} className={classNames(styles.viewFilter, styles.shadow)}>
        <ComponentDisplay minWidthCompatible={ScreenSize.md}>
          <PopUpTitle title={t(Strings.set_filter)} infoUrl={t(Strings.filter_help_url)} variant={'h7'} className={styles.boxTop} />
          <SyncViewTip />
        </ComponentDisplay>
        <div ref={childRef} style={{ ...style, overflow: 'auto' }}>
          <ConditionList filterInfo={activeViewFilter} fieldMap={fieldMap} changeFilter={changeFilter} deleteFilter={deleteFilter} />
          <div ref={scrollShadowRef} className={classNames(!isMobile && styles.scrollShadow)} />
        </div>
        {
          <WrapperTooltip wrapper={isViewLock} tip={t(Strings.view_lock_setting_desc)}>
            <div
              className={classNames(styles.addNewButton, { [styles.disabled]: isViewLock })}
              onClick={!isViewLock ? commandForAddViewFilter : undefined}
            >
              <div className={styles.iconAdd}>
                <AddOutlined size={16} color={colors.thirdLevelText} />
              </div>
              {t(Strings.add_filter)}
            </div>
          </WrapperTooltip>
        }
      </div>
    </ViewFilterContext.Provider>
  );
};

export const ViewFilter = React.memo(ViewFilterBase);
