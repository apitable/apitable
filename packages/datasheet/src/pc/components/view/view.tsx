import { ContextMenu, Message, useThemeColors } from '@apitable/components';
import { ConfigConstant, IReduxState, Selectors, StoreActions, Strings, SystemConfig, t, ViewType } from '@apitable/core';
import { ArrowDownOutlined, ArrowUpOutlined, CopyOutlined, DeleteOutlined, EditDescribeOutlined, EditOutlined, HideFilled } from '@apitable/icons';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { MobileGrid } from 'pc/components/mobile_grid';
import { useQuery, useResponsive } from 'pc/hooks';
import { useExpandWidget } from 'pc/hooks/use_expand_widget';
import { store } from 'pc/store';
import { flatContextData } from 'pc/utils';
import { getTestFunctionAvailable } from 'pc/utils/storage';
import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { CalendarView } from '../calendar_view';
import { ComponentDisplay, ScreenSize } from '../common/component_display';
import { expandRecordIdNavigate } from '../expand_record';
import { GalleryView } from '../gallery_view';
import { GanttView } from '../gantt_view';
import { KanbanView } from '../kanban_view';
import { KonvaGridView } from '../konva_grid';
import { GridViewContainer } from '../multi_grid';
import { OrgChartView } from '../org_chart_view';
import { Toolbar } from '../tool_bar';
import styles from './style.module.less';
import { get } from 'lodash';

export const DATASHEET_VIEW_CONTAINER_ID = 'DATASHEET_VIEW_CONTAINER_ID';
export const View: React.FC = () => {
  const colors = useThemeColors();
  const { currentView, rows, linearRows } = useSelector((state: IReduxState) => {
    const currentView = Selectors.getCurrentView(state)!;
    return {
      rows: Selectors.getVisibleRows(state),
      linearRows: Selectors.getLinearRows(state),
      currentView,
    };
  }, shallowEqual);
  const { screenIsAtMost } = useResponsive();
  const query = useQuery();
  const activeRecordId = query.get('activeRecordId');
  const views = useSelector(Selectors.getViewsList);
  const { datasheetId, mirrorId, shareId, templateId, embedId } = useSelector(state => {
    const { datasheetId, mirrorId, shareId, templateId, embedId } = state.pageParams;
    return { datasheetId, mirrorId, shareId, templateId, embedId };
  }, shallowEqual);
  const isSideRecordOpen = useSelector(state => state.space.isSideRecordOpen);
  const router = useRouter();

  useEffect(() => {
    if (!activeRecordId) {
      return;
    }
    if (activeRecordId && rows.every(row => row.recordId !== activeRecordId)) {
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

  useExpandWidget();

  const useKonva = useMemo(() => {
    return !getTestFunctionAvailable(SystemConfig.test_function.render_normal.feature_key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView.id]);

  const isOrgChart = currentView.type === ViewType.OrgChart;
  const isMobile = screenIsAtMost(ScreenSize.md);
  const embedInfo = useSelector(state => Selectors.getEmbedInfo(state));
  const isLogin = useSelector(state => state.user.isLogin);

  const isShowEmbedToolBar = useMemo(() => {
 
    if(!embedId) {
      return true;
    } 
    return (get(embedInfo, 'viewControl.toolBar.basicTools', false) && isLogin) &&
      (get(embedInfo, 'viewControl.toolBar.shareBtn', false) && isLogin) &&
      get(embedInfo, 'viewControl.toolBar.widgetBtn', false) &&
      (get(embedInfo, 'viewControl.toolBar.apiBtn', false) && isLogin) &&
      (get(embedInfo, 'viewControl.toolBar.formBtn', false) && isLogin) &&
      (get(embedInfo, 'viewControl.toolBar.historyBtn', false) && isLogin) &&
      (get(embedInfo, 'viewControl.toolBar.robotBtn', false) && isLogin);

  }, [embedInfo, embedId, isLogin]);

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
      }}
    >
      { isShowEmbedToolBar && <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <Toolbar />
      </ComponentDisplay> }
      <div style={{ flex: '1 1 auto', height: '100%' }}>
        <AutoSizer className={classNames(styles.viewContainer, 'viewContainer')} style={{ width: '100%', height: '100%' }}>
          {({ height, width }) => {
            switch (currentView.type) {
              case ViewType.Grid: {
                if (isMobile) {
                  return <MobileGrid width={width} height={height - 40} />;
                }
                return useKonva ? (
                  <KonvaGridView width={width} height={height} />
                ) : (
                  <GridViewContainer linearRows={linearRows} rows={rows} rowCount={linearRows.length} height={height} width={width} />
                );
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
                return <GridViewContainer linearRows={linearRows} rows={rows} rowCount={linearRows.length} height={height} width={width} />;
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
                hidden: ({ props }) => !props?.onEdit,
                onClick: ({ props }) => props?.onEdit && props.onEdit(),
              },
              {
                icon: <EditDescribeOutlined color={colors.thirdLevelText} />,
                text: t(Strings.editing_field_desc),
                onClick: ({ props }) => props?.onEditDesc && props.onEditDesc(),
              },
              {
                icon: <ArrowUpOutlined color={colors.thirdLevelText} />,
                text: t(Strings.insert_field_above),
                disabled: ({ props }) => !props.onInsertAbove,
                onClick: ({ props }) => props?.onInsertAbove && props.onInsertAbove(),
              },
              {
                icon: <ArrowDownOutlined color={colors.thirdLevelText} />,
                text: t(Strings.insert_field_below),
                onClick: ({ props }) => props?.onInsertBelow && props.onInsertBelow(),
              },
              {
                icon: <CopyOutlined color={colors.thirdLevelText} />,
                text: t(Strings.duplicate_field),
                hidden: ({ props }) => !props?.onCopyField,
                onClick: ({ props }) => props?.onCopyField && props.onCopyField(),
              },
              {
                icon: <HideFilled color={colors.thirdLevelText} />,
                text: t(Strings.hide_fields),
                hidden: ({ props }) => !props?.onHiddenField,
                onClick: ({ props }) => props?.onHiddenField && props.onHiddenField(),
              },
              {
                icon: <DeleteOutlined color={colors.thirdLevelText} />,
                text: t(Strings.delete_field),
                hidden: ({ props }) => !props?.onDeleteField,
                onClick: ({ props }) => props?.onDeleteField && props.onDeleteField(),
              },
            ],
          ],
          true,
        )}
      />
    </div>
  );
};
