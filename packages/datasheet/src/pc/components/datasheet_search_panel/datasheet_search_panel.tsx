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
import * as React from 'react';
import { useEffect, useMemo, useReducer } from 'react';
import { Button } from '@apitable/components';
import { Events, IMeta, Player, Strings, t } from '@apitable/core';
import { useResponsive } from 'pc/hooks/use_responsive';
import { stopPropagation } from 'pc/utils/dom';
import { ScreenSize } from '../common/component_display/enum';
import { Popup } from '../common/mobile/popup';
import { SecondConfirmType } from './interface';
import { PcWrapper } from './pc_wrapper';
import { PreviewColumn } from './preview_column';
import { SearchPanelMain } from './search_panel_main';
import { searchPanelReducer } from './store/reducer/search_panel';
import { getModalTitle } from './utils';
import styles from './style.module.less';

export interface ISearchShowOption {
  showForm: boolean;
  showDatasheet: boolean;
  needPermission?: 'manageable' | 'editable';
  showMirror: boolean;
  showView: boolean;
}
interface ISearchPanelProps {
  folderId: string;
  formId?: string;
  activeDatasheetId?: string;
  options?: ISearchShowOption;
  setSearchPanelVisible: (v: boolean) => void;
  onNodeSelect?: (data: { datasheetId?: string; formId?: string }) => void;
  onChange: (result: {
    datasheetId?: string;
    formId?: string;
    mirrorId?: string;
    viewId?: string;
    widgetIds?: string[];
    nodeName?: string;
    meta?: IMeta;
    secondConfirmType?: SecondConfirmType;
  }) => void;
  noCheckPermission?: boolean;
  secondConfirmType?: SecondConfirmType;
  showMirrorNode?: boolean;
  directClickMode?: boolean;
  isPrivate?: boolean;
}

export interface ISearchChangeProps {
  datasheetId?: string;
  mirrorId?: string;
  viewId?: string;
  widgetIds?: string[];
}

const SearchPanelBase: React.FC<React.PropsWithChildren<ISearchPanelProps>> = (props) => {
  const {
    activeDatasheetId = '',
    formId,
    options,
    onNodeSelect,
    directClickMode,
    noCheckPermission,
    folderId,
    secondConfirmType,
    showMirrorNode,
    onChange,
  } = props;
  const [loading, setLoading] = React.useState(false);
  const [state, updateState] = useReducer(searchPanelReducer, {
    currentMeta: null,
    loading: true,
    currentDatasheetId: activeDatasheetId,
    currentFormId: formId,
    currentFolderId: folderId,
    currentMirrorId: '',
    currentViewId: '',
    showSearch: false,
    parents: [],
    searchValue: '',
    onlyShowEditableNode: secondConfirmType === SecondConfirmType.Form || props.options?.needPermission != null,
    nodes: [],
    searchResult: '',
    folderLoaded: false,
  });

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  useEffect(() => {
    return () => {
      Player.doTrigger(Events.datasheet_search_panel_hidden);
    };
  }, []);

  useEffect(() => {
    if (state.loading) {
      return;
    }
    setTimeout(() => {
      Player.doTrigger(secondConfirmType === SecondConfirmType.Form ? Events.workbench_create_form_panel_shown : Events.datasheet_search_panel_shown);
    }, 1000);
  }, [state.loading, secondConfirmType]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const hidePanel = (e: any) => {
    stopPropagation(e);
    props.setSearchPanelVisible(false);
  };

  const viewDataLoaded = Boolean(state.currentMeta && state.currentViewId);

  const _SearchPanel = useMemo(() => {
    return (
      <SearchPanelMain
        options={options}
        onNodeSelect={onNodeSelect}
        directClickMode={directClickMode}
        hidePanel={hidePanel}
        noCheckPermission={noCheckPermission}
        showMirrorNode={showMirrorNode}
        localState={state}
        localDispatch={updateState}
        {...props}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, updateState, props.onChange, folderId, showMirrorNode, secondConfirmType, noCheckPermission, secondConfirmType, hidePanel]);

  const SearchContainer = useMemo(() => {
    return (
      <div
        className={classNames(styles.searchPanelContainer, {
          [styles.secondConfirmTypeForWidget]: secondConfirmType === SecondConfirmType.Widget,
          [styles.secondConfirmTypeForForm]: secondConfirmType === SecondConfirmType.Form,
          [styles.secondConfirmTypeForChat]: secondConfirmType === SecondConfirmType.Chat || secondConfirmType === SecondConfirmType.AIForm,
        })}
      >
        {isMobile ? (!viewDataLoaded ? _SearchPanel : null) : _SearchPanel}
        {/* Preview section on the right side of the page. */}
        <PreviewColumn
          currentMeta={state.currentMeta}
          setLoading={(value: boolean) => {
            updateState({ loading: value });
          }}
          currentViewId={state.currentViewId}
          currentDatasheetId={state.currentDatasheetId}
          onChange={onChange}
          secondConfirmType={secondConfirmType}
        />
        {(secondConfirmType === SecondConfirmType.Chat || secondConfirmType === SecondConfirmType.AIForm) && (
          <div className={styles.chatbotCreateButtonGroup}>
            <Button color={'default'} onClick={hidePanel}>
              {t(Strings.cancel)}
            </Button>
            <Button
              color={'primary'}
              loading={loading}
              disabled={!state.currentDatasheetId}
              onClick={async () => {
                try {
                  setLoading(true);
                  await props.onChange({
                    datasheetId: state.currentDatasheetId,
                    nodeName: state.nodes.find((node) => node.nodeId === state.currentDatasheetId)?.nodeName,
                    viewId: state.currentViewId,
                    meta: state.currentMeta || undefined,
                  });
                } finally {
                  setLoading(false);
                }
              }}
            >
              {t(Strings.confirm)}
            </Button>
          </div>
        )}
      </div>
    );
  }, [
    _SearchPanel,
    hidePanel,
    isMobile,
    loading,
    onChange,
    props,
    secondConfirmType,
    state.currentDatasheetId,
    state.currentMeta,
    state.currentViewId,
    state.nodes,
    viewDataLoaded,
  ]);

  return (
    <>
      {!isMobile ? (
        <PcWrapper hidePanel={hidePanel}>{SearchContainer}</PcWrapper>
      ) : (
        <Popup
          title={getModalTitle(secondConfirmType)}
          open
          height="90%"
          bodyStyle={{ padding: 0 }}
          onClose={hidePanel}
          className={styles.portalContainerDrawer}
        >
          {SearchContainer}
        </Popup>
      )}
    </>
  );
};

export const SearchPanel = React.memo(SearchPanelBase);
