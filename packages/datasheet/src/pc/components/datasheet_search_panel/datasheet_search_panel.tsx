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

import {
  Api,
  ConfigConstant,
  DatasheetApi,
  Events,
  IMeta,
  INode,
  IParent,
  Player,
  Selectors,
  StoreActions,
  Strings,
  t,
  ViewType,
} from '@apitable/core';
import { useMount, usePrevious } from 'ahooks';
import throttle from 'lodash/throttle';
import { ButtonPlus, Loading, Tooltip } from 'pc/components/common';
import { SearchControl } from 'pc/components/common/search_control';
import { FolderBreadcrumb } from 'pc/components/datasheet_search_panel/folder_breadcrumb';
import { FolderContent, ICommonNode } from 'pc/components/datasheet_search_panel/folder_content';
import { SearchResult } from 'pc/components/datasheet_search_panel/search_result';
import { SubColumn } from 'pc/components/datasheet_search_panel/sub_column';
import { useResponsive } from 'pc/hooks';
import { useThemeColors } from '@apitable/components';
import { KeyCode, stopPropagation } from 'pc/utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import HelpIcon from 'static/icon/common/common_icon_information.svg';
import IconNarrow from 'static/icon/datasheet/datasheet_icon_narrow_record.svg';
import { ScreenSize } from '../common/component_display/enum';
import { Popup } from '../common/mobile/popup';
import { useFocusEffect } from '../editors/hooks/use_focus_effect';
import styles from './style.module.less';

interface ISearchPanelProps {
  folderId: string;
  activeDatasheetId: string;
  setSearchPanelVisible(v: boolean);
  onChange(result: { datasheetId?: string; mirrorId?: string; viewId?: string; widgetIds?: string[] });
  noCheckPermission?: boolean;
  subColumnType?: SubColumnType;
  showMirrorNode?: boolean;
}

export enum SubColumnType {
  Widget,
  View,
}

const DISABLE_TIP = {
  permission: {
    budget: t(Strings.permission_no_permission_access),
    message: t(Strings.message_can_not_associated_because_of_no_editable),
  },
  fieldLimit: {
    budget: t(Strings.permission_fields_count_up_to_bound),
    message: t(Strings.message_fields_count_up_to_bound),
  },
};

const getModalTitle = (subColumnType?: SubColumnType) => {
  switch (subColumnType) {
    case SubColumnType.Widget: {
      return t(Strings.select_widget_Import_widget);
    }
    case SubColumnType.View: {
      return t(Strings.create_form_panel_title);
    }
    default: {
      return t(Strings.check_link_table);
    }
  }
};

