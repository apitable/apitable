import {
  BasicValueType, CollaCommandName, Field, FilterConjunction as CoreFilterConjunction, FilterDuration, getNewId, IDPrefix, IFilterInfo,
  IGridViewProperty, Selectors, Strings, t,
} from '@vikadata/core';
import { resourceService } from 'pc/resource_service';
import { useCallback, useEffect, useRef } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import IconAdd from 'static/icon/common/common_icon_add_content.svg';
import { useThemeColors, useListenVisualHeight } from '@vikadata/components';
import ConditionList from './condition_list';
import { ExecuteFilterFn } from './interface';
import classNames from 'classnames';
import styles from './style.module.less';
import { PopUpTitle } from 'pc/components/common';
import { SyncViewTip } from '../sync_view_tip';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display/component_display';
import { executeCommandWithMirror } from 'pc/utils/execute_command_with_mirror';
import { useResponsive } from 'pc/hooks';

const MIN_HEIGHT = 70;
const MAX_HEIGHT = 260;
const ViewFilterBase = (props) => {
  const { triggerInfo } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const colors = useThemeColors();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const view = useSelector(state => Selectors.getCurrentView(state))! as IGridViewProperty;
  const columns = view.columns;
  const fieldMap = useSelector(state => Selectors.getFieldMap(state, state.pageParams.datasheetId!))!;
  const activeViewFilter = useSelector(state => Selectors.getFilterInfo(state))!;
  const scrollShadowRef = useRef<HTMLDivElement>(null);
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
        // 屏蔽可滚动样式
        ele.style.display = 'none';
        return;
      }
      // 展示可滚动样式
      if (ele.style.display === 'block') {
        return;
      }
      ele.style.display = 'block';
    },
  });

  const filterCommand = useCallback(
    (data: IFilterInfo | null) => {
      executeCommandWithMirror(() => {
        resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.SetViewFilter,
          viewId: view.id,
          data: data || undefined,
        });
      }, {
        filterInfo: data || undefined,
      });
    },
    [view.id],
  );

  const changeFilter = useCallback((cb: ExecuteFilterFn) => {
    const result = cb(activeViewFilter!);
    filterCommand(result);
  }, [
    activeViewFilter,
    filterCommand,
  ]);

  // 标记是否已添加新的筛选项，直接在 commandForAddViewFilter 函数中滚动到底部无效
  const added = useRef<boolean>(false);

  function commandForAddViewFilter(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const firstColumns = fieldMap[columns[0].fieldId];
    const exitIds = activeViewFilter ? activeViewFilter.conditions.map(item => item.conditionId) : [];
    const acceptFilterOperators = Field.bindModel(firstColumns).acceptFilterOperators;
    const newOperate = acceptFilterOperators[0];
    filterCommand({
      conjunction: activeViewFilter ? activeViewFilter.conjunction : CoreFilterConjunction.And,
      conditions: [...(activeViewFilter ? activeViewFilter.conditions : []), {
        conditionId: getNewId(IDPrefix.Condition, exitIds),
        fieldId: columns[0].fieldId,
        operator: newOperate,
        fieldType: firstColumns.type as any,
        value: Field.bindModel(firstColumns).valueType === BasicValueType.DateTime ?
          [FilterDuration.ExactDate, null] : null,
      }],
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
    if (activeViewFilter!.conditions.length === 1) {
      filterCommand(null);
      return;
    }
    filterCommand({
      conjunction: activeViewFilter!.conjunction,
      conditions: activeViewFilter!.conditions.filter((item, index) => {
        return index !== idx;
      }),
    });
  }

  return (
    <div ref={containerRef} className={classNames(styles.viewFilter, styles.shadow)}>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <PopUpTitle title={t(Strings.set_filter)} infoUrl={t(Strings.filter_help_url)} variant={'h7'} className={styles.boxTop} />
        <SyncViewTip />
      </ComponentDisplay>
      <div ref={childRef} style={{ ...style, overflow: 'auto' }}>
        <ConditionList
          filterInfo={activeViewFilter}
          fieldMap={fieldMap}
          changeFilter={changeFilter}
          deleteFilter={deleteFilter}
        />
        <div ref={scrollShadowRef} className={classNames(!isMobile && styles.scrollShadow)} />
      </div>
      <div className={styles.addNewButton} onClick={commandForAddViewFilter}>
        <div className={styles.iconAdd}>
          <IconAdd width={16} height={16} fill={colors.thirdLevelText} />
        </div>
        {t(Strings.add_filter)}
      </div>
    </div>
  );
};

export const ViewFilter = React.memo(ViewFilterBase);
