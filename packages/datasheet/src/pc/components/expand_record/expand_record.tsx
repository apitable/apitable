import { ErrorBoundary } from '@sentry/react';
import { IconButton, Skeleton, ThemeProvider, useThemeColors } from '@vikadata/components';
import {
  Api, DatasheetApi, FieldOperateType, Navigation, RecordVision, ResourceIdPrefix, ResourceType, Selectors, SetFieldFrom, StatusCode, StoreActions,
  Strings, t,
} from '@apitable/core';
import { AttentionOutlined, CommentOutlined } from '@vikadata/icons';
import { useLocalStorageState, useMount, useToggle, useUpdateEffect } from 'ahooks';
import classNames from 'classnames';
import { expandRecordManager } from 'pc/common/expand_record_manager';

import { ShortcutActionManager, ShortcutActionName } from 'pc/common/shortcut_key';
import { Message, Modal as CustomModal, Tooltip } from 'pc/components/common';
import { getModalConfig } from 'pc/components/common/modal/qr_code_modal_content';
import { EXPAND_RECORD, RecordType } from 'pc/components/expand_record/expand_record.enum';
import {
  IExpandRecordComponentProp, IExpandRecordInnerProp, IExpandRecordWrapperProp, IPaneIconProps,
} from 'pc/components/expand_record/expand_record.interface';
import { ExpandRecordMoreOption } from 'pc/components/expand_record/expand_record_more_option';
import { RecordPageTurn } from 'pc/components/expand_record/record_page_turn';
import { clearExpandModal, expandRecordIdNavigate, getRecordName, recordModalCloseFns } from 'pc/components/expand_record/utils';
import { FieldDesc } from 'pc/components/multi_grid/field_desc';
import { FieldSetting } from 'pc/components/multi_grid/field_setting';
import { Router } from 'pc/components/route_manager/router';
import { useGetViewByIdWithDefault, useQuery, useRequest, useResponsive } from 'pc/hooks';
// import { FieldSetting } from 'pc/components/multi_grid/field_setting';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { ActivitySelectType, KeyCode } from 'pc/utils';
import { getStorage, StorageName } from 'pc/utils/storage';
import { dispatch } from 'pc/worker/store';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Provider, shallowEqual, useDispatch, useSelector } from 'react-redux';
import IconNarrow from 'static/icon/datasheet/datasheet_icon_narrow_record16.svg';
import { ComponentDisplay, ScreenSize } from '../common/component_display';
import { ActivityPane } from './activity_pane';
import { ICacheType } from './activity_pane/interface';
import { EditorContainer } from './editor_container';
import EditorTitleContext from './editor_title_context';
import { ExpandRecordModal } from './expand_record_modal';
import { ExpandRecordVisionOption } from './expand_record_vision_option';
import { IFieldDescCollapseStatus } from './field_editor';
import { MoreTool } from './more_tool';
import { RecordOperationArea } from './record_opeation_area';
import styles from './style.module.less';

const CommentButton = ({ active, onClick }: IPaneIconProps): JSX.Element => {
  const colors = useThemeColors();
  return (
    <Tooltip title={active ? t(Strings.put_away_record_comments) : t(Strings.view_record_comments)}>
      <IconButton
        component='button'
        shape='square'
        className={active ? styles.activeIcon : styles.icon}
        icon={() => <CommentOutlined size={16} color={active ? colors.fc0 : colors.fc3} />}
        onClick={() => onClick()}
      />
    </Tooltip>
  );
};

const SubscribeButton = ({ active, onSubOrUnsub }): JSX.Element => {
  const [updating, setUpdating] = useState(false);

  const _onSubOrUnsub = async() => {
    setUpdating(true);

    await onSubOrUnsub();

    setUpdating(false);
  };
  const colors = useThemeColors();

  return (
    <Tooltip title={active ? t(Strings.cancel_watch_record_button_tooltips) : t(Strings.watch_record_button_tooltips)}>
      <IconButton
        component='button'
        shape='square'
        disabled={updating}
        className={active ? styles.activeIcon : styles.icon}
        icon={() => <AttentionOutlined size={16} color={active ? colors.fc0 : colors.fc3} />}
        onClick={() => _onSubOrUnsub()}
      />
    </Tooltip>
  );
};