const SearchPanelBase: React.FC<ISearchPanelProps> = props => {
  const colors = useThemeColors();
  const { activeDatasheetId, noCheckPermission, folderId, subColumnType, showMirrorNode } = props;
  const showSubColumnWithView = subColumnType === SubColumnType.View;
  const showSubColumnWithWidget = subColumnType === SubColumnType.Widget;
  const editorRef = useRef<{ focus() } | null>(null);

  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState<{ folders: INode[]; files: INode[] } | string>('');

  const [currentFolderId, setCurrentFolderId] = useState<string>(folderId);
  const [currentDatasheetId, setCurrentDatasheetId] = useState<string>(activeDatasheetId);
  const [currentMirrorId, setCurrentMirrorId] = useState<string>('');
  const [currentViewId, setCurrentViewId] = useState<string>('');

  const [currentMeta, setCurrentMeta] = useState<IMeta | null>(null);

  const [parents, setParents] = useState<IParent[]>([]);
  const [nodes, setNodes] = useState<ICommonNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [onlyShowEditableNode, setOnlyShowEditableNode] = useState<boolean>(() => {
    if (showSubColumnWithView) {
      return true;
    }
    return false;
  });
  const [folderLoaded, setFolderLoaded] = useState<boolean>(false);

  const { screenIsAtMost } = useResponsive();
  const previousCurrentFolderId = usePrevious(currentFolderId);
  const isMobile = screenIsAtMost(ScreenSize.md);
  const dispatch = useDispatch();

  const spaceId = useSelector(state => state.space.activeId!);
  const datasheet = useSelector(state => {
    return currentDatasheetId ? Selectors.getDatasheet(state, currentDatasheetId) : undefined;
  });
  const mirror = useSelector(state => {
    return currentMirrorId ? Selectors.getMirror(state, currentMirrorId) : undefined;
  });
  const isEmbed = useSelector(state => Boolean(state.pageParams.embedId));

  const search = useMemo(() => {
    return throttle((spaceId: string, val: string) => {
      Api.searchNode(spaceId, val.trim()).then(res => {
        const { data, success } = res.data;
        if (success) {
          const folders = data.filter(node => node.type === ConfigConstant.NodeType.FOLDER);
          const files = data.filter(node => node.type === ConfigConstant.NodeType.DATASHEET);
          setShowSearch(true);
          setCurrentFolderId(props.folderId);
          if (!folders.length && !files.length) {
            setSearchResult(val);
            return;
          }
          setSearchResult({ folders, files });
        }
      });
    }, 500);
  }, [props.folderId]);

  useEffect(() => {
    setLoading(true);
    setFolderLoaded(false);
    Promise.all([Api.getParents(currentFolderId), Api.getChildNodeList(currentFolderId)])
      .then(list => {
        const [parentsRes, childNodeListRes] = list;
        if (parentsRes.data.success) {
          setParents(parentsRes.data.data);
        }

        if (childNodeListRes.data.success) {
          const nodes = childNodeListRes.data.data || [];
          setShowSearch(false);
          setNodes(nodes);
        }
      })
      .catch()
      .then(() => {
        setLoading(false);
        setFolderLoaded(true);
      });
  }, [currentFolderId]);

  useFocusEffect(() => {
    editorRef.current && editorRef.current.focus();
  });

  useEffect(() => {
    if (!showSubColumnWithView && datasheet) {
      props.onChange({ datasheetId: datasheet.id });
    }
    if (!showSubColumnWithView && mirror) {
      props.onChange({ mirrorId: mirror.id });
    }
    if (showSubColumnWithView && currentMeta && folderLoaded) {
      const views = currentMeta.views;
      const viewNodes = views
        .filter(view => {
          return view.type === ViewType.Grid;
        })
        .map(({ id, name, type, columns }) => ({
          nodeId: id,
          nodeName: name,
          type: ConfigConstant.NodeType.VIEW,
          viewType: type,
          columns,
        }));
      const tempNodes = nodes.filter(node => node.type !== ConfigConstant.NodeType.VIEW);
      const index = tempNodes.findIndex(node => node.nodeId === currentDatasheetId);
      tempNodes.splice(index + 1, 0, ...viewNodes);
      setNodes(tempNodes);
      if (viewNodes.length) {
        setCurrentViewId(viewNodes[0].nodeId);
      }
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [datasheet, props, folderLoaded, showSubColumnWithView, currentMeta, currentDatasheetId, currentMirrorId, mirror]);

  useMount(() => {
    if (showSubColumnWithView && currentMeta == null) {
      searchDatasheetMetaData(activeDatasheetId);
    }
  });

  useEffect(() => {
    if (!searchValue) {
      setShowSearch(false);
      setCurrentFolderId(currentFolderId);
      return;
    }
    (previousCurrentFolderId === currentFolderId || props.folderId === currentFolderId) && search(spaceId, searchValue);
    // eslint-disable-next-line
  }, [search, spaceId, searchValue, currentFolderId, props.folderId]);

  useEffect(() => {
    return () => {
      Player.doTrigger(Events.datasheet_search_panel_hidden);
    };
  }, []);
  useEffect(() => {
    if (loading) {
      return;
    }
    setTimeout(() => {
      Player.doTrigger(showSubColumnWithView ? Events.workbench_create_form_panel_shown : Events.datasheet_search_panel_shown);
    }, 1000);
  }, [loading, showSubColumnWithView]);

  const searchDatasheetMetaData = (datasheetId: string) => {
    if (!datasheetId || !showSubColumnWithView) {
      return;
    }
    setLoading(true);
    DatasheetApi.fetchDatasheetMeta(datasheetId).then(res => {
      const { data, success } = res.data;
      if (success) {
        setCurrentMeta(data);
        setLoading(false);
        if (data.views?.length) {
          setCurrentViewId(data.views[0].id);
        }
        setCurrentDatasheetId(datasheetId);
      }
    });
  };

  const hidePanel = e => {
    stopPropagation(e);
    props.setSearchPanelVisible(false);
  };

  const onCancelClick = () => {
    setSearchValue('');
    editorRef.current!.focus();
  };

  const onClickPortalContainer = (e: React.MouseEvent<HTMLDivElement>) => {
    stopPropagation(e);
    if (e.target === e.currentTarget) {
      hidePanel(e);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.keyCode === KeyCode.Esc) {
      hidePanel(e);
    }
  };

  const _onViewClick = (id: string) => {
    const hasView = currentMeta?.views.some(view => view.id === id);
    if (hasView) {
      setCurrentViewId(id);
    }
  };

  const _onMirrorClick = (id: string) => {
    if (currentMirrorId !== id) {
      setLoading(true);
      setCurrentMirrorId(id);
      dispatch(StoreActions.fetchMirrorPack(id) as any);
    }
  };

  const _onDatasheetClick = (id: string) => {
    if (currentDatasheetId === id) {
      return;
    }
    if (showSubColumnWithWidget) {
      setLoading(true);
      setCurrentDatasheetId(id);
      return;
    }
    if (showSubColumnWithView) {
      setLoading(true);
      setCurrentMeta(null);
      setCurrentViewId('');
      searchDatasheetMetaData(id);
      return;
    }
    setLoading(true);
    setCurrentDatasheetId(id);
    dispatch(StoreActions.fetchDatasheet(id) as any);
  };

  const _onFolderClick = (id: string) => {
    setCurrentFolderId(id);
    setCurrentDatasheetId('');
    setCurrentMeta(null);
    setCurrentViewId('');
  };

  /**
   * @description To determine if the current node can be selected, check the node's permissions
   */
  const checkNodeDisable = (node: INode) => {
    if (node.type === ConfigConstant.NodeType.VIEW || noCheckPermission) {
      return;
    }
    let disable: { budget: string; message: string } | undefined;

    if (!node.permissions.editable) {
      disable = DISABLE_TIP.permission;
    }

    if (node.columnLimit) {
      disable = DISABLE_TIP.fieldLimit;
    }
    return disable;
  };

  const onNodeClick = (nodeType: 'Mirror' | 'Datasheet' | 'View' | 'Folder', id: string) => {
    switch (nodeType) {
      case 'Datasheet': {
        _onDatasheetClick(id);
        break;
      }
      case 'Folder': {
        _onFolderClick(id);
        break;
      }
      case 'Mirror': {
        _onMirrorClick(id);
        break;
      }
      case 'View': {
        _onViewClick(id);
        break;
      }
    }
  };

  const viewDataLoaded = Boolean(currentMeta && currentViewId);

  const SearchPanel = (
    <div className={styles.searchPanel} onClick={e => e.stopPropagation()}>
      {!isMobile && <ButtonPlus.Icon className={styles.narrowBtn} icon={<IconNarrow width={24} height={24} />} size="small" onClick={hidePanel} />}
      <h2 className={styles.searchPanelTitle}>
        {getModalTitle(subColumnType)}
        {showSubColumnWithView && (
          <Tooltip title={t(Strings.form_tour_desc)}>
            <a href={t(Strings.form_tour_link)} className={styles.helpBtn} target="_blank" rel="noreferrer">
              <HelpIcon fill={colors.firstLevelText} />
            </a>
          </Tooltip>
        )}
      </h2>
      <SearchControl
        ref={editorRef}
        onFocus={() => searchValue && setShowSearch(true)}
        onValueChange={setSearchValue}
        onSwitcherChange={setOnlyShowEditableNode}
        onCancelClick={onCancelClick}
        placeholder={t(Strings.search_folder_or_sheet)}
        checkboxText={t(Strings.hide_unusable_sheet)}
        checked={onlyShowEditableNode}
        value={searchValue}
        switchVisible={!showSubColumnWithView}
      />
      {!showSearch && !isEmbed && <FolderBreadcrumb parents={parents} onNodeClick={onNodeClick} />}
      {showSearch ? (
        <SearchResult
          searchResult={searchResult}
          checkNodeDisable={checkNodeDisable}
          onlyShowAvailable={onlyShowEditableNode}
          onNodeClick={onNodeClick}
        />
      ) : (
        <FolderContent
          nodes={nodes}
          currentViewId={currentViewId}
          currentMirrorId={currentMirrorId}
          loading={loading}
          onlyShowEditableNode={onlyShowEditableNode}
          checkNodeDisable={checkNodeDisable}
          currentDatasheetId={currentDatasheetId}
          isSelectView={showSubColumnWithView}
          onNodeClick={onNodeClick}
          showMirrorNode={showMirrorNode}
        />
      )}
      {loading && <Loading className={styles.loading} />}
    </div>
  );

  const SearchContainer = (
    <div className={styles.searchPanelContainer}>
      {isMobile ? (!viewDataLoaded ? SearchPanel : null) : SearchPanel}
      <SubColumn
        currentMeta={currentMeta}
        setLoading={setLoading}
        showSubColumnWithWidget={showSubColumnWithWidget}
        currentViewId={currentViewId}
        currentDatasheetId={currentDatasheetId}
        onChange={props.onChange}
      />
    </div>
  );

  return (
    <>
      {!isMobile ? (
        ReactDOM.createPortal(
          <div
            onMouseDown={e => e.nativeEvent.stopImmediatePropagation()}
            onWheel={stopPropagation}
            onClick={onClickPortalContainer}
            className={styles.portalContainer}
            tabIndex={-1}
            onKeyDown={onKeyDown}
          >
            {SearchContainer}
          </div>,
          document.body,
        )
      ) : (
        <Popup open height="90%" bodyStyle={{ padding: 0 }} onClose={hidePanel} className={styles.portalContainerDrawer}>
          {SearchContainer}
        </Popup>
      )}
    </>
  );
};

export const SearchPanel = React.memo(SearchPanelBase);
