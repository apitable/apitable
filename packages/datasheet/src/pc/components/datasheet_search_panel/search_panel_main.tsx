import { useMount } from 'ahooks';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { useThemeColors } from '@apitable/components';
import { DatasheetApi, Selectors, Strings, t } from '@apitable/core';
import { NarrowOutlined, QuestionCircleOutlined } from '@apitable/icons';
import { useNodeClick } from 'pc/components/datasheet_search_panel/hooks/use_node_click';
import { useSearch } from 'pc/components/datasheet_search_panel/hooks/use_search';
import { insertViewNode } from 'pc/components/datasheet_search_panel/utils/insert_view_nodes';
import { useAppSelector } from 'pc/store/react-redux';
import { useResponsive } from '../../hooks';
import { ButtonPlus, Loading, Tooltip } from '../common';
import { ScreenSize } from '../common/component_display';
import { SearchControl } from '../common/search_control';
import { useFocusEffect } from '../editors/hooks/use_focus_effect';
import { FolderBreadcrumb } from './folder_breadcrumb';
import { FolderContent } from './folder_content';
import { ISearchPanelProps, SecondConfirmType } from './interface';
import { SearchResult } from './search_result';
import { getModalTitle, getPlaceholder } from './utils';
import styles from './style.module.less';

export const SearchPanelMain: React.FC<ISearchPanelProps> = (props) => {
  const {
    hidePanel, noCheckPermission, options, onNodeSelect,
    directClickMode, showMirrorNode, localState, localDispatch, secondConfirmType
  } = props;

  const colors = useThemeColors();
  const { embedId } = useAppSelector((state) => state.pageParams);
  const mirror = useAppSelector((state) => {
    return localState.currentMirrorId ? Selectors.getMirror(state, localState.currentMirrorId) : undefined;
  });
  const datasheet = useAppSelector((state) => {
    return localState.currentDatasheetId ? Selectors.getDatasheet(state, localState.currentDatasheetId) : undefined;
  });

  const form = useAppSelector((state) => {
    return localState.currentFormId ? Selectors.getForm(state, localState.currentFormId) : undefined;
  });
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const editorRef = useRef<{
    focus: () => void;
      } | null>(null);

  const onCancelClick = () => {
    localDispatch({ searchValue: '' });
    editorRef.current!.focus();
  };

  let needSelectView = secondConfirmType === SecondConfirmType.Form || secondConfirmType === SecondConfirmType.Chat;
  if(directClickMode == true) {
    needSelectView = false;
  }

  useSearch({ localDispatch, folderId: localState.currentFolderId, localState, options });

  useFocusEffect(() => {
    editorRef.current && editorRef.current.focus();
  });

  useEffect(() => {
    if (!needSelectView) {

      if (datasheet) {
        props.onChange({ datasheetId: datasheet.id });
      }

      if(directClickMode) {
        if(localState.currentFormId){
          props.onChange({ formId: localState.currentFormId });
        }
      }else {

        if (form) {
          props.onChange({ formId: form.id });
        }
      }

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
  }, [localState.folderLoaded, secondConfirmType, localState.currentMeta, datasheet, mirror, form]);

  useMount(() => {
    fetchFolderData(localState.currentFolderId, options);

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
  const { onNodeClick, fetchFolderData } = useNodeClick({
    localDispatch,
    localState,
    searchDatasheetMetaData,
    secondConfirmType,
  });

  const isPc = !isMobile;

  return (
    <div className={styles.searchPanel} onClick={(e) => e.stopPropagation()}>
      {isPc && (
        <ButtonPlus.Icon className={styles.narrowBtn} icon={<NarrowOutlined size={16} color={'currentColor'} />} size="small" onClick={hidePanel} />
      )}
      {isPc && (
        <h2 className={styles.searchPanelTitle}>
          {getModalTitle(secondConfirmType, options)}
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
        placeholder={getPlaceholder(options)}
        checkboxText={options?.needPermission === 'manageable'? t(Strings.hide_unmanageable_files): t(Strings.hide_unusable_sheet)}
        checked={localState.onlyShowEditableNode}
        value={localState.searchValue}
        switchVisible={secondConfirmType !== SecondConfirmType.Form}
      />
      {!localState.showSearch && !embedId && <FolderBreadcrumb parents={localState.parents} onNodeClick={(e, id) => {
        if (e === 'Datasheet') {
          onNodeSelect?.({
            datasheetId: id
          });
        }
        onNodeClick(e, id);
      }}
      />
      }
      {localState.showSearch ? (
        <SearchResult
          searchResult={localState.searchResult}
          noCheckPermission={noCheckPermission}
          options={options}
          onlyShowAvailable={localState.onlyShowEditableNode}
          onNodeClick={(e, id) => {
            if(e==='Form') {
              onNodeSelect?.({
                formId: id
              });
            }
            if(e==='Datasheet') {
              onNodeSelect?.({
                datasheetId: id
              });
            }
            onNodeClick(e, id);
          }}
        />
      ) : (
        <FolderContent
          secondConfirmType={secondConfirmType}
          options={options}
          nodes={localState.nodes}
          currentViewId={localState.currentViewId}
          currentMirrorId={localState.currentMirrorId}
          currentDatasheetId={localState.currentDatasheetId}
          loading={localState.loading}
          onlyShowEditableNode={localState.onlyShowEditableNode}
          noCheckPermission={noCheckPermission}
          isSelectView={secondConfirmType === SecondConfirmType.Form}
          onNodeClick={(e, id) => {
            if(e==='Form') {
              onNodeSelect?.({
                formId: id
              });
            }
            if(e==='Datasheet') {
              onNodeSelect?.({
                datasheetId: id
              });
            }
            onNodeClick(e, id);
          }}
          showMirrorNode={showMirrorNode}
          // hideViewNode={secondConfirmType === SecondConfirmType.Chat}
        />
      )}
      {localState.loading && <Loading className={styles.loading} />}
    </div>
  );
};