/**
 * 展开卡片实际实际调用
 */
export const expandRecordInner = (props: IExpandRecordInnerProp) => {
  const { recordType, onClose, datasheetId } = props;

  const focusHolderRef = React.createRef<HTMLInputElement>();
  expandRecordManager.pushFocusHolderRef(focusHolderRef);
  const container = document.createElement('div');
  container.classList.add(EXPAND_RECORD);
  document.body.appendChild(container);

  const modalClose = () => {
    dispatch(StoreActions.clearActiveFieldState(datasheetId)); // 清空激活的 field 状态。
    expandRecordManager.destroyCurrentRef();
    ReactDOM.unmountComponentAtNode(container);
    container.parentElement?.removeChild(container);
    onClose && onClose();
    const previousFocusHolderRef = expandRecordManager.getPreviousFocusHolderRef();

    if (previousFocusHolderRef) {
      previousFocusHolderRef.current?.focus();
    }
    if (recordType === RecordType.Datasheet) {
      expandRecordIdNavigate(undefined, true);
      ShortcutActionManager.trigger(ShortcutActionName.Focus);
    }

    const idx = recordModalCloseFns.indexOf(modalClose);
    if (idx !== -1) {
      recordModalCloseFns.splice(idx, 1);
    }
    if (recordModalCloseFns.length === 0) {
      store.dispatch(StoreActions.toggleRecordFullScreen(false));
    }
  };

  recordModalCloseFns.unshift(modalClose);

  const monitorBodyFocus = e => {
    if (!focusHolderRef.current) {
      return;
    }
    if (document.activeElement !== document.body) {
      return;
    }
    if (e.keyCode !== KeyCode.Esc) {
      return;
    }
    modalClose();
  };

  /**
   * 原则上来说，希望在展开卡片中的所有操作都能有 focus 的元素，方便 esc 关闭当前的展开卡片，
   * 但进行附件预览时，focus 会被预览夺取，并且在预览关闭后没有任何回调把 focus 在重新放回展开卡片中，如果单纯针对附件新增一个参数又不通用
   * 从现有的逻辑上来说，关联记录造成的多个展开卡片的堆叠，当前卡片关闭，会自动 focus 下一个卡片，但下一个卡片也会遇到附件预览的问题
   * 参考 document.body.onkeydown 这种全局唯一的事件挂载，可以执行两种操作
   * 1. 当新卡片展开，默认将事件监听挂载在 body 上，
   * 2. 关闭当前卡片，自动聚焦到上一个卡片的时候，重新将上一个卡片的上下文挂载到 body 上
   * @param e
   */
  document.body.onkeydown = monitorBodyFocus;

  const wrapperProps = {
    ...props,
    modalClose,
  };

  ReactDOM.render(
    <Provider store={store}>
      <ExpandRecordModal onCancel={modalClose} wrapClassName={styles.mobileWrapper} forceCenter={props.forceCenter}>
        <ErrorBoundary
          onError={() => {
            clearExpandModal();
            setTimeout(() => Api.keepTabbar({}), 500);
          }}
          beforeCapture={scope => {
            scope.setTag('catcher', 'expandRecordCrash');
          }}
        >
          <WrapperWithTheme {...{ ...wrapperProps, nodeId: wrapperProps.datasheetId }} />
        </ErrorBoundary>
        <div
          ref={focusHolderRef}
          tabIndex={-1}
          onFocus={e => {
            document.body.onkeydown = monitorBodyFocus;
          }}
        />
      </ExpandRecordModal>
    </Provider>,
    container,
  );
};

