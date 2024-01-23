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

import { Modal as ModalComponent, Spin } from 'antd';
import * as React from 'react';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { black, ContextMenu as ContextMenuList, deepPurple, IContextMenuClickState, Switch } from '@apitable/components';
import {
  Api,
  CollaCommandName,
  ConfigConstant,
  DATASHEET_ID,
  DatasheetActions,
  ExecuteResult,
  getMaxViewCountPerSheet,
  getUniqName,
  IPermissions,
  IViewProperty,
  Selectors,
  StoreActions,
  Strings,
  t,
  ViewType,
} from '@apitable/core';
import { AutosaveOutlined, ChevronRightOutlined, LoadingOutlined, LockOutlined } from '@apitable/icons';
import { makeNodeIconComponent, NodeIcon } from 'pc/components/catalog/node_context_menu';
import { Modal } from 'pc/components/common';
import { useViewAction } from 'pc/components/tool_bar/view_switcher/action';
import { expandViewLock } from 'pc/components/view_lock/expand_view_lock';
import { changeView } from 'pc/hooks';
import { useCatalog } from 'pc/hooks/use_catalog';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { exportDatasheet, flatContextData } from 'pc/utils';
import { isMobileApp } from 'pc/utils/env';
import { confirmViewAutoSave } from '../../view_sync_switch/popup_content/pc';

interface IContextMenuProps {
  activeViewId: string | undefined;
  activeNodeId: string | undefined;
  folderId: string | undefined;
  viewList: IViewProperty[];
  permissions: IPermissions;
  contextMenu: IContextMenuClickState;
  setEditIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

export const ContextMenu: React.FC<React.PropsWithChildren<IContextMenuProps>> = (props) => {
  const {
    activeViewId,
    viewList,
    // formList,
    activeNodeId,
    folderId,
    permissions,
    setEditIndex,
    contextMenu,
  } = props;
  const { addTreeNode } = useCatalog();
  const dispatch = useDispatch();
  const formCreatable = useAppSelector((state) => {
    const { editable } = permissions;
    const { manageable } = state.catalogTree.treeNodesMap[folderId!]?.permissions || {};

    return manageable && editable;
  });
  const [showDeleteTip, setShowDeleteTip] = useState(false);
  const shareId = useAppSelector((state) => state.pageParams.shareId);
  const currentViewId = useAppSelector((state) => Selectors.getActiveViewId(state));
  const { manageable: viewSyncManageable } = permissions;
  const mirrorCreatable = useAppSelector((state) => {
    const { manageable } = permissions;
    const { manageable: folderManageable } = state.catalogTree.treeNodesMap[folderId!]?.permissions || {};
    return manageable && folderManageable;
  });
  const view = viewList.find((item) => item.id === activeViewId);
  const viewAllowCreateForm = useMemo(() => {
    if (!view) {
      return false;
    }
    return view.type === ViewType.Grid;
  }, [view]);
  const { deleteView } = useViewAction();
  const spaceManualSaveViewIsOpen = useAppSelector((state) => {
    return state.labs.includes('view_manual_save');
  });

  const isViewCountOverLimit = Boolean(viewList.length >= getMaxViewCountPerSheet());

  const confirmDelete = (currentViewId: string) => {
    if (currentViewId === activeViewId) {
      // If the deleted view is the currently displayed view, switch the active view to another view in the view list
      if (viewList.findIndex((item) => item.id === currentViewId) === 0) {
        changeView(viewList[1]['id']);
      } else {
        changeView(viewList[0]['id']);
      }
    }
    deleteView(currentViewId);
  };

  const handleRenameItem = (args: any) => {
    const {
      props: { tabIndex },
    } = args;
    setEditIndex(tabIndex);
    return;
  };

  const handleForDeleteView = async (args: any) => {
    const {
      props: { tabIndex },
    } = args;
    let content = t(Strings.del_view_content, {
      view_name: viewList[tabIndex].name,
    });
    const [
      formList,
      {
        data: { data: mirrorList },
      },
    ] = await Promise.all([
      StoreActions.fetchForeignFormList(activeNodeId!, activeViewId!),
      Api.getRelateNodeByDstId(activeNodeId!, activeViewId!, ConfigConstant.NodeType.MIRROR),
    ]);

    if (formList?.length > 0) {
      content = t(Strings.notes_delete_the_view_linked_to_form, {
        view_name: viewList[tabIndex].name,
      });
    }

    if (mirrorList?.length > 0) {
      content = t(Strings.notes_delete_the_view_linked_to_mirror, {
        view_name: viewList[tabIndex].name,
      });
    }

    Modal.confirm({
      title: t(Strings.delete_view),
      content: content,
      onOk: () => {
        confirmDelete(viewList[tabIndex].id);
      },
      type: 'danger',
    });
  };

  const exportTypeCsv = (args: any) => {
    const {
      props: { tabIndex },
    } = args;
    exportDatasheet(activeNodeId!, ConfigConstant.EXPORT_TYPE_CSV, { view: Selectors.getViewsList(store.getState())[tabIndex] });
  };

  const exportTypeXlsx = (args: any) => {
    const {
      props: { tabIndex },
    } = args;
    exportDatasheet(activeNodeId!, ConfigConstant.EXPORT_TYPE_XLSX, { view: Selectors.getViewsList(store.getState())[tabIndex] });
  };

  const exportTypeImage = (args: any) => {
    const {
      props: { tabIndex },
    } = args;
    const viewId = Selectors.getViewsList(store.getState())[tabIndex].id;
    if (currentViewId !== viewId) return;
    ModalComponent.success({
      icon: null,
      title: <Spin style={{ width: '100%' }} indicator={<LoadingOutlined className="circle-loading" size={16} color={deepPurple[500]} />} />,
      content: t(Strings.export),
      width: 180,
      style: {
        textAlign: 'center',
      },
      centered: true,
      okButtonProps: {
        style: {
          display: 'none',
        },
      },
    });
    setTimeout(() => {
      dispatch(StoreActions.activeExportViewId(viewId, activeNodeId!));
    }, 200);
  };

  const duplicateView = (args: any) => {
    const {
      props: { tabIndex },
    } = args;
    const view = viewList[tabIndex] as IViewProperty;
    const snapshot = Selectors.getSnapshot(store.getState());
    const { id: newId } = DatasheetActions.deriveDefaultViewProperty(snapshot!, view.type, view.id);
    const { result } = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.AddViews,
      data: [
        {
          startIndex: tabIndex + 1,
          view: {
            ...view,
            id: newId,
            name: getUniqName(
              view.name + t(Strings.copy),
              viewList.map((v) => v.name),
            ),
            lockInfo: undefined,
          },
        },
      ],
    });

