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

import { useSize, useLocalStorageState } from 'ahooks';
import { IFuncUpdater } from 'ahooks/lib/createUseStorageState';
import { Fragment, FC, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import {
  FieldType,
  IOrgChartViewProperty,
  IReduxState,
  Selectors,
  shallowEqual,
  defaultOrgChartViewStatus as defaultViewStatus,
  StoreActions,
  ILinkField,
  IOrgChartViewStatus,
  ConfigConstant,
  CollaCommandName,
  Strings,
  t,
  ExecuteResult,
  getNewId,
  IDPrefix,
  OrgChartStyleKeyType,
  getUniqName,
  ISetRecordOptions, IOneWayLinkField,
} from '@apitable/core';
import { ReactFlowProvider } from '@apitable/react-flow';
import { TriggerCommands } from 'modules/shared/apphook/trigger_commands';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { executeCommandWithMirror } from 'pc/utils/execute_command_with_mirror';
import { getStorage, setStorage, StorageName } from 'pc/utils/storage';
import { VikaSplitPanel } from '../common';
import { useCardHeight } from '../common/hooks/use_card_height';
import { notify } from '../common/notify';
import { NotifyKey } from '../common/notify/notify.interface';
import { EdgeContextMenu } from './components/context_menu/edge_context_menu';
import { NodeContextMenu } from './components/context_menu/node_context_menu';
import { CreateFieldModal } from './components/create_field_modal';
import { Cycle } from './components/cycle/cycle';
import { OrgChartSettingPanel } from './components/org_chart_setting_panel';
import { RecordList } from './components/record_list';
import { COVER_HEIGHT, SHOW_EPMTY_COVER, SHOW_EPMTY_FIELD } from './constants';
import { FlowContext, IFlowContext } from './context/flow_context';
import { useElements } from './hooks/use_elements';
import { IGhostNodesRef, INodeStateMap, IViewNodeStateMap } from './interfaces';
import { OrgChart } from './org_chart';
// @ts-ignore
import { getWizardRunCount } from 'enterprise/guide/utils';
import styles from './styles.module.less';

const _ReactFlowProvider: any = ReactFlowProvider;

export interface IOrgChartViewProps {
  width: number;
  height: number;
  isMobile?: boolean;
}

export const OrgChartView: FC<React.PropsWithChildren<IOrgChartViewProps>> = ({ width, height, isMobile }) => {
  const {
    activeView,
    fieldMap,
    datasheetId,
    snapshot,
    currentSearchCell,
    spaceId,
    mirrorId,
    orgChartViewStatus,
    columns,
    permissions,
    fieldPermissionMap,
  } = useAppSelector((state: IReduxState) => {
    return {
      currentSearchCell: Selectors.getCurrentSearchItem(state),
      activeView: Selectors.getCurrentView(state) as IOrgChartViewProperty,
      columns: Selectors.getOrgChartVisibleColumns(state),
      datasheetId: Selectors.getActiveDatasheetId(state)!,
      fieldMap: Selectors.getFieldMap(state)!,
      fieldPermissionMap: Selectors.getFieldPermissionMap(state),
      permissions: Selectors.getPermissions(state),
      snapshot: Selectors.getSnapshot(state)!,
      mirrorId: state.pageParams.mirrorId,
      spaceId: state.space.activeId!,
      orgChartViewStatus: Selectors.getOrgChartViewStatus(state)!,
    };
  }, shallowEqual);

  const { style: orgChartStyle, id: viewId } = activeView;

  const { linkFieldId, horizontal } = orgChartStyle;
  const linkField = fieldMap[linkFieldId] as ILinkField | IOneWayLinkField;
  const linkFieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, linkFieldId);
  const isCryptoLinkField = Boolean(linkFieldRole && linkFieldRole === ConfigConstant.Role.None);
  const isFieldDeleted = Boolean(linkFieldId && !isCryptoLinkField && !linkField);
  const isFieldInvalid = linkField && linkField.property?.foreignDatasheetId !== datasheetId;
  const isReaderLinkField = Boolean(linkFieldRole && linkFieldRole === ConfigConstant.Role.Reader);

  const dispatch = useDispatch();
  const [nodeStateMap, _setNodeStateMap] = useLocalStorageState<IViewNodeStateMap>(StorageName.OrgChartNodeStateMap);
  const [quickAddRecId, setQuickAddRecId] = useState<string>();

  const overGhostRef = useRef<IGhostNodesRef | null>(null);

  const nodeMapId = `${datasheetId}-${viewId}`;
  const setNodeStateMap = (value: INodeStateMap | IFuncUpdater<INodeStateMap> | undefined) => {
    if (typeof value === 'function') {
      _setNodeStateMap({
        [nodeMapId]: value(nodeStateMap?.[nodeMapId]),
      });
    } else {
      _setNodeStateMap({
        ...nodeStateMap,
        [nodeMapId]: value || {},
      });
    }
  };

  const { rightPanelVisible, rightPanelWidth, settingPanelVisible: _settingPanelVisible, settingPanelWidth } = orgChartViewStatus;
  const settingPanelVisible = (permissions.visualizationEditable || permissions.editable) && _settingPanelVisible;

  const containerRef = useRef<HTMLDivElement>(null);
  const containerSize = useSize(containerRef);

  const { offsetLeft, offsetTop } = useMemo(() => {
    if (containerRef.current) {
      const { left, top } = containerRef.current.getBoundingClientRect();
      return {
        offsetLeft: left,
        offsetTop: top,
      };
    }
    return {
      offsetLeft: 0,
      offsetTop: 0,
    };
    // eslint-disable-next-line
  }, [containerRef.current, containerSize, rightPanelVisible, settingPanelVisible]);

  const bodySize = {
    width: width + offsetLeft + 2,
    height: height + offsetTop,
  };

  const { coverFieldId, isColNameVisible } = orgChartStyle;
  const _getCardHeight = useCardHeight({
    cardCoverHeight: COVER_HEIGHT,
    isColNameVisible,
    coverFieldId,
    showEmptyCover: SHOW_EPMTY_COVER,
    showEmptyField: SHOW_EPMTY_FIELD,
    visibleColumns: columns,
  });

  const getCardHeight = (recordId: string | null) => {
    return _getCardHeight(recordId, isMobile);
  };

  const primaryFieldId = columns[0].fieldId;

  const fieldEditable = !isMobile && !isCryptoLinkField && !isFieldDeleted && !isFieldInvalid && !isReaderLinkField && permissions.cellEditable;

  const fieldVisible = !isCryptoLinkField && !isFieldDeleted && !isFieldInvalid;

  const { initialElements, unhandledNodes, cycleElements, nodesMap, handlingCount, pre, bounds } = useElements({
    linkFieldId,
    fieldMap,
    getCardHeight,
    nodeStateMap: nodeStateMap?.[nodeMapId] || {},
    rows: activeView.rows,
    datasheetId,
    primaryFieldId,
    snapshot,
    fieldVisible,
    fieldEditable,
    horizontal,
  });

  const hasLinkField = activeView.columns.some(
    (c) => [FieldType.Link, FieldType.OneWayLink].includes(fieldMap[c.fieldId].type) && fieldMap[c.fieldId].property.foreignDatasheetId === datasheetId,
  );

  const setMenuVisible = (visible: boolean) => {
    const orgChartStatusMap = getStorage(StorageName.OrgChartStatusMap);
    let status: Partial<IOrgChartViewStatus> = {};
    if (orgChartStatusMap) {
      status = orgChartStatusMap[`${spaceId}_${datasheetId}_${viewId}`] || {};
      if (settingPanelVisible) {
        dispatch(
          batchActions([StoreActions.toggleOrgChartRightPanel(visible, datasheetId), StoreActions.toggleOrgChartSettingPanel(false, datasheetId)]),
        );
      } else {
        dispatch(StoreActions.toggleOrgChartRightPanel(visible, datasheetId));
      }
    }
    setStorage(StorageName.OrgChartStatusMap, {
      [`${spaceId}_${datasheetId}_${viewId}`]: {
        ...status,
        rightPanelVisible: settingPanelVisible ? true : visible,
        settingPanelVisible: false,
      },
    });
    window.dispatchEvent(new Event('resize'));
  };

  const handleSettingPanelClose = () => {
    const { guideStatus } = orgChartViewStatus;
    if (guideStatus) {
      dispatch(StoreActions.toggleOrgChartSettingPanel(false, datasheetId));
    } else {
      dispatch(
        batchActions([
          StoreActions.toggleOrgChartSettingPanel(false, datasheetId),
          StoreActions.toggleOrgChartGuideStatus(true, datasheetId),
          StoreActions.toggleOrgChartRightPanel(true, datasheetId),
        ]),
      );
    }
    const restStatus = guideStatus ? {} : { guideStatus: true, guideWidth: true };
    setStorage(StorageName.OrgChartStatusMap, {
      [`${spaceId}_${datasheetId}_${viewId}`]: {
        ...orgChartViewStatus,
        settingPanelVisible: false,
        ...restStatus,
      },
    });
  };

  const addField = () => {
    if (!permissions.manageable) {
      return;
    }
    const newId = getNewId(IDPrefix.Field);
    const exitFieldNames = Object.values(fieldMap).map((field) => field.name);

    const field: ILinkField = {
      id: newId,
      name: getUniqName(t(Strings.field_title_link), exitFieldNames),
      type: FieldType.Link,
      property: {
        foreignDatasheetId: datasheetId,
      },
    };

    const result = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.AddFields,
      data: [
        {
          data: field,
          viewId,
          index: activeView.columns.length,
        },
      ],
    });

    if (ExecuteResult.Success === result.result) {
      notify.open({
        message: t(Strings.toast_add_field_success),
        key: NotifyKey.AddField,
      });

      executeCommandWithMirror(
        () => {
          resourceService.instance!.commandManager.execute({
            cmd: CollaCommandName.SetOrgChartStyle,
            viewId,
            styleKey: OrgChartStyleKeyType.LinkFieldId,
            styleValue: newId,
          });
        },
        {
          style: {
            ...orgChartStyle,
            [OrgChartStyleKeyType.LinkFieldId]: newId,
          },
        },
      );
    }
  };

  useEffect(() => {
    const storeOrgChartViewStatus = getStorage(StorageName.OrgChartStatusMap);
    const orgChartViewStatus = storeOrgChartViewStatus?.[`${spaceId}_${datasheetId}_${viewId}`] || {};
    const defaultOrgChartViewStatus = {
      ...defaultViewStatus,
      ...orgChartViewStatus,
    };
    const _rightPanelVisible = !isMobile && defaultOrgChartViewStatus.rightPanelVisible && !isFieldDeleted && !isFieldInvalid;
    const _settingPanelVisible = Boolean(
      (!isMobile && !mirrorId && defaultOrgChartViewStatus.settingPanelVisible) || isFieldDeleted || isFieldInvalid,
    );
    dispatch(
      batchActions([
        StoreActions.toggleCalendarGuideStatus(defaultOrgChartViewStatus.guideStatus, datasheetId),
        StoreActions.toggleOrgChartRightPanel(_rightPanelVisible, datasheetId),
        StoreActions.toggleOrgChartSettingPanel(_settingPanelVisible, datasheetId),
        StoreActions.setOrgChartGridPanel(defaultOrgChartViewStatus.rightPanelWidth, datasheetId),
        StoreActions.setOrgChartSettingPanelWidth(defaultOrgChartViewStatus.settingPanelWidth, datasheetId),
      ]),
    );
    // eslint-disable-next-line
  }, [viewId]);

  const handleChange = (data: ISetRecordOptions[]) => {
    if (data.length) {
      resourceService.instance!.commandManager.execute({
        cmd: CollaCommandName.SetRecords,
        datasheetId,
        data,
      });
    }
  };

  const contextValue: IFlowContext = {
    nodesMap,
    pre,
    nodeStateMap: nodeStateMap?.[nodeMapId] || {},
    setNodeStateMap,
    orgChartStyle,
    isCryptoLinkField,
    isFieldDeleted,
    isFieldInvalid,
    orgChartViewStatus,
    unhandledNodes,
    handlingCount,
    getCardHeight,
    initialElements,
    viewId,
    menuVisible: rightPanelVisible,
    setMenuVisible,
    datasheetId,
    cycleElements,
    currentSearchCell,
    bodySize,
    offsetLeft,
    offsetTop,
    columns,
    permissions,
    linkField,
    rowsCount: activeView.rows.length,
    fieldEditable,
    onChange: handleChange,
    overGhostRef,
    primaryFieldId,
    quickAddRecId,
    setQuickAddRecId,
    horizontal,
    bounds,
  };

  const user = useAppSelector((state) => state.user);
  /****** User guidance ******/
  const wizardHandler = () => {
    // There are no link nodes and the architecture view is created ORG_VIEW_CREATE is executed before ORG_VIEW_PANEL is executed
    const handledCount = activeView.rows.length - unhandledNodes.length - handlingCount; // Number of link nodes
    const hadRunPrevWizard = getWizardRunCount?.(user, ConfigConstant.WizardIdConstant.ORG_VIEW_CREATE);
    if (hadRunPrevWizard) {
      if (!handledCount) {
        TriggerCommands.open_guide_wizard?.(ConfigConstant.WizardIdConstant.ORG_VIEW_PANEL);
      } else {
        TriggerCommands.set_wizard_completed?.({ wizardId: ConfigConstant.WizardIdConstant.ORG_VIEW_PANEL });
        TriggerCommands.set_wizard_completed?.({ wizardId: ConfigConstant.WizardIdConstant.ORG_VIEW_ADD_FIRST_NODE });
      }
    }
  };
  // Click on "Create Magical Associated Columns" and the next step appears
  useEffect(() => {
    if (!(!linkField && !hasLinkField)) {
      wizardHandler();
    }
    // eslint-disable-next-line
  }, [linkField, hasLinkField]);

  // Click on the right panel to bring up the next step
  useEffect(() => {
    const el = document.getElementById('DATASHEET_ORG_CHART_RECORD_LIST');
    const handler = () => {
      wizardHandler();
      el && el.removeEventListener('mousedown', handler);
    };
    el && el.addEventListener('mousedown', handler);
    return () => {
      el && el.removeEventListener('mousedown', handler);
    };
  });
  /****** end ******/

  let panelRight = <Fragment />;
  let size = 0;
  if (settingPanelVisible) {
    panelRight = <OrgChartSettingPanel onClose={handleSettingPanelClose} onAddField={addField} />;
    size = settingPanelWidth;
  } else if (rightPanelVisible && cycleElements.length === 0) {
    panelRight = <RecordList nodes={unhandledNodes} onClose={() => setMenuVisible(false)} disabled={!permissions.editable} />;
    size = rightPanelWidth;
  }

  if (cycleElements.length) {
    return (
      <FlowContext.Provider value={contextValue}>
        <VikaSplitPanel
          primary="second"
          split="vertical"
          style={{ overflow: 'none' }}
          size={size}
          allowResize={false}
          panelLeft={
            <_ReactFlowProvider>
              <div
                className={styles.orgChartView}
                onContextMenu={(e) => {
                  e.preventDefault();
                }}
                style={{ height }}
              >
                <Cycle elements={cycleElements} />
              </div>
            </_ReactFlowProvider>
          }
          panelRight={panelRight}
        />
      </FlowContext.Provider>
    );
  }

  return (
    <FlowContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        style={{ height }}
        className={styles.orgChartView}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        <VikaSplitPanel
          primary="second"
          split="vertical"
          style={{ overflow: 'none' }}
          size={size}
          allowResize={false}
          panelLeft={
            <_ReactFlowProvider>
              <OrgChart />
              {fieldVisible && linkField && (
                <>
                  <NodeContextMenu />
                  <EdgeContextMenu />
                </>
              )}
            </_ReactFlowProvider>
          }
          panelRight={panelRight}
        />
      </div>
      {!linkField && !hasLinkField && <CreateFieldModal onAdd={addField} />}
    </FlowContext.Provider>
  );
};

OrgChartView.displayName = 'OrgChartView';