const Wrapper: React.FC<IExpandRecordWrapperProp> = props => {
  const { nodeId, viewId, recordIds, activeRecordId, recordType, modalClose } = props;
  const isIndependent = recordType === RecordType.Independent;
  const [realActiveRecordId, setRealActiveRecordId] = useState<string>();
  const [realRecordIds, setRealRecordIds] = useState(recordIds);
  const isMirror = nodeId.startsWith(ResourceIdPrefix.Mirror);
  const [datasheetId, setDatasheetId] = useState<string | undefined>(nodeId);
  const { snapshot, isPartOfData, visibleRows, datasheetErrorCode, pageParamsRecordId, activeDatasheetId, mirrorSourceDstId } = useSelector(
    state => ({
      snapshot: Selectors.getSnapshot(state, datasheetId),
      isPartOfData: Selectors.getDatasheet(state, datasheetId)?.isPartOfData,
      datasheetErrorCode: isMirror ? Selectors.getMirrorErrorCode(state, nodeId) : Selectors.getDatasheetErrorCode(state, datasheetId),
      visibleRows: Selectors.getVisibleRows(state),
      pageParamsRecordId: state.pageParams.recordId,
      activeDatasheetId: Selectors.getActiveDatasheetId(state),
      mirrorSourceDstId: Selectors.getMirrorSourceInfo(state, nodeId)?.datasheetId,
    }),
    shallowEqual,
  );
  const hasRecordIdsData = () => snapshot && recordIds.every(recordId => snapshot.recordMap && snapshot.recordMap?.[recordId]);
  const [independentDataLoading, setIndependentDataLoading] = useState<boolean>(isIndependent && isPartOfData !== false && !hasRecordIdsData());

  useEffect(() => {
    if (independentDataLoading) {
      resourceService
        .instance!.switchResource({
          to: nodeId,
          resourceType: isMirror ? ResourceType.Mirror : ResourceType.Datasheet,
          extra: { recordIds: recordIds },
        })
        .catch(() => {})
        .then(() => {
          setIndependentDataLoading(false);
          isMirror && setDatasheetId(store.getState().mirrorMap[nodeId].mirror?.sourceInfo.datasheetId);
        });
    }
  }, [independentDataLoading, recordIds, nodeId, isMirror]);

  useEffect(() => {
    mirrorSourceDstId && setDatasheetId(mirrorSourceDstId);
  }, [mirrorSourceDstId]);

  // 独立展开的卡片产生的ot action，无法将 viewId 传递过去，所以在这里设置一下 activeView
  useEffect(() => {
    isIndependent && viewId && datasheetId && activeDatasheetId !== datasheetId && dispatch(StoreActions.switchView(datasheetId, viewId));
  }, [isIndependent, datasheetId, viewId, activeDatasheetId]);

  const errorHandle = useMemo(
    () => (errorCode, recordIds?, activeRecordId?) => {
      let customModal;
      switch (errorCode) {
        case StatusCode.NODE_NOT_EXIST:
        case StatusCode.NODE_DELETED:
          customModal = CustomModal.warning(getModalConfig({
            title: t(Strings.open_failed),
            content: t(Strings.node_not_exist_content),
            onOk: () => {
              modalClose();
              customModal.destroy();
            },
            modalButtonType: 'warning',
            okText: t(Strings.submit), // '确认',
          }));
          break;
        case StatusCode.FORM_FOREIGN_DATASHEET_NOT_EXIST:
          // 镜像源表被删除
          customModal = CustomModal.warning(getModalConfig({
            title: t(Strings.open_failed),
            content: t(Strings.mirror_resource_dst_been_deleted),
            onOk: () => {
              modalClose();
              customModal.destroy();
            },
            modalButtonType: 'warning',
            okText: t(Strings.submit),
          }));
          break;
        default:
      }
      // 对于加载回来的数据为空的情况
      if (!errorCode && activeRecordId && !snapshot?.recordMap[activeRecordId]) {
        const customModal = CustomModal.error(getModalConfig({
          title: t(Strings.open_failed),
          content: t(Strings.error_record_not_exist_now),
          onOk: () => {
            modalClose();
            customModal.destroy();
          },
          modalButtonType: 'error',
          okText: t(Strings.submit),
        }));
      }
    },
    [modalClose, snapshot],
  );

  useEffect(() => {
    if (!independentDataLoading && datasheetErrorCode && datasheetId) {
      errorHandle(datasheetErrorCode);
      return;
    }
    if (independentDataLoading || !snapshot?.recordMap) {
      return;
    }
    let curRecordIds: string[];
    let curActiveRecordId: string;
    switch (recordType) {
      case RecordType.Independent:
        {

          // 传入的和现有的交集，因为可能有被删除的，所以这里求交集
          curRecordIds = recordIds.filter(id => snapshot?.recordMap[id]);
          // 默认使用 activeRecord，如果 activeRecord 被过滤掉了，就用第一个，realActiveRecordId 作为切换后
          curActiveRecordId =
            (realActiveRecordId && snapshot?.recordMap?.[realActiveRecordId]?.id)
            || (activeRecordId && snapshot?.recordMap?.[activeRecordId]?.id) || curRecordIds[0];
        }
        break;
      case RecordType.Datasheet: {
        curRecordIds = visibleRows.map(row => row.recordId);
        curActiveRecordId = pageParamsRecordId!;
      }
        break;
    }
    setRealRecordIds(curRecordIds);
    setRealActiveRecordId(curActiveRecordId);
    errorHandle(datasheetErrorCode, curRecordIds, curActiveRecordId || 'not recordId');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot?.recordMap, datasheetErrorCode, independentDataLoading, pageParamsRecordId]);

  const switchRecord = useCallback(
    (index: number) => {
      if (recordType === RecordType.Datasheet) {
        expandRecordIdNavigate(realRecordIds[index]);
        expandRecordIdNavigate.flush();
      }
      setRealActiveRecordId(realRecordIds[index]);

      // 更新 previewFile 的 datasheetId 参数，并将 activeIndex 重置为第一个附件
      const previewFile = store.getState().previewFile;
      dispatch(
        StoreActions.setPreviewFile({
          ...previewFile,
          recordId: realRecordIds[index],
          activeIndex: 0,
        }),
      );
    },
    [realRecordIds, recordType],
  );

  if (!realActiveRecordId) {
    return (
      <div className={styles.wrapper}>
        <Skeleton width='38%' />
        <Skeleton count={2} />
        <Skeleton width='61%' />
      </div>
    );
  }

  const commonProps = {
    ...props,
    // 跟随 url 模式下，realActiveRecordId 跟随 url 中的 recordId
    // 这样写防止多次状态修改导致的 ExpandRecordComponent 多余的重渲染
    activeRecordId: isIndependent ? realActiveRecordId! : pageParamsRecordId!,
    pageParamsRecordId,
    recordIds: realRecordIds,
    switchRecord,
    datasheetId: datasheetId!,
    mirrorId: isMirror ? nodeId : undefined,
  };
  return <ExpandRecordComponent {...commonProps} />;
};

