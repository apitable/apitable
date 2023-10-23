import * as React from 'react';
import { useEffect, useReducer, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useThemeColors } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { NarrowOutlined, QuestionCircleOutlined } from '@apitable/icons';
import { SearchResult } from 'pc/components/data_source_selector/components/search_result/search_result';
import { useNodeClick } from 'pc/components/data_source_selector/hooks/use_node_click';
import { useSearch } from 'pc/components/data_source_selector/hooks/use_search';
import { ISearchPanelProps } from 'pc/components/data_source_selector/interface';
import { ButtonPlus, Loading, Tooltip } from '../common';
import { SearchControl } from '../common/search_control';
import { useFocusEffect } from '../editors/hooks/use_focus_effect';
import { FolderBreadcrumb } from './folder_breadcrumb';
import { FolderContent } from './folder_content';
import { useFetchDatasheetMeta } from './hooks/use_fetch_datasheet_meta';
import { useFetchFolderData } from './hooks/use_fetch_folder_data';
import { searchPanelReducer } from './store/reducer/search_panel';
import styles from './style.module.less';

export const DataSourceSelectorBase: React.FC<ISearchPanelProps> = ({
  defaultNodeIds,
  requiredData,
  onChange,
  filterPermissionForNode,
  headerConfig,
}) => {
  const [localState, localDispatch] = useReducer(searchPanelReducer, {
    loading: true,
    currentDatasheetId: defaultNodeIds.datasheetId || '',
    currentFolderId: defaultNodeIds.folderId,
    currentMirrorId: '',
    currentViewId: '',
    currentFormId: defaultNodeIds.formId || '',
    showSearch: false,
    parents: [],
    searchValue: '',
    onlyShowEditableNode: filterPermissionForNode === 'editable',
    nodes: [],
    searchResult: '',
  });
  const colors = useThemeColors();
  const { embedId } = useSelector((state) => state.pageParams);
  const editorRef = useRef<{
    focus: () => void;
      } | null>(null);

  const needNodeMetaData = requiredData.includes('viewId') || requiredData.includes('meta');

  const onCancelClick = () => {
    localDispatch({ searchValue: '' });
    editorRef.current!.focus();
  };

  const { isValidating: isFetchFolderData } = useFetchFolderData({ localDispatch, localState });
  const { isValidating: isFetchDatasheetMeta, data: datasheetMetaData } = useFetchDatasheetMeta({
    localDispatch,
    localState,
    needFetchDatasheetMeta: !!needNodeMetaData,
  });
  const isLoading = isFetchDatasheetMeta || isFetchFolderData;

  useSearch({ localDispatch, folderId: localState.currentFolderId, localState });

  useFocusEffect(() => {
    editorRef.current && editorRef.current.focus();
  });

  useEffect(() => {
    const baseData = {
      viewId: localState.currentViewId,
      datasheetId: localState.currentDatasheetId,
      meta: datasheetMetaData,
      nodeName: localState.nodes.find((node) => node.nodeId === localState.currentDatasheetId)?.nodeName,
      mirrorId: localState.currentMirrorId,
      formId: localState.currentFormId,
    };

    const result = {};

    for (const v of requiredData) {
      if (!baseData[v]) continue;
      result[v] = baseData[v];
    }

    onChange(result);
    // eslint-disable-next-line
  }, [localState.currentDatasheetId, localState.currentMirrorId, localState.currentViewId, localState.nodes, localState.currentFormId]);

  const { onNodeClick } = useNodeClick({ localDispatch, localState, needFetchDatasheetMeta: !!needNodeMetaData });

  return (
    <div className={styles.searchPanel} onClick={(e) => e.stopPropagation()}>
      {headerConfig && (
        <>
          <ButtonPlus.Icon
            className={styles.narrowBtn}
            icon={<NarrowOutlined size={16} color={'currentColor'} />}
            size="small"
            onClick={headerConfig.onHide}
          />
          <h2 className={styles.searchPanelTitle}>
            {headerConfig.title}
            {headerConfig.docUrl && (
              <Tooltip title={t(Strings.form_tour_desc)}>
                <a href={headerConfig.docUrl} className={styles.helpBtn} target="_blank" rel="noreferrer">
                  <QuestionCircleOutlined color={colors.textCommonTertiary} />
                </a>
              </Tooltip>
            )}
          </h2>
        </>
      )}
      <SearchControl
        ref={editorRef}
        onFocus={() => localState.searchValue && localDispatch({ showSearch: true })}
        onValueChange={(val) => localDispatch({ searchValue: val })}
        onSwitcherChange={(val) => localDispatch({ onlyShowEditableNode: val })}
        onCancelClick={onCancelClick}
        placeholder={t(Strings.datasource_selector_search_placeholder)}
        checkboxText={t(Strings.hide_node_permission_resource)}
        checked={localState.onlyShowEditableNode}
        value={localState.searchValue}
        switchVisible
      />
      {!localState.showSearch && !embedId && <FolderBreadcrumb parents={localState.parents} onNodeClick={onNodeClick} />}
      {localState.showSearch ? (
        <SearchResult searchResult={localState.searchResult} onlyShowAvailable={localState.onlyShowEditableNode} onNodeClick={onNodeClick} />
      ) : (
        <FolderContent
          nodes={localState.nodes}
          currentViewId={localState.currentViewId}
          currentMirrorId={localState.currentMirrorId}
          currentDatasheetId={localState.currentDatasheetId}
          currentFormId={localState.currentFormId}
          loading={localState.loading}
          onNodeClick={onNodeClick}
          onlyShowAvailable={localState.onlyShowEditableNode}
        />
      )}
      {isLoading && <Loading className={styles.loading} />}
    </div>
  );
};
