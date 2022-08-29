import {
  CollaCommandName, ConfigConstant, DATASHEET_ID, DatasheetActions, Events, ExecuteResult, getViewClass, IReduxState, IViewProperty, Player,
  Selectors, Strings, t, ViewType,
} from '@vikadata/core';
import { AddOutlined } from '@vikadata/icons';
import { IUseListenTriggerInfo } from '@vikadata/components';
import classNames from 'classnames';
import { Tooltip } from 'pc/components/common';
import { notify } from 'pc/components/common/notify';
import { SearchPanel, SubColumnType } from 'pc/components/datasheet_search_panel';
import { navigationToUrl } from 'pc/components/route_manager/use_navigation';
import { useSearchPanel } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import RcTrigger from 'rc-trigger';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { stopPropagation } from '../../../utils/dom';
import styles from './style.module.less';
import { ViewIntroduceList } from './view_introduce_list';

// const ReactIconAddTag = () => <IconAddTag width={16} height={16} />;

interface ITabAddView {
  activityViewId: string | undefined;
  viewCount: number;
  switchView(e: React.MouseEvent, id: string, type?: 'add'): void;
  setEditIndex: React.Dispatch<React.SetStateAction<number | null>>;
  disabled?: boolean;
}

const OFFSET = [0, 8];

export const TabAddView: React.FC<ITabAddView> = props => {
  const { activityViewId, viewCount, switchView, setEditIndex, disabled = false } = props;
  const permissions = useSelector((state: IReduxState) => Selectors.getPermissions(state));
  // const [plusVisible, setPlusVisible] = useState(false);
  const ref = useRef<any>();
  const close = useCallback(
    (e: React.MouseEvent) => {
      ref.current && ref.current.close(e);
    }, [ref],
  );
  const { info } = useSelector(state => state.user);
  const {
    panelVisible,
    panelInfo,
    onChange,
    setPanelInfo,
    setPanelVisible,
  } = useSearchPanel();
  const [triggerInfo, setTriggerInfo] = useState<IUseListenTriggerInfo>();

  // 新增视图
  const addView = (view: IViewProperty, startIndex: number, viewType: ViewType) => {
    const { result } = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.AddViews,
      data: [{
        view,
        startIndex,
      }],
    });
    // 5:新建表格视图；6:新建相册视图；7:新建看板视图
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

    // 创建神奇表单时，需要选择相应视图进行创建
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
        className={
          classNames({
            [styles.addViewButton]: true,
            [styles.onlyOne]: viewCount === 1,
            [styles.addBtnDisabled]: disabled,
          })
        }
      >
        <ReactIconButton />
        <span className={styles.tip}>
          {viewCount === 1 ? t(Strings.create_view_first) : t(Strings.new_view)}
        </span>
      </div>
    );

    if (!disabled) {
      return (
        <div className={styles.addViewBtnWrap}>{content}</div>
      );
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
      <RcTrigger
        action={permissions.viewCreatable && !disabled ? ['click'] : ['']}
        popup={
          <ViewIntroduceList
            addNewView={addNewView}
            addNewNode={addNewNode}
            style={{}}
            triggerInfo={triggerInfo}
          />
        }
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
      {
        panelVisible && (
          <SearchPanel
            folderId={panelInfo!.folderId}
            subColumnType={SubColumnType.View}
            activeDatasheetId={panelInfo?.datasheetId || ''}
            setSearchPanelVisible={setPanelVisible}
            onChange={onChange}
          />
        )
      }
    </>
  );
};
