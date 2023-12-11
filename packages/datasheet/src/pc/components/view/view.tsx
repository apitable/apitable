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
import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { shallowEqual } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { ContextMenu, Message, useThemeColors } from '@apitable/components';
import {
  ConfigConstant,
  IReduxState,
  Selectors,
  StoreActions,
  Strings,
  t,
  ViewType,
  ICellUpdatedContext,
  OPEventNameEnums,
  FieldType,
  EventSourceTypeEnums,
} from '@apitable/core';
import { ArrowDownOutlined, ArrowUpOutlined, CopyOutlined, DeleteOutlined, EditOutlined, EyeOpenOutlined, InfoCircleOutlined } from '@apitable/icons';
import { MobileGrid } from 'pc/components/mobile_grid';
import { useTriggerTypes } from 'pc/components/robot/robot_panel/hook_trigger';
import { useShowViewLockModal } from 'pc/components/view_lock/use_show_view_lock_modal';
import { useQuery, useResponsive } from 'pc/hooks';
import { useExpandWidget } from 'pc/hooks/use_expand_widget';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { flatContextData } from 'pc/utils';
import { CalendarView } from '../calendar_view';
import { ComponentDisplay, ScreenSize } from '../common/component_display';
import { expandRecordIdNavigate } from '../expand_record';
import { GalleryView } from '../gallery_view';
import { GanttView } from '../gantt_view';
import { KanbanView } from '../kanban_view';
import { KonvaGridView } from '../konva_grid';
import { OrgChartView } from '../org_chart_view';
import { Toolbar } from '../tool_bar';
import { DATASHEET_VIEW_CONTAINER_ID } from './id';
import styles from './style.module.less';
export { DATASHEET_VIEW_CONTAINER_ID };

