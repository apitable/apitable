import { useMount } from 'ahooks';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useThemeColors } from '@apitable/components';
import { DatasheetApi, Selectors, Strings, t } from '@apitable/core';
import { NarrowOutlined, QuestionCircleOutlined } from '@apitable/icons';
import { useNodeClick } from 'pc/components/datasheet_search_panel/hooks/use_node_click';
import { useSearch } from 'pc/components/datasheet_search_panel/hooks/use_search';
import { insertViewNode } from 'pc/components/datasheet_search_panel/utils/insert_view_nodes';
import { useResponsive } from '../../hooks';
import { ButtonPlus, Loading, Tooltip } from '../common';
import { ScreenSize } from '../common/component_display';
import { SearchControl } from '../common/search_control';
import { useFocusEffect } from '../editors/hooks/use_focus_effect';
import { FolderBreadcrumb } from './folder_breadcrumb';
import { FolderContent } from './folder_content';
import { ISearchPanelProps, SecondConfirmType } from './interface';
import { SearchResult } from './search_result';
import styles from './style.module.less';
import { getModalTitle } from './utils';

export const SearchPanelMain: React.FC<ISearchPanelProps> = (props) => {
  const { hidePanel, noCheckPermission, showMirrorNode, localState, localDispatch, secondConfirmType } = props;

  const colors = useThemeColors();
  const { embedId } = useSelector((state) => state.pageParams);
  const mirror = useSelector((state) => {
    return localState.currentMirrorId ? Selectors.getMirror(state, localState.currentMirrorId) : undefined;
  });
  const datasheet = useSelector((state) => {
    return localState.currentDatasheetId ? Selectors.getDatasheet(state, localState.currentDatasheetId) : undefined;
  });
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const editorRef = useRef<{ focus: () => void } | null>(null);

  const onCancelClick = () => {
    localDispatch({ searchValue: '' });
    editorRef.current!.focus();
  };

  const needSelectView = secondConfirmType === SecondConfirmType.Form || secondConfirmType === SecondConfirmType.Chat;

  useSearch({ localDispatch, folderId: localState.currentFolderId, localState });

  useFocusEffect(() => {
    editorRef.current && editorRef.current.focus();
  });

  useEffect(() => {
    if (!needSelectView) {
      if (datasheet) {
        props.onChange({ datasheetId: datasheet.id });
      }
      if (mirror) {
        props.onChange({ mirrorId: mirror.id });
      }
      return;
    }

    insertViewNode({
      currentMeta: localState.currentMeta,
      folderLoaded: localState.folderLoaded,
      nodes: localState.nodes,
      currentDatasheetId: localState.currentDatasheetId,
      localDispatch,
    });
    // eslint-disable-next-line
  }, [localState.folderLoaded, secondConfirmType, localState.currentMeta, datasheet, mirror]);

  useMount(() => {
    fetchFolderData(localState.currentFolderId);

    if (secondConfirmType === SecondConfirmType.Form && localState.currentMeta == null) {
      searchDatasheetMetaData(localState.currentDatasheetId);
    }
  });

  const needSearchDatasheetMetaData = secondConfirmType === SecondConfirmType.Form || secondConfirmType === SecondConfirmType.Chat;

  // 这个方法是需要调取视图数据，进行表单的预览时会调用的接口，如果不需要预览表单，则不会调用
  const searchDatasheetMetaData = async (datasheetId: string) => {
    if (!datasheetId || !needSearchDatasheetMetaData) {
      return;
    }

    localDispatch({ loading: true });
    const res = await DatasheetApi.fetchDatasheetMeta(datasheetId);
    const { data, success } = res.data;

    if (success) {
      localDispatch({
        currentMeta: data,
        loading: false,
        currentDatasheetId: datasheetId,
      });
      if (data.views?.length) {
        localDispatch({
          currentViewId: data.views[0].id,
        });
      }
    }
  };
  const { onNodeClick, fetchFolderData } = useNodeClick({ localDispatch, localState, searchDatasheetMetaData, secondConfirmType });

  const isPc = !isMobile;

  return (
    <div className={styles.searchPanel} onClick={(e) => e.stopPropagation()}>
      {isPc && (
        <ButtonPlus.Icon className={styles.narrowBtn} icon={<NarrowOutlined size={16} color={'currentColor'} />} size="small" onClick={hidePanel} />
      )}
      {isPc && (
        <h2 className={styles.searchPanelTitle}>
          {getModalTitle(secondConfirmType)}
          {secondConfirmType === SecondConfirmType.Form && (
            <Tooltip title={t(Strings.form_tour_desc)}>
              <a href={t(Strings.form_tour_link)} className={styles.helpBtn} target="_blank" rel="noreferrer">
                <QuestionCircleOutlined color={colors.textCommonTertiary} />
              </a>
            </Tooltip>
          )}
        </h2>
      )}
      <SearchControl
        ref={editorRef}
        onFocus={() => localState.searchValue && localDispatch({ showSearch: true })}
        onValueChange={(val) => localDispatch({ searchValue: val })}
        onSwitcherChange={(val) => localDispatch({ onlyShowEditableNode: val })}
        onCancelClick={onCancelClick}
        placeholder={t(Strings.search_folder_or_sheet)}
        checkboxText={t(Strings.hide_unusable_sheet)}
        checked={localState.onlyShowEditableNode}
        value={localState.searchValue}
        switchVisible={secondConfirmType !== SecondConfirmType.Form}
      />
      {!localState.showSearch && !embedId && <FolderBreadcrumb parents={localState.parents} onNodeClick={onNodeClick} />}
      {localState.showSearch ? (
        <SearchResult
          searchResult={localState.searchResult}
          noCheckPermission={noCheckPermission}
          onlyShowAvailable={localState.onlyShowEditableNode}
          onNodeClick={onNodeClick}
        />
      ) : (
        <FolderContent
          nodes={localState.nodes}
          currentViewId={localState.currentViewId}
          currentMirrorId={localState.currentMirrorId}
          currentDatasheetId={localState.currentDatasheetId}
          loading={localState.loading}
          onlyShowEditableNode={localState.onlyShowEditableNode}
          noCheckPermission={noCheckPermission}
          isSelectView={secondConfirmType === SecondConfirmType.Form}
          onNodeClick={onNodeClick}
          showMirrorNode={showMirrorNode}
        />
      )}
      {localState.loading && <Loading className={styles.loading} />}
    </div>
  );
};