    if (ExecuteResult.Success === result) {
      changeView(newId);
    }
  };

  const addForm = () => {
    const activeViewName = viewList.find((item) => item.id === activeViewId)?.name;
    const nodeName = activeViewName ? `${activeViewName}${t(Strings.key_of_adjective)}${t(Strings.view_form)}` : undefined;
    addTreeNode(
      folderId,
      ConfigConstant.NodeType.FORM,
      {
        datasheetId: activeNodeId,
        viewId: activeViewId,
      },
      nodeName,
    );
  };

  const addMirror = () => {
    const activeViewName = viewList.find((item) => item.id === activeViewId)?.name;
    const nodeName = activeViewName ? `${activeViewName}${t(Strings.key_of_adjective)}${t(Strings.mirror)}` : undefined;
    addTreeNode(
      folderId,
      ConfigConstant.NodeType.MIRROR,
      {
        datasheetId: activeNodeId,
        viewId: activeViewId,
      },
      nodeName,
    );
  };

  const openViewLock = (args: any) => {
    const {
      props: { tabIndex },
    } = args;
    expandViewLock(viewList[tabIndex].id);
  };

  const contextMenuList = [
    [
      {
        icon: makeNodeIconComponent(NodeIcon.Rename), // <RenameIcon />,
        text: t(Strings.rename_view),
        onClick: handleRenameItem,
        hidden: !permissions.viewRenamable,
        id: DATASHEET_ID.VIEW_OPERATION_ITEM_RENAME,
      },
      {
        icon: makeNodeIconComponent(NodeIcon.Copy), // <RenameIcon />,
        text: t(Strings.copy_view),
        onClick: duplicateView,
        hidden: !permissions.viewCreatable,
        disabled: isViewCountOverLimit,
        disabledTip: t(Strings.view_count_over_limit, { count: getMaxViewCountPerSheet() }),
        id: DATASHEET_ID.VIEW_OPERATION_ITEM_COPY,
      },
      {
        icon: makeNodeIconComponent(NodeIcon.AddForm), // <FormIcon />,
        text: t(Strings.create_view_form),
        onClick: addForm,
        hidden: !viewAllowCreateForm || !formCreatable,
        id: DATASHEET_ID.VIEW_OPERATION_ITEM_COPY_FORM,
      },
      {
        icon: makeNodeIconComponent(NodeIcon.Mirror), // <FormIcon />,
        text: t(Strings.create_mirror),
        onClick: addMirror,
        hidden: !mirrorCreatable,
        id: DATASHEET_ID.VIEW_OPERATION_ITEM_COPY_MIRROR,
      },
    ],
    [
      {
        icon: <LockOutlined />,
        shortcutKey: <Switch size={'small'} />,
        text: t(Strings.view_lock),
        onClick: openViewLock,
        hidden: (arg: any) => {
          if (!permissions.manageable) {
            return true;
          }
          const {
            props: { tabIndex },
          } = arg;
          const view = viewList[tabIndex];
          return Boolean(view.lockInfo);
        },
        id: DATASHEET_ID.VIEW_OPERATION_ITEM_LOCK,
      },
      {
        icon: <LockOutlined />,
        shortcutKey: <Switch size={'small'} checked />,
        text: t(Strings.view_lock),
        onClick: openViewLock,
        hidden: (arg: any) => {
          if (!permissions.manageable) {
            return true;
          }
          const {
            props: { tabIndex },
          } = arg;
          const view = viewList[tabIndex];
          return !view.lockInfo;
        },
        id: DATASHEET_ID.VIEW_OPERATION_ITEM_LOCK_CHECK,
      },
      {
        icon: <AutosaveOutlined />,
        text: t(Strings.auto_save_view_property) + ' ',
        shortcutKey: <Switch size={'small'} />,
        onClick: () => {
          confirmViewAutoSave(false, activeNodeId!, activeViewId!, shareId);
        },
        hidden: Boolean(view?.autoSave) || !spaceManualSaveViewIsOpen || !viewSyncManageable,
        id: DATASHEET_ID.VIEW_OPERATION_ITEM_CHANGE_AUTO_SAVE,
      },
      {
        icon: <AutosaveOutlined />,
        text: t(Strings.auto_save_view_property),
        shortcutKey: <Switch size={'small'} checked />,
        onClick: () => {
          confirmViewAutoSave(true, activeNodeId!, activeViewId!, shareId);
        },
        hidden: !view?.autoSave || !spaceManualSaveViewIsOpen || !viewSyncManageable,
        id: DATASHEET_ID.VIEW_OPERATION_ITEM_CHANGE_AUTO_SAVE_CHECK,
      },
    ],
    [
      {
        icon: makeNodeIconComponent(NodeIcon.Export), // <ExportIcon />,
        text: t(Strings.view_export_to_excel),
        hidden: !permissions.exportable || isMobileApp(),
        id: DATASHEET_ID.VIEW_EXPORT,
        arrow: <ChevronRightOutlined size={10} color={black[500]} />,
        children: [
          {
            // icon: makeNodeIconComponent(NodeIcon.Csv), // <CsvIcon />,
            text: t(Strings.csv),
            onClick: exportTypeCsv,
            id: DATASHEET_ID.VIEW_OPERATION_ITEM_EXPORT_VIEW_TO_CSV,
          },
          {
            // icon: makeNodeIconComponent(NodeIcon.Excel), // <ExcelIcon />,
            text: t(Strings.excel),
            onClick: exportTypeXlsx,
            id: DATASHEET_ID.VIEW_OPERATION_ITEM_EXPORT_VIEW_TO_EXCEL,
          },
          {
            // icon: makeNodeIconComponent(NodeIcon.Image), // <ImageIcon />,
            text: t(Strings.png),
            onClick: exportTypeImage,
            id: DATASHEET_ID.VIEW_OPERATION_ITEM_EXPORT_VIEW_TO_IMAGE,
            hidden: ![ViewType.Grid, ViewType.Gantt].includes(view?.type as ViewType),
            disabled: activeViewId !== currentViewId,
            disabledTip: t(Strings.export_view_image_warning),
          },
        ],
      },
    ],
    [
      {
        icon: makeNodeIconComponent(NodeIcon.Delete), // <CopyIcon />,
        text: t(Strings.delete_view),
        onClick: handleForDeleteView,
        hidden: !permissions.viewRemovable,
        id: DATASHEET_ID.VIEW_OPERATION_ITEM_DELETE,
        disabled: (arg: any) => {
          const {
            props: { tabIndex },
          } = arg;
          const view = viewList[tabIndex];
          setShowDeleteTip(Boolean(view.lockInfo));
          return Boolean(view.lockInfo);
        },
        disabledTip: showDeleteTip ? t(Strings.view_has_locked_not_deletes) : undefined,
      },
    ],
  ];

  if (viewList.length === 1) {
    contextMenuList.pop();
  }

  const contextMenuData = flatContextData(contextMenuList);

  return <ContextMenuList contextMenu={contextMenu} overlay={contextMenuData} />;
};
