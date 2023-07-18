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

import { DatasheetApi, Events, IMeta, Player } from '@apitable/core';
import { useMount } from 'ahooks';
import { PreviewColumn } from './preview_column';
import { useResponsive } from 'pc/hooks';
import { stopPropagation } from 'pc/utils';
import * as React from 'react';
import { useEffect, useMemo, useReducer } from 'react';
import { ScreenSize } from '../common/component_display/enum';
import { Popup } from '../common/mobile/popup';
import styles from './style.module.less';
import { PcWrapper } from './pc_wrapper';
import { getModalTitle } from './utils';
import { SearchPanelMain } from './search_panel_main';
import { searchPanelReducer } from './store/reducer/search_panel';

interface ISearchPanelProps {
  folderId: string;
  activeDatasheetId: string;
  setSearchPanelVisible: (v: boolean) => void;
  onChange: (result: {
    datasheetId?: string;
    mirrorId?: string;
    viewId?: string;
    widgetIds?: string[],
    nodeName?: string;
    meta?: IMeta;
  }) => void;
  noCheckPermission?: boolean;
  secondConfirmType?: SecondConfirmType;
  showMirrorNode?: boolean;
}

export interface ISearchChangeProps {
  datasheetId?: string;
  mirrorId?: string;
  viewId?: string;
  widgetIds?: string[];
}

export enum SecondConfirmType {
  Widget,
  Form,
  Chat
}

const SearchPanelBase: React.FC<React.PropsWithChildren<ISearchPanelProps>> = props => {
  const { activeDatasheetId, noCheckPermission, folderId, secondConfirmType, showMirrorNode } = props;

  const [state, updateState] = useReducer(searchPanelReducer, {
    currentMeta: null,
    loading: true,
    currentDatasheetId: activeDatasheetId,
    currentViewId: '',
  });

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const needSearchDatasheetMetaData = secondConfirmType === SecondConfirmType.Form || secondConfirmType === SecondConfirmType.Chat;

  useMount(() => {
    if (secondConfirmType === SecondConfirmType.Form && state.currentMeta == null) {
      searchDatasheetMetaData(activeDatasheetId);
    }
  });

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

  // 这个方法是需要调取视图数据，进行表单的预览时会调用的接口，如果不需要预览表单，则不会调用
  const searchDatasheetMetaData = (datasheetId: string) => {
    if (!datasheetId || !needSearchDatasheetMetaData) {
      return;
    }
    updateState({ loading: true });
    DatasheetApi.fetchDatasheetMeta(datasheetId).then(res => {
      const { data, success } = res.data;
      if (success) {
        updateState({
          currentMeta: data,
          loading: false,
          currentDatasheetId: datasheetId,
        });
        if (data.views?.length) {
          updateState({
            currentViewId: data.views[0].id,
          });
        }
      }
    });
  };

  const hidePanel = (e: any) => {
    stopPropagation(e);
    props.setSearchPanelVisible(false);
  };

  const viewDataLoaded = Boolean(state.currentMeta && state.currentViewId);

  const _SearchPanel = useMemo(() => {
    return <SearchPanelMain
      hidePanel={hidePanel}
      noCheckPermission={noCheckPermission}
      searchDatasheetMetaData={searchDatasheetMetaData}
      showMirrorNode={showMirrorNode}
      parentState={state}
      parentUpdateState={updateState}
      {...props}
    />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state, updateState, props.onChange, folderId, showMirrorNode,
    secondConfirmType, searchDatasheetMetaData, noCheckPermission, secondConfirmType, hidePanel,
  ]);

  const SearchContainer = useMemo(() => {
    return <div className={styles.searchPanelContainer}>
      {isMobile ? (!viewDataLoaded ? _SearchPanel : null) : _SearchPanel}
      {/* Preview section on the right side of the page. */}
      <PreviewColumn
        currentMeta={state.currentMeta}
        setLoading={(value: boolean) => {
          updateState({ loading: value });
        }}
        showSubColumnWithWidget={secondConfirmType === SecondConfirmType.Widget}
        currentViewId={state.currentViewId}
        currentDatasheetId={state.currentDatasheetId}
        onChange={props.onChange}
        secondConfirmType={secondConfirmType}
      />
    </div>;
  }, [
    _SearchPanel, isMobile, props.onChange, secondConfirmType,
    state.currentDatasheetId, state.currentMeta, state.currentViewId, viewDataLoaded,
  ]);

  return (
    <>
      {!isMobile ? <PcWrapper hidePanel={hidePanel}>
        {SearchContainer}
      </PcWrapper> : (
        <Popup title={getModalTitle(secondConfirmType)} open height="90%" bodyStyle={{ padding: 0 }} onClose={hidePanel}
          className={styles.portalContainerDrawer}>
          {SearchContainer}
        </Popup>
      )}
    </>
  );
};

export const SearchPanel = React.memo(SearchPanelBase);

