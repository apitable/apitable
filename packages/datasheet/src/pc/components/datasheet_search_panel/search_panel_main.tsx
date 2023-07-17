import styles from './style.module.less';
import { ButtonPlus, Loading, Tooltip } from '../common';
import { NarrowOutlined, QuestionCircleOutlined } from '@apitable/icons';
import { Api, ConfigConstant, IMeta, INode, Selectors, StoreActions, Strings, t, ViewType } from '@apitable/core';
import { SearchControl } from '../common/search_control';
import { FolderBreadcrumb } from './folder_breadcrumb';
import { SearchResult } from './search_result';
import { FolderContent } from './folder_content';
import * as React from 'react';
import { useEffect, useMemo, useReducer, useRef } from 'react';
import { ScreenSize } from '../common/component_display';
import { useResponsive } from '../../hooks';
import { useFocusEffect } from '../editors/hooks/use_focus_effect';
import { DISABLE_TIP } from './const';
import { useDispatch, useSelector } from 'react-redux';
import { getModalTitle } from './utils';
import { SecondConfirmType } from './datasheet_search_panel';
import { Button, useThemeColors } from '@apitable/components';
import throttle from 'lodash/throttle';
import { usePrevious } from 'ahooks';
import { ISearchPanelState } from './store/interface/search_panel';
import { searchPanelMainReducer } from './store/reducer/search_panel_main';

interface ISearchPanelProps {
  hidePanel(e: any): void;

  noCheckPermission?: boolean;
  showMirrorNode: boolean | undefined;
  folderId: string
  onChange: (result: {
    datasheetId?: string;
    mirrorId?: string;
    viewId?: string;
    widgetIds?: string[],
    nodeName?: string,
    meta?: IMeta;
  }) => void;
  secondConfirmType?: SecondConfirmType;
  parentState: ISearchPanelState
  parentUpdateState: React.Dispatch<Partial<ISearchPanelState>>

  searchDatasheetMetaData(datasheetId: string): void
}

