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
import { get } from 'lodash';
import RcTrigger from 'rc-trigger';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IUseListenTriggerInfo } from '@apitable/components';
import {
  CollaCommandName,
  ConfigConstant,
  DATASHEET_ID,
  DatasheetActions,
  Events,
  ExecuteResult,
  getViewClass,
  IReduxState,
  IViewProperty,
  Player,
  Selectors,
  Strings,
  t,
  ViewType,
} from '@apitable/core';
import { AddOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import { notify } from 'pc/components/common/notify';
import {
  DataSourceSelectorForForm,
} from 'pc/components/data_source_selector_enhanced/data_source_selector_for_form/data_source_selector_for_preview';
import {
  useControlDataSourceSelectorForForm,
} from 'pc/components/data_source_selector_enhanced/data_source_selector_for_form/hooks/use_control_data_source_selector_for_form';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { stopPropagation } from '../../../utils/dom';
import { ViewIntroduceList } from './view_introduce_list';
import styles from './style.module.less';

// const ReactIconAddTag = () => <IconAddTag width={16} height={16} />;

interface ITabAddView {
  activityViewId: string | undefined;
  viewCount: number;

  switchView(e: React.MouseEvent, id: string, type?: 'add'): void;

  setEditIndex: React.Dispatch<React.SetStateAction<number | null>>;
  disabled?: boolean;
}

const OFFSET = [0, 8];

export const TabAddView: React.FC<React.PropsWithChildren<ITabAddView>> = (props) => {
  const { activityViewId, viewCount, switchView, setEditIndex, disabled = false } = props;
  const permissions = useAppSelector((state: IReduxState) => Selectors.getPermissions(state));
  // const [plusVisible, setPlusVisible] = useState(false);
  const ref = useRef<any>();
  const close = useCallback(
    (e: React.MouseEvent) => {
      ref.current && ref.current.close(e);
    },
    [ref],
  );
  const { info } = useAppSelector((state) => state.user);
  const embedId = useAppSelector((state) => state.pageParams.embedId);
  const isLogin = useAppSelector((state) => state.user.isLogin);
  const embedInfo = useAppSelector((state) => Selectors.getEmbedInfo(state));

  const isOnlyView = embedId ? get(embedInfo, 'viewControl.viewId', false) : false;

  const isHideenAddView = embedId && (isOnlyView || !isLogin);
  const { panelVisible, panelInfo, onChange, setPanelInfo, setPanelVisible } = useControlDataSourceSelectorForForm();
  const [triggerInfo, setTriggerInfo] = useState<IUseListenTriggerInfo>();

  const addView = (view: IViewProperty, startIndex: number, viewType: ViewType) => {
    const { result } = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.AddViews,
      data: [
        {
          view,
          startIndex,
        },
      ],
    });
    /**
     * 5 - Add Grid view
     * 6 - Add Gallery view
     * 7 - Add Kanban view
     */
    if (ExecuteResult.Success === result) {
      notify.open({
        message: t(Strings.add_new_view_success, { viewName: view.name }),
      });
      viewType === ViewType.Gallery && Player.doTrigger(Events.view_convert_gallery);
    }
  };

  const addNewView = (e: React.MouseEvent, viewType: ViewType) => {
    Player.doTrigger(Events.datasheet_add_new_view, { viewType });
    close(e);
    stopPropagation(e);
    const datasheet = Selectors.getDatasheet(store.getState())!;
    const snapshot = datasheet.snapshot;

    if (!getViewClass(viewType).generateDefaultProperty(snapshot!, activityViewId)) {
      navigationToUrl(`${window.location.origin}/chatgroup/`);
      return;
    }
    const newView = DatasheetActions.deriveDefaultViewProperty(snapshot!, viewType, activityViewId);
    addView(newView, viewCount, viewType);
    switchView(e, newView.id, 'add');
    setEditIndex(viewCount);
  };

  const addNewNode = (e: React.MouseEvent, nodeType: ConfigConstant.NodeType) => {
    close(e);
    stopPropagation(e);
    const datasheet = Selectors.getDatasheet(store.getState())!;

    // When creating a magic form, you need to select the corresponding view to create it
    if (nodeType === ConfigConstant.NodeType.FORM) {
      setPanelVisible(true);
      setPanelInfo({
        folderId: datasheet.parentId,
        datasheetId: datasheet.id,
      });
    }
  };
  const ReactIconButton = () => <AddOutlined currentColor />;

  const onPopupVisibleChange = (visible: boolean) => {
    if (!visible || !info) {
      return;
    }

    Player.doTrigger(Events.view_add_panel_shown);
  };

  const renderBtn = () => {
    const content = (
      <div
        id={DATASHEET_ID.ADD_VIEW_BTN}
        data-test-id={DATASHEET_ID.ADD_VIEW_BTN}
        className={classNames({
          [styles.addViewButton]: true,
          [styles.onlyOne]: viewCount === 1,
          [styles.addBtnDisabled]: disabled,
        })}
      >
        <ReactIconButton />
        <span className={styles.tip}>{viewCount === 1 ? t(Strings.create_view_first) : t(Strings.new_view)}</span>
      </div>
    );
    if (!disabled) {
      return <div className={styles.addViewBtnWrap}>{content}</div>;
    }

    return (
      <Tooltip offset={[0, -1]} title={t(Strings.view_count_over_limit, { count: viewCount })}>
        {content}
      </Tooltip>
    );
  };

  useEffect(() => {
    if (ref.current) {
      const size = (ref.current.getRootDomNode() as HTMLElement).getBoundingClientRect();
      setTriggerInfo({ triggerSize: size, triggerOffset: OFFSET, adjust: false });
    }
  }, [ref]);

  return (
    <>
      {!isHideenAddView && (
        <RcTrigger
          action={permissions.viewCreatable && !disabled ? ['click'] : ['']}
          popup={<ViewIntroduceList addNewView={addNewView} addNewNode={addNewNode} triggerInfo={triggerInfo} />}
          destroyPopupOnHide
          popupAlign={{
            points: ['tr', 'br'],
            offset: OFFSET,
            overflow: { adjustX: true, adjustY: false },
          }}
          popupStyle={{ width: 264 }}
          ref={ref}
          onPopupVisibleChange={onPopupVisibleChange}
          maskClosable
          mask
        >
          {renderBtn()}
        </RcTrigger>
      )}
      {panelVisible && (
        <DataSourceSelectorForForm
          defaultNodeIds={{
            folderId: panelInfo!.folderId,
            datasheetId: panelInfo!.datasheetId,
          }}
          onHide={() => setPanelVisible(false)}
          onChange={onChange}
        />
      )}
    </>
  );
};