export const View: React.FC<React.PropsWithChildren<any>> = () => {
  const colors = useThemeColors();
  const { currentView, rows, fieldMap } = useAppSelector((state: IReduxState) => {
    const currentView = Selectors.getCurrentView(state)!;
    const fieldMap = Selectors.getFieldMap(state, state.pageParams.datasheetId!)!;
    return {
      rows: Selectors.getVisibleRows(state),
      linearRows: Selectors.getLinearRows(state),
      currentView,
      fieldMap,
    };
  }, shallowEqual);

  const { data: triggerTypes } = useTriggerTypes();
  const buttonFieldTriggerId = triggerTypes.find((item) => item.endpoint === 'button_field' || item.endpoint === 'button_clicked');
  const dstId = useAppSelector(Selectors.getActiveDatasheetId);

  const { screenIsAtMost } = useResponsive();
  const query = useQuery();
  const activeRecordId = query.get('activeRecordId');
  const views = useAppSelector(Selectors.getViewsList);
  const { datasheetId, mirrorId, shareId, templateId, embedId } = useAppSelector((state) => {
    const { datasheetId, mirrorId, shareId, templateId, embedId } = state.pageParams;
    return { datasheetId, mirrorId, shareId, templateId, embedId };
  }, shallowEqual);
  const isSideRecordOpen = useAppSelector((state) => state.space.isSideRecordOpen);
  const router = useRouter();
  const isViewLock = useShowViewLockModal();

  useEffect(() => {
    if (!activeRecordId) {
      return;
    }
    if (activeRecordId && rows.every((row) => row.recordId !== activeRecordId)) {
      Message.warning({ content: t(Strings.active_record_hidden) });
    } else {
      if (datasheetId && activeRecordId) {
        store.dispatch(
          StoreActions.setActiveCell(datasheetId, {
            recordId: activeRecordId,
            fieldId: views[0].columns[0].fieldId,
          }),
        );
        if (isSideRecordOpen) {
          expandRecordIdNavigate(activeRecordId);
        }
      }
    }
    const urlObj = new URL(location.href);
    const searchParams = urlObj.searchParams;
    searchParams.delete('activeRecordId');
    router.replace(urlObj.pathname + urlObj.search);
  }, [rows, activeRecordId, datasheetId, views, isSideRecordOpen, router]);

  useEffect(() => {
    if (!datasheetId || shareId || templateId || embedId) return;

    store.dispatch(StoreActions.getSubscriptionsAction(datasheetId, mirrorId));
  }, [datasheetId, mirrorId, shareId, templateId, embedId]);

  const { opEventManager } = resourceService.instance!;

  useEffect(() => {
    const recordUpdatedCallBack = (context: ICellUpdatedContext) => {
      const { fieldId } = context;
      const field = fieldMap[fieldId];
      // While cell updated, member field with subscription open need update subscriptions
      if (field && field.type === FieldType.Member && field.property.subscription) {
        store.dispatch(StoreActions.getSubscriptionsAction(datasheetId!, mirrorId));
      }
    };
    // Only listen remote changesets of cell updated and update record subscriptions.
    opEventManager.addEventListener(OPEventNameEnums.CellUpdated, recordUpdatedCallBack, { sourceType: EventSourceTypeEnums.REMOTE });
    return () => {
      opEventManager.removeEventListener(OPEventNameEnums.CellUpdated, recordUpdatedCallBack);
    };
  }, [datasheetId, fieldMap, mirrorId, opEventManager]);

  useExpandWidget();

  const isOrgChart = currentView.type === ViewType.OrgChart;
  const isMobile = screenIsAtMost(ScreenSize.md);
  const embedInfo = useAppSelector((state) => Selectors.getEmbedInfo(state));
  const { isShowEmbedToolBar = true } = embedInfo;

  return (
    <div
      id={DATASHEET_VIEW_CONTAINER_ID}
      className={classNames(styles.gridView + ' layout-column f-g-1', {
        [styles.orgChart]: isOrgChart,
      })}
      style={{
        position: 'relative',
        padding: isMobile ? '0' : '',
        height: '100%',
        background: currentView.type === ViewType.Kanban ? colors.defaultBg : '',
        paddingLeft: isMobile || (!isShowEmbedToolBar && !embedInfo.viewControl?.tabBar) ? 0 : embedInfo.viewControl?.tabBar ? '24px' : '32px',
      }}
    >
      {isShowEmbedToolBar && (
        <ComponentDisplay minWidthCompatible={ScreenSize.md}>
          <Toolbar />
        </ComponentDisplay>
      )}
      <div
        style={{
          flex: '1 1 auto',
          height: '100%',
          paddingTop: !isShowEmbedToolBar && embedInfo.viewControl?.tabBar ? '16px' : '',
        }}
      >
        <AutoSizer className={classNames(styles.viewContainer, 'viewContainer')} style={{ width: '100%', height: '100%' }}>
          {({ height, width }) => {
            switch (currentView.type) {
              case ViewType.Grid: {
                if (isMobile) {
                  return <MobileGrid width={width} height={height - 40} />;
                }
                return <KonvaGridView width={width} height={height} />;
              }
              case ViewType.Gallery:
                return <GalleryView height={height} width={width} />;
              case ViewType.Calendar:
                return <CalendarView height={height} width={width} />;
              case ViewType.Kanban:
                return <KanbanView height={height} width={width} />;
              case ViewType.Gantt:
                return <GanttView width={width} height={height} />;
              case ViewType.OrgChart:
                return <OrgChartView width={width} height={height - (isMobile ? 40 : 0)} isMobile={isMobile} />;
              default:
                return <KonvaGridView width={width} height={height} />;
            }
          }}
        </AutoSizer>
      </div>

      <ContextMenu
        menuId={ConfigConstant.ContextMenuType.EXPAND_RECORD_FIELD}
        overlay={flatContextData(
          [
            [
              {
                icon: <EditOutlined color={colors.thirdLevelText} />,
                text: t(Strings.modify_field),
                hidden: ({ props }: any) => !props?.onEdit,
                onClick: ({ props }: any) => props?.onEdit && props.onEdit(),
              },
              {
                icon: <InfoCircleOutlined color={colors.thirdLevelText} />,
                text: t(Strings.editing_field_desc),
                onClick: ({ props }: any) => props?.onEditDesc && props.onEditDesc(),
              },
              {
                icon: <ArrowUpOutlined color={colors.thirdLevelText} />,
                text: t(Strings.insert_field_above),
                disabled: ({ props }: any) => !props.onInsertAbove,
                onClick: ({ props }: any) => props?.onInsertAbove && props.onInsertAbove(),
              },
              {
                icon: <ArrowDownOutlined color={colors.thirdLevelText} />,
                text: t(Strings.insert_field_below),
                onClick: ({ props }: any) => props?.onInsertBelow && props.onInsertBelow(),
              },
              {
                icon: <CopyOutlined color={colors.thirdLevelText} />,
                text: t(Strings.duplicate_field),
                hidden: ({ props }: any) => !props?.onCopyField,
                onClick: ({ props }: any) => props?.onCopyField && props.onCopyField(),
              },
              {
                icon: <EyeOpenOutlined color={colors.thirdLevelText} />,
                text: t(Strings.hide_fields),
                hidden: ({ props }: any) => !props?.onHiddenField,
                onClick: ({ props }: any) => props?.onHiddenField && props.onHiddenField(),
                disabled: isViewLock,
                disabledTip: t(Strings.view_lock_setting_desc),
              },
              {
                icon: <DeleteOutlined color={colors.thirdLevelText} />,
                text: t(Strings.delete_field),
                hidden: ({ props }: any) => !props?.onDeleteField,
                onClick: ({ props }: any) => props?.onDeleteField && props.onDeleteField(),
              },
            ],
          ],
          true,
        )}
      />
    </div>
  );
};