export const SearchPanelMain: React.FC<ISearchPanelProps> = (props) => {
  const {
    hidePanel,
    noCheckPermission,
    searchDatasheetMetaData,
    showMirrorNode,
    folderId,
    parentState,
    parentUpdateState,
    secondConfirmType,
  } = props;
  const [_state, _updateState] = useReducer(searchPanelMainReducer, {
    showSearch: false,
    parents: [],
    searchValue: '',
    onlyShowEditableNode: secondConfirmType === SecondConfirmType.Form,
    nodes: [],
    searchResult: '',
    currentFolderId: folderId,
    currentMirrorId: '',
    folderLoaded: false,
  });
  const colors = useThemeColors();
  const previousCurrentFolderId = usePrevious(_state.currentFolderId);
  const spaceId = useSelector(state => state.space.activeId!);
  const { embedId } = useSelector(state => state.pageParams);
  const mirror = useSelector(state => {
    return _state.currentMirrorId ? Selectors.getMirror(state, _state.currentMirrorId) : undefined;
  });
  const dispatch = useDispatch();
  const datasheet = useSelector(state => {
    return parentState.currentDatasheetId ? Selectors.getDatasheet(state, parentState.currentDatasheetId) : undefined;
  });
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const editorRef = useRef<{ focus: () => void } | null>(null);
  const onCancelClick = () => {
    _updateState({ searchValue: '' });
    editorRef.current!.focus();
  };

  const needSelectView = secondConfirmType === SecondConfirmType.Form || secondConfirmType === SecondConfirmType.Chat;

  const search = useMemo(() => {
    return throttle((spaceId: string, val: string) => {
      Api.searchNode(spaceId, val.trim()).then(res => {
        const { data, success } = res.data;
        if (success) {
          const folders = data.filter(node => node.type === ConfigConstant.NodeType.FOLDER);
          const files = data.filter(node => node.type === ConfigConstant.NodeType.DATASHEET);
          _updateState({ showSearch: true, currentFolderId: props.folderId });
          if (!folders.length && !files.length) {
            _updateState({ searchResult: val });
            return;
          }
          _updateState({ searchResult: { folders, files }});
        }
      });
    }, 500);
  }, [props.folderId]);

  useFocusEffect(() => {
    editorRef.current && editorRef.current.focus();
  });

  useEffect(() => {
    if (!_state.searchValue) {
      _updateState({ showSearch: false, currentFolderId: _state.currentFolderId });
      return;
    }
    (previousCurrentFolderId === _state.currentFolderId || props.folderId === _state.currentFolderId) && search(spaceId, _state.searchValue);
    // eslint-disable-next-line
  }, [search, spaceId, _state.searchValue, _state.currentFolderId, props.folderId]);

  useEffect(() => {
    if (needSelectView) return;
    if (datasheet) {
      props.onChange({ datasheetId: datasheet.id });
    }
    if (mirror) {
      props.onChange({ mirrorId: mirror.id });
    }
  }, [needSelectView, datasheet, props.onChange, mirror]);

  useEffect(() => {
    if (!needSelectView) return;

    if (parentState.currentMeta && _state.folderLoaded) {
      const views = parentState.currentMeta.views;
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
      const tempNodes = _state.nodes.filter(node => node.type !== ConfigConstant.NodeType.VIEW);
      const index = tempNodes.findIndex(node => node.nodeId === parentState.currentDatasheetId);
      tempNodes.splice(index + 1, 0, ...viewNodes);
      _updateState({ nodes: tempNodes });
      if (viewNodes.length) {
        parentUpdateState({
          currentViewId: viewNodes[0].nodeId,
        });
      }
      parentUpdateState({
        loading: false,
      });
    }
    // eslint-disable-next-line
  }, [datasheet, _state.folderLoaded, secondConfirmType, parentState.currentMeta, parentState.currentDatasheetId, _state.currentMirrorId]);

  useEffect(() => {
    if (!_state.searchValue) {
      _updateState({ showSearch: false });
      return;
    }
    (previousCurrentFolderId === _state.currentFolderId || props.folderId === _state.currentFolderId) && search(spaceId, _state.searchValue);
    // eslint-disable-next-line
  }, [search, spaceId, _state.searchValue, _state.currentFolderId, props.folderId]);

  useEffect(() => {
    parentUpdateState({
      loading: true,
    });
    _updateState({ folderLoaded: false });
    // 初始化时就会加载这部分数据
    Promise.all([Api.getParents(_state.currentFolderId), Api.getChildNodeList(_state.currentFolderId)])
      .then(list => {
        const [parentsRes, childNodeListRes] = list;
        if (parentsRes.data.success) {
          _updateState({ parents: parentsRes.data.data });
        }

        if (childNodeListRes.data.success) {
          const nodes = childNodeListRes.data.data || [];
          _updateState({ nodes, showSearch: false });
        }
      })
      .catch()
      .then(() => {
        parentUpdateState({
          loading: false,
        });
        _updateState({ folderLoaded: true });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_state.currentFolderId]);

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

  const _onDatasheetClick = (id: string) => {
    if (parentState.currentDatasheetId === id) {
      return;
    }

    switch (secondConfirmType) {
      case SecondConfirmType.Widget:
        parentUpdateState({
          loading: true,
          currentDatasheetId: id,
        });
        return;
      case SecondConfirmType.Form:
        parentUpdateState({
          loading: true,
          currentMeta: null,
          currentViewId: '',
        });
        searchDatasheetMetaData(id);
        return;
      case SecondConfirmType.Chat:
        parentUpdateState({
          currentDatasheetId: id,
        });
        searchDatasheetMetaData(id);
        return;
    }
    parentUpdateState({
      loading: true,
      currentDatasheetId: id,
    });

    dispatch(StoreActions.fetchDatasheet(id) as any);
  };

  const _onFolderClick = (id: string) => {
    _updateState({ currentFolderId: id });
    parentUpdateState({
      currentViewId: '',
      currentMeta: null,
      currentDatasheetId: '',
    });
  };

  const _onMirrorClick = (id: string) => {
    if (_state.currentMirrorId !== id) {
      parentUpdateState({
        loading: true,
      });
      _updateState({ currentMirrorId: id });
      dispatch(StoreActions.fetchMirrorPack(id) as any);
    }
  };

  const _onViewClick = (id: string) => {
    const hasView = parentState.currentMeta?.views.some(view => view.id === id);
    if (hasView) {
      parentUpdateState({
        currentViewId: id,
      });
    }
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

  const isPc = !isMobile;

  return <div className={styles.searchPanel} onClick={e => e.stopPropagation()}>
    {
      isPc &&
      <ButtonPlus.Icon className={styles.narrowBtn} icon={<NarrowOutlined size={16} color={'currentColor'}/>}
        size="small" onClick={hidePanel}/>
    }
    {
      isPc && <h2 className={styles.searchPanelTitle}>
        {getModalTitle(secondConfirmType)}
        {secondConfirmType === SecondConfirmType.Form && (
          <Tooltip title={t(Strings.form_tour_desc)}>
            <a href={t(Strings.form_tour_link)} className={styles.helpBtn} target="_blank" rel="noreferrer">
              <QuestionCircleOutlined color={colors.textCommonTertiary}/>
            </a>
          </Tooltip>
        )}
      </h2>
    }
    <SearchControl
      ref={editorRef}
      onFocus={() => _state.searchValue && _updateState({ showSearch: true })}
      onValueChange={val => _updateState({ searchValue: val })}
      onSwitcherChange={val => _updateState({ onlyShowEditableNode: val })}
      onCancelClick={onCancelClick}
      placeholder={t(Strings.search_folder_or_sheet)}
      checkboxText={t(Strings.hide_unusable_sheet)}
      checked={_state.onlyShowEditableNode}
      value={_state.searchValue}
      switchVisible={secondConfirmType !== SecondConfirmType.Form}
    />
    {
      !_state.showSearch && !embedId && <FolderBreadcrumb parents={_state.parents} onNodeClick={onNodeClick}/>
    }
    {
      _state.showSearch ? (
        <SearchResult
          searchResult={_state.searchResult}
          checkNodeDisable={checkNodeDisable}
          onlyShowAvailable={_state.onlyShowEditableNode}
          onNodeClick={onNodeClick}
        />
      ) : (
        <FolderContent
          nodes={_state.nodes}
          currentViewId={parentState.currentViewId}
          currentMirrorId={_state.currentMirrorId}
          currentDatasheetId={parentState.currentDatasheetId}
          loading={parentState.loading}
          onlyShowEditableNode={_state.onlyShowEditableNode}
          checkNodeDisable={checkNodeDisable}
          isSelectView={secondConfirmType === SecondConfirmType.Form}
          onNodeClick={onNodeClick}
          showMirrorNode={showMirrorNode}
        />
      )
    }
    {
      secondConfirmType === SecondConfirmType.Chat && <div className={styles.chatbotCreateButtonGroup}>
        <Button color={colors.bgControlsDefault} onClick={hidePanel}>
          Cancel
        </Button>
        <Button color={'primary'} disabled={!parentState.currentDatasheetId} onClick={() => {
          props.onChange({
            datasheetId: parentState.currentDatasheetId,
            nodeName: _state.nodes.find(node => node.nodeId === parentState.currentDatasheetId)?.nodeName,
            viewId: parentState.currentViewId,
            meta: parentState.currentMeta || undefined
          });
        }}>
          Create chatbot
        </Button>
      </div>
    }
    {parentState.loading && <Loading className={styles.loading}/>}
  </div>;
};