const WrapperWithTheme = props => {
  const cacheTheme = useSelector(Selectors.getTheme);
  return (
    <ThemeProvider theme={cacheTheme}>
      <Wrapper {...props} />
    </ThemeProvider>
  );
};

const ExpandRecordComponentBase: React.FC<IExpandRecordComponentProp> = props => {
  const colors = useThemeColors();
  const { activeRecordId, datasheetId, mirrorId, recordIds, modalClose, switchRecord, recordType, pageParamsRecordId } = props;
  const { allowShowCommentPane, activeDatasheetId, snapshot, shareId, templateId } = useSelector(
    state => ({
      nodeName: mirrorId ? Selectors.getMirror(state, mirrorId)?.name : Selectors.getDatasheet(state, datasheetId)!.name,
      allowShowCommentPane: Selectors.allowShowCommentPane(state),
      activeDatasheetId: Selectors.getActiveDatasheetId(state),
      snapshot: Selectors.getSnapshot(state, datasheetId)!,
      shareId: state.pageParams.shareId,
      templateId: state.pageParams.templateId,
    }),
    shallowEqual,
  );
  // const { fieldId: activeFieldId, operate: activeFieldOperateType } = useSelector(state => Selectors.gridViewActiveFieldState(state, datasheetId));
  const subscriptions = useSelector(state => state.subscriptions)!;
  const [commentPaneShow, { toggle: toggleCommentPane, set: setCommentPane }] = useToggle(Boolean(allowShowCommentPane));
  const { screenIsAtMost } = useResponsive();
  const query = useQuery();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const view = useGetViewByIdWithDefault(datasheetId, props.viewId)!;
  const viewId = props.viewId || view.id;
  const clickWithinField = useRef<boolean>();
  const _dispatch = useDispatch(); // 和/worker/dispatch区分

  const { run: subscribeRecordByIds } = useRequest(DatasheetApi.subscribeRecordByIds, { manual: true });
  const { run: unsubscribeRecordByIds } = useRequest(DatasheetApi.unsubscribeRecordByIds, { manual: true });

  const [fieldDescCollapseStatusMap, setFieldDescCollapseStatusMap] = useLocalStorageState<IFieldDescCollapseStatus>(
    StorageName.FieldDescCollapseStatus,
    { defaultValue: {}},
  );

  const isSideRecordOpen = useSelector(state => state.space.isSideRecordOpen);
  const recordVision = useSelector(state => state.recordVision);
  const isColumnLayout = recordVision === RecordVision.Side && isSideRecordOpen && !props.forceCenter;
  const isSetFocusIdByClickFieldRef = useRef(false);

  const [cacheType, setCacheType] = useLocalStorageState<ICacheType>('vika_activity_type', { defaultValue: {}});
  const handleCacheType = useCallback(
    (type: ActivitySelectType) => {
      setCacheType({
        ...cacheType,
        [datasheetId]: type,
      });
    },
    [cacheType, datasheetId, setCacheType],
  );

  const { fieldId: activeFieldId, operate: activeFieldOperateType, from: setFieldFrom } = useSelector(state =>
    Selectors.gridViewActiveFieldState(state, datasheetId),
  );

  useMount(() => {
    if (!allowShowCommentPane) {
      setCommentPane(false);
    } else if (recordType === RecordType.Independent) {
      setCommentPane(true);
    } else if (query.has('comment')) {
      setCommentPane(true);
    }
    // 移动端无comment参数时因为使用了Popup默认不激活面板
    else if (isMobile) {
      setCommentPane(false);
    } else if (cacheType?.[datasheetId] === ActivitySelectType.NONE) {
      setCommentPane(false);
    }
  });

  useEffect(() => {
    if (isMobile && allowShowCommentPane) {
      setCommentPane(false);
    }
  }, [allowShowCommentPane, isMobile, setCommentPane]);

  // 如果是侧边栏模式时，打开侧边栏
  useEffect(() => {
    recordVision === RecordVision.Side && _dispatch(StoreActions.toggleSideRecord(true));
  }, [_dispatch, recordVision]);

  const fromCurrentDatasheet = datasheetId === activeDatasheetId;
  const activeCellFieldId = useSelector(state => {
    const activeCell = Selectors.getActiveCell(state);
    return activeCell?.fieldId || null;
  });
  const activeId = fromCurrentDatasheet ? activeCellFieldId : null;

  const [focusFieldId, setFocusFieldId] = useState<string | null>(() => {
    return activeId || view.columns[0].fieldId;
  });

  // 点击左侧时，侧边栏也做定位
  useEffect(() => {
    if (!isSetFocusIdByClickFieldRef.current && isSideRecordOpen && activeId) {
      setTimeout(() => {
        setFocusFieldId(activeId);
      });
    }
  }, [isSideRecordOpen, pageParamsRecordId, activeId]);

  // 侧边模式时，焦点聚焦回到单元格
  useEffect(() => {
    if (isSideRecordOpen && pageParamsRecordId) {
      setTimeout(() => {
        ShortcutActionManager.trigger(ShortcutActionName.Focus);
      }, 50);
    }
  }, [isSideRecordOpen, pageParamsRecordId, activeId]);

  const hasMirrorId = Boolean(mirrorId);
  const hasShareId = Boolean(shareId);

  const [showHiddenField, setShowHiddenField] = useState(() => {
    if (hasMirrorId && hasShareId) {
      return false;
    }
    const list = getStorage(StorageName.ShowHiddenFieldInExpand) || [];
    return list.includes(`${datasheetId},${view.id}`);
  });

  const _setShowHiddenField = useCallback(
    (state: React.SetStateAction<boolean>) => {
      if (hasMirrorId && hasShareId) {
        return;
      }
      setShowHiddenField(state);
    },
    [hasMirrorId, hasShareId],
  );

  useUpdateEffect(() => {
    setFocusFieldId(activeId);
  }, [activeRecordId]);

  const updateFocusFieldId = useCallback(
    (fieldId: string | null) => {
      const dom = fieldId && document.getElementById(fieldId);
      if (!dom) {
        return;
      }
      // https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
      // dom 不在可视区时 offsetParent 为 null
      if (dom.offsetParent === null) {
        _setShowHiddenField(true);
      }
      dom.scrollIntoView(true);
      setFocusFieldId(fieldId);
    },
    [_setShowHiddenField],
  );

  const title = getRecordName(
    Selectors.getCellValue(store.getState(), snapshot, activeRecordId, view.columns[0].fieldId),
    snapshot.meta.fieldMap[view.columns[0].fieldId],
  );

  function onMouseDown() {
    if (clickWithinField.current) {
      clickWithinField.current = false;
      return;
    }
    setFocusFieldId(null);
  }

  // 侧边模式下，其他面板的发生鼠标按下事件时，让记录展开卡片失焦
  useEffect(() => {
    const els = [document.querySelector('.workspaceMenu'), document.querySelector('.dataspaceRight')];
    const _onMouseDown = onMouseDown;
    els.forEach(el => {
      el && el.addEventListener('mousedown', _onMouseDown, true);
    });

    return () => {
      els.forEach(el => {
        el && el.removeEventListener('mousedown', _onMouseDown, true);
      });
    };
  });

  const gotoSourceDst = () => {
    modalClose();
    const { shareId, templateId, categoryId } = store.getState().pageParams;
    const query = { activeRecordId };
    if (shareId) {
      Router.redirect(Navigation.SHARE_SPACE, {
        params: { nodeId: mirrorId || datasheetId, viewId, shareId, datasheetId },
        query,
      });
    } else if (templateId) {
      Router.redirect(Navigation.TEMPLATE, {
        params: { nodeId: mirrorId || datasheetId, viewId, categoryId, templateId, datasheetId },
        query,
      });
    } else {
      Router.redirect(Navigation.WORKBENCH, {
        params: { nodeId: mirrorId || datasheetId, viewId, datasheetId },
        query,
      });
    }
  };

  const onSubOrUnsub = async() => {
    if (subscriptions.includes(activeRecordId)) {
      const { data } = await unsubscribeRecordByIds({
        datasheetId,
        mirrorId,
        recordIds: [activeRecordId],
      });

      if (data?.success) {
        Message.info({ content: t(Strings.cancel_watch_record_success) });
        _dispatch(StoreActions.setSubscriptionsAction(subscriptions.filter(id => id !== activeRecordId)));
      } else {
        Message.error({ content: data.message });
      }

      return;
    }

    const { data } = await subscribeRecordByIds({
      datasheetId,
      mirrorId,
      recordIds: [activeRecordId],
    });

    if (data?.success) {
      Message.info({ content: t(Strings.watch_record_success) });
      _dispatch(StoreActions.setSubscriptionsAction([...new Set([...subscriptions, activeRecordId])]));
    } else {
      Message.error({ content: data.message });
    }
  };

  const EditorTitleContextVal = useMemo(
    () => ({
      updateFocusFieldId,
      fieldDescCollapseStatusMap,
      setFieldDescCollapseStatusMap,
    }),
    [fieldDescCollapseStatusMap, setFieldDescCollapseStatusMap, updateFocusFieldId],
  );

  const _setFocusFieldId = (id: string) => {
    isSetFocusIdByClickFieldRef.current = true;
    setTimeout(() => {
      isSetFocusIdByClickFieldRef.current = false;
    }, 10);
    // 侧边模式下，点击卡片中的输入框，左侧会进行聚焦
    if (!props.forceCenter && isSideRecordOpen && pageParamsRecordId && activeDatasheetId === datasheetId) {
      dispatch(
        StoreActions.setActiveCell(datasheetId, {
          recordId: pageParamsRecordId,
          fieldId: id,
        }),
      );
      setTimeout(() => {
        setFocusFieldId(id);
      }, 150);
    } else {
      setFocusFieldId(id);
    }
  };

  useEffect(() => {
    const onUnload = () => setFocusFieldId('');
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, [setFocusFieldId]);

  return (
    <EditorTitleContext.Provider value={EditorTitleContextVal}>
      <div
        className={classNames(isMobile ? styles.mobileContainer : styles.pcContainer, { isSideExpandRecord: isSideRecordOpen })}
        onMouseDown={onMouseDown}
      >
        {/* pc 端的显示 */}
        <ComponentDisplay minWidthCompatible={ScreenSize.md}>
          <div className={styles.headerRow}>
            <h2>{title}</h2>
            <div className={styles.buttonsOps}>
              {/* 独立展开的情况如通知或神奇关联新增等不需要展示翻页 */}
              <RecordOperationArea
                fromCurrentDatasheet={fromCurrentDatasheet}
                activeRecordId={activeRecordId}
                datasheetId={datasheetId}
                viewId={viewId}
                modalClose={modalClose}
                recordIds={recordIds}
                switchRecord={switchRecord}
                gotoSourceDst={gotoSourceDst}
                showPageTurn={recordType !== RecordType.Independent}
              />
              {/* 从通知中心、神奇表单等打开时，隐藏切换展示模式按钮 */}
              {!(!pageParamsRecordId || props.forceCenter) && <ExpandRecordVisionOption />}
              <ExpandRecordMoreOption
                modalClose={modalClose}
                expandRecordId={activeRecordId}
                datasheetId={datasheetId}
                sourceViewId={viewId}
                fromCurrentDatasheet={fromCurrentDatasheet}
              />
              {allowShowCommentPane && (
                <CommentButton
                  active={commentPaneShow}
                  onClick={() => {
                    handleCacheType(commentPaneShow ? ActivitySelectType.NONE : ActivitySelectType.All);
                    toggleCommentPane();
                  }}
                />
              )}
              {!shareId && !templateId && <SubscribeButton active={subscriptions.includes(activeRecordId)} onSubOrUnsub={() => onSubOrUnsub()} />}
            </div>
          </div>
          <div className={classNames(styles.expandRecordWrapper, { [styles.columnLayout]: isColumnLayout })}>
            <div className={styles.expandRecord}>
              <main>
                <EditorContainer
                  focusFieldId={focusFieldId}
                  clickWithinField={clickWithinField}
                  datasheetId={datasheetId}
                  mirrorId={mirrorId}
                  viewId={viewId}
                  expandRecordId={activeRecordId}
                  setFocusFieldId={_setFocusFieldId}
                  showHiddenField={showHiddenField}
                  setShowHiddenField={_setShowHiddenField}
                  modalClose={modalClose}
                  disappearHiddenField={Boolean(shareId && mirrorId)}
                />
                {/* 编辑字段Modal */}
                {activeFieldId && activeFieldOperateType === FieldOperateType.FieldSetting && (
                  <FieldSetting
                    datasheetId={datasheetId}
                    viewId={viewId}
                    targetDOM={setFieldFrom === SetFieldFrom.EXPAND_RECORD ? (document.querySelector(`.${styles.pcContainer}`) as HTMLElement) : null}
                    showAdvancedFields
                  />
                )}
                {/* 编辑字段描述Modal */}
                {activeFieldId && activeFieldOperateType === FieldOperateType.FieldDesc && (
                  <FieldDesc
                    fieldId={activeFieldId}
                    datasheetId={datasheetId}
                    readOnly={false}
                    targetDOM={setFieldFrom === SetFieldFrom.EXPAND_RECORD ? (document.querySelector(`.${styles.pcContainer}`) as HTMLElement) : null}
                  />
                )}
              </main>
            </div>
            {commentPaneShow && (
              <ActivityPane
                fromCurrentDatasheet={fromCurrentDatasheet}
                datasheetId={datasheetId}
                mirrorId={mirrorId}
                expandRecordId={activeRecordId}
                viewId={viewId}
                closable={!isMobile && !props.forceCenter && isSideRecordOpen}
                onClose={() => {
                  handleCacheType(ActivitySelectType.NONE);
                  setCommentPane(false);
                }} // 侧边栏模式下会显示关闭按钮
                style={
                  isColumnLayout
                    ? {
                      height: 150,
                      width: '100%',
                      maxWidth: '100%',
                      borderTop: '1px solid var(--fc5)',
                      flexGrow: 1,
                    }
                    : undefined
                }
              />
            )}
          </div>
          {/* {
           activeFieldId &&
           activeFieldOperateType === FieldOperateType.FieldSetting &&
           <FieldSetting datasheetId={datasheetId} viewId={viewId} targetDOM={document.body} />
           } */}
        </ComponentDisplay>
        {/* 手机端的显示 */}
        <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
          <div className={styles.mobileRecordHeader}>
            <div className={styles.toggleRecordBtnWrapper} onClick={modalClose}>
              <IconButton icon={() => <IconNarrow width={16} height={16} fill={colors.black[50]} />} />
            </div>
            <span className={styles.recordName}>{title}</span>
            <div className={styles.toCommentBtnWrapper}>
              {allowShowCommentPane && (
                <IconButton
                  shape='square'
                  icon={() => <CommentOutlined size={16} color={colors.black[50]} />}
                  className={styles.mobileCommentButton}
                  onClick={() => toggleCommentPane()}
                />
              )}
              <MoreTool
                recordId={activeRecordId}
                datasheetId={datasheetId}
                mirrorId={mirrorId}
                onClose={modalClose}
                commentPaneShow={commentPaneShow}
              />
            </div>
          </div>
          <div
            className={classNames(styles.contentWrapper, {
              [styles.turnToCommentPage]: commentPaneShow,
            })}
          >
            <div className={styles.mobileRecordContent}>
              <div className={styles.editorContainer}>
                <EditorContainer
                  focusFieldId={focusFieldId}
                  clickWithinField={clickWithinField}
                  datasheetId={datasheetId}
                  mirrorId={mirrorId}
                  viewId={viewId}
                  expandRecordId={activeRecordId}
                  setFocusFieldId={setFocusFieldId}
                  showHiddenField={showHiddenField}
                  setShowHiddenField={_setShowHiddenField}
                  modalClose={modalClose}
                  disappearHiddenField={Boolean(shareId && mirrorId)}
                />
              </div>
              <RecordPageTurn
                activeRecordId={activeRecordId}
                datasheetId={datasheetId}
                recordIds={recordIds}
                switchRecord={switchRecord}
                isMobile={isMobile}
              />
            </div>
            {commentPaneShow && <ActivityPane datasheetId={datasheetId} mirrorId={mirrorId} expandRecordId={activeRecordId} viewId={viewId} />}
          </div>
        </ComponentDisplay>
      </div>
    </EditorTitleContext.Provider>
  );
};

const ExpandRecordComponent = React.memo(ExpandRecordComponentBase);
