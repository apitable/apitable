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

import * as Sentry from '@sentry/nextjs';
import { useDebounceFn, useMount, useUnmount } from 'ahooks';
import classnames from 'classnames';
import produce from 'immer';
import { debounce, isArray } from 'lodash';
import _map from 'lodash/map';
import { AnimationItem } from 'lottie-web/index';
import Head from 'next/head';
import Image from 'next/image';
import * as React from 'react';
import { Dispatch, SetStateAction, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { Node } from 'slate';
import { Button, ContextMenu, TextButton, useThemeColors } from '@apitable/components';
import {
  Api,
  AutoTestID,
  CacheManager,
  ConfigConstant,
  Events,
  ExpCache,
  Field,
  FieldOperateType,
  FieldType,
  FormApi,
  getNewId,
  IDPrefix,
  IField,
  IFieldMap,
  IFormState,
  IRecord,
  Navigation,
  OVER_LIMIT_PER_SHEET_RECORDS,
  OVER_LIMIT_SPACE_RECORDS,
  Player,
  SegmentType,
  Selectors,
  StatusCode,
  StoreActions,
  Strings,
  t,
} from '@apitable/core';
import { ArrowDownOutlined, ArrowUpOutlined, EditOutlined, InfoCircleOutlined } from '@apitable/icons';
import { Logo } from 'pc/components/common/logo';
import { Message } from 'pc/components/common/message';
import { Popup } from 'pc/components/common/mobile/popup';
import { Modal } from 'pc/components/common/modal';
import { FieldDesc } from 'pc/components/multi_grid/field_desc';
import { FieldSetting } from 'pc/components/multi_grid/field_setting';
import { Router } from 'pc/components/route_manager/router';
import { useDispatch, useResponsive } from 'pc/hooks';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { flatContextData, IURLMeta } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import { getStorage, setStorage, StorageMethod, StorageName } from 'pc/utils/storage/storage';
import IconSuccess from 'static/icon/datasheet/form/successful.png';
import CompleteAnimationJson from 'static/json/complete_form.json';
import { ScreenSize } from '../common/component_display';
import { TComponent } from '../common/t_component';
import { VikaSplitPanel } from '../common/vika_split_panel';
import { getRecordName } from '../expand_record';
import { ShareContext } from '../share';
import { FormContext } from './form_context';
import { FormFieldContainer } from './form_field_container';
import { FormPropContainer } from './form_prop_container';
import { query2formData, string2Query } from './util';
// @ts-ignore
import { triggerUsageAlert, SubscribeUsageTipType } from 'enterprise/billing/trigger_usage_alert';
// @ts-ignore
import { PreFillPanel } from 'enterprise/pre_fill_panel/pre_fill_panel';
import styles from './style.module.less';

enum IFormContentType {
  Form = 'Form',
  Welcome = 'Welcome',
}

const serialize = (nodes: any) => {
  if (Array.isArray(nodes)) {
    return nodes.map((n) => Node.string(n)).join('\n');
  }
  return '';
};

const isEmptyValue = (value: unknown) => {
  if (value == null) {
    return true;
  }
  if (Array.isArray(value) || typeof value === 'string') {
    return value.length === 0;
  }
  return false;
};

const shownComputedTypes = [FieldType.LookUp, FieldType.Formula];
const defaultMeta = {
  views: [],
  fieldMap: {},
};

const tempRecordID = `${getNewId(IDPrefix.Record)}_temp`;

export const FormContainer: React.FC<
  React.PropsWithChildren<{
    preFill: boolean;
    setPreFill: Dispatch<SetStateAction<boolean>>;
  }>
> = (props) => {
  const { preFill, setPreFill } = props;
  const {
    id,
    name,
    cellEditable: _editable,
    manageable,
    snapshot,
    sourceInfo,
    isLogin,
    shareId,
    formRelMeta,
    fieldPermissionMap,
    activeFieldId,
    activeFieldOperateType,
  } = useAppSelector((state) => {
    const formState: IFormState = Selectors.getForm(state)!;
    const formRelMeta = Selectors.getFormRelMeta(state) || defaultMeta;

    const { id, sourceInfo, snapshot, permissions, name } = formState;
    const { cellEditable, manageable } = permissions;
    const isLogin = state.user.isLogin;
    const { shareId } = state.pageParams;
    const fieldPermissionMap = Selectors.getFieldPermissionMapFromForm(state);
    const { fieldId: activeFieldId, operate: activeFieldOperateType } = Selectors.gridViewActiveFieldState(state, sourceInfo.datasheetId);

    return {
      id,
      name,
      snapshot,
      sourceInfo,
      cellEditable,
      manageable,
      isLogin,
      shareId,
      formRelMeta,
      fieldPermissionMap,
      activeFieldId,
      activeFieldOperateType,
    };
  }, shallowEqual);
  const { formProps } = snapshot;
  const { fullScreen, coverVisible, brandVisible, fillAnonymous = false, submitLimit = 0, hasSubmitted } = formProps;
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  const [mount, setMount] = useState<boolean>(false);
  const [animationLoading, setAnimationLoading] = useState<boolean>(false);
  const [showWorkdoc, setShowWorkdoc] = useState<boolean>(false);
  const lottieAnimate = useRef<AnimationItem>();
  const [contentType, setContentType] = useState<IFormContentType>(IFormContentType.Form);
  const { datasheetId, viewId } = sourceInfo;
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const isPad = screenIsAtMost(ScreenSize.lg);
  const { shareInfo } = useContext(ShareContext);
  const fillDisabled = shareId && !fillAnonymous && !isLogin;
  const hasSubmitPermission = isLogin || fillAnonymous;
  const currentView = formRelMeta.views.filter((view) => view.id === viewId)[0];
  const fieldMap = useMemo(() => formRelMeta.fieldMap || {}, [formRelMeta.fieldMap]);
  const prevFieldMap = useRef(fieldMap);
  const unmounted = useRef(false);
  const query = string2Query();
  const colors = useThemeColors();
  const theme = useAppSelector(Selectors.getTheme);
  const { FORM_LOGIN_URL } = getEnvVariables();

  const dispatch = useDispatch();
  const storageName = shareId ? StorageName.SharedFormFieldContainer : StorageName.FormFieldContainer;
  const recordId = tempRecordID;

  const filteredColumns = useMemo(() => {
    if (!currentView) {
      dispatch(StoreActions.formErrorCode(id, StatusCode.FORM_FOREIGN_DATASHEET_NOT_EXIST));
      return [];
    }

    //  https://github.com/microsoft/TypeScript/issues/33591
    // The index field is added here to get the real column index even if there is a hidden column in the magic form.
    return _map(currentView.columns, (column, index) => ({ ...column, colIndex: index })).filter((column, index) => {
      const { fieldId, hidden } = column;
      const field = fieldMap[fieldId];
      if (field == null) {
        return false;
      }

      // Hide is the first column of the calculated field
      if (index == 0 && Field.bindModel(field).isComputed) {
        return false;
      }

      const formSheetAccessible = Selectors.getFormSheetAccessibleByFieldId(fieldPermissionMap, fieldId);

      return !hidden && formSheetAccessible && (!Field.bindModel(field).isComputed || shownComputedTypes.includes(field.type));
    });
    // eslint-disable-next-line
  }, [currentView, fieldMap, fieldPermissionMap]);

  const realContentType = useMemo(() => {
    if (shareId && submitLimit === 1 && hasSubmitted) {
      return IFormContentType.Welcome;
    }
    return contentType;
  }, [shareId, contentType, submitLimit, hasSubmitted]);

  const editable = useMemo(() => {
    if (shareId) {
      return shareInfo.allowEdit && !fillDisabled;
    }
    return _editable;
  }, [shareId, _editable, shareInfo, fillDisabled]);

  const isEmpty = useMemo(() => {
    const dataList = Object.values(formData).filter((v) => {
      return !isEmptyValue(v);
    });
    if (!dataList.length) {
      return true;
    }
    return false;
  }, [formData]);

  const warningTip = (content: string) => {
    Modal.warning({
      title: t(Strings.form_submit_fail),
      content,
      okText: t(Strings.refresh),
      onOk: () => {
        window.location.reload();
      },
    });
  };

  const networkErrorTip = () => {
    Modal.warning({
      title: t(Strings.form_submit_fail),
      content: t(Strings.form_network_error_tip),
      okText: t(Strings.confirm),
      onOk: () => resetLoadingState(),
      onCancel: () => resetLoadingState(),
    });
  };

  const emptyTip = () => {
    Message.warning({ content: t(Strings.form_empty_tip) });
    document.getElementById(filteredColumns[0]?.fieldId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const resetLoadingState = () => {
    lottieAnimate.current?.destroy();
    setAnimationLoading(false);
    setLoading(false);
  };

  const getRemindUnitIds = () => {
    const unitIds: string[] = [];
    Object.keys(formData).forEach((fieldId) => {
      const fieldMap = formRelMeta.fieldMap;
      const { property, type } = fieldMap[fieldId];
      const value = formData[fieldId];
      if (type === FieldType.Member && property?.shouldSendMsg && value?.length) {
        unitIds.push(...value);
      }
    });
    return [...new Set(unitIds)];
  };

  const commitRemind = (recordId: string, shareId?: string) => {
    try {
      const unitIds = getRemindUnitIds();
      const unitRecs: {
        recordIds: string[];
        unitIds: string[];
        recordTitle: string;
        fieldName?: string;
      }[] = [];
      const frozenFieldId = currentView.columns[0].fieldId;
      const frozenField = fieldMap[frozenFieldId];
      unitIds.forEach((unitId) => {
        // eslint-disable-next-line no-unsafe-optional-chaining
        const { fieldId: firstMemberFieldId }: any = formRelMeta.views[0]?.columns.find(({ fieldId }) => {
          const value = formData[fieldId];
          return isArray(value) && value.includes(unitId);
        });
        unitRecs.push({
          recordIds: [recordId],
          unitIds: [unitId],
          recordTitle: getRecordName(formData[frozenFieldId], frozenField) || '',
          fieldName: fieldMap[firstMemberFieldId]?.name,
        });
      });

      if (!unitRecs.length) return;
      const postData = {
        isNotify: true,
        nodeId: sourceInfo.datasheetId,
        viewId,
        unitRecs,
      };
      if (shareId) {
        postData['linkId'] = shareId;
      }
      Api.commitRemind(postData);
    } catch (error) {
      Sentry.captureMessage(String(error));
    }
  };

  const verifyForm = () => {
    const requiredFields = filteredColumns.reduce((acc, column) => {
      const field = fieldMap[column.fieldId];
      const isComputedField = field && Field.bindModel(field).isComputed;
      if (field.required && !isComputedField) {
        acc.push(column.fieldId);
      }
      return acc;
    }, [] as string[]);
    if (!requiredFields.length) {
      return true;
    }
    let firstError = '';
    const errors = requiredFields.reduce((acc, fieldKey) => {
      if (isEmptyValue(formData[fieldKey])) {
        acc[fieldKey] = t(Strings.field_required);
        if (!firstError) firstError = fieldKey;
      }
      return acc;
    }, {});
    if (!firstError) {
      return true;
    }
    setFormErrors(errors);
    document.getElementById(firstError)?.scrollIntoView({ behavior: 'smooth' });
    return false;
  };

  const onSubmit = async () => {
    if (isEmpty) {
      emptyTip();
      return;
    }
    if (!verifyForm()) {
      return;
    }
    setLoading(true);
    setAnimationLoading(true);

    const noAccessibleFieldIdSet = currentView.columns
      .filter((column) => {
        const { fieldId } = column;
        return !Selectors.getFormSheetAccessibleByFieldId(fieldPermissionMap, fieldId);
      })
      .reduce((set, column) => {
        set.add(column.fieldId);
        return set;
      }, new Set<string>());

    const postData = {};
    for (const key in formData) {
      let val = formData[key];
      if (val != null && !noAccessibleFieldIdSet.has(key)) {
        const { property, type } = fieldMap[key];
        if (type === FieldType.URL && property?.isRecogURLFlag) {
          const matchMeta = val[0]?.text;
          const res = await Api.getURLMetaBatch([matchMeta]);
          if (res?.data?.success) {
            const metaMap = res.data.data.contents;
            const meta: IURLMeta = metaMap[matchMeta];
            if (meta?.isAware) {
              val = [
                {
                  text: matchMeta,
                  type: SegmentType.Url,
                  favicon: meta?.favicon,
                  title: meta?.title,
                },
              ];
            }
          }
        }
        postData[key] = val;
      }
    }

    if (shareId) {
      return FormApi.addShareFormRecord(id, shareId, postData)
        .then((response) => {
          const { success, code, data, message } = response.data;
          if (success) {
            return onSubmitSuccess(data.recordId, shareId);
          }
          handleAddRecordError(code, message);
        })
        .catch(() => networkErrorTip())
        .finally(() => {
          setLoading(false);
          setAnimationLoading(false);
        });
    }
    return FormApi.addFormRecord(id, postData)
      .then((response) => {
        const { success, code, data, message } = response.data;
        if (success) {
          return onSubmitSuccess(data.recordId);
        }
        handleAddRecordError(code, message);
      })
      .catch(() => networkErrorTip())
      .finally(() => {
        setLoading(false);
        setAnimationLoading(false);
      });
  };

  const handleAddRecordError = (code: number, errMsg: any) => {
    let str = t(Strings.form_error_tip);
    if (code === StatusCode.SPACE_CAPACITY_OVER_LIMIT) str = t(Strings.form_space_capacity_over_limit);
    if ([OVER_LIMIT_PER_SHEET_RECORDS, OVER_LIMIT_SPACE_RECORDS].includes(String(code))) {
      const { usage } = JSON.parse(errMsg);
      triggerUsageAlert(
        OVER_LIMIT_PER_SHEET_RECORDS === String(code) ? 'maxRowsPerSheet' : 'maxRowsInSpace',
        { usage: usage, alwaysAlert: true },
        SubscribeUsageTipType.Alert,
      );
      return;
    }
    warningTip(str);
  };

  const onSubmitSuccess = (realRecordId: string, shareId?: string) => {
    lottieAnimate.current && lottieAnimate.current.playSegments([60, 160], true);
    setTimeout(() => {
      lottieAnimate.current && lottieAnimate.current.destroy();
      setAnimationLoading(false);
    }, 1600);
    commitRemind(realRecordId, shareId);
    setFormData({});
    setFormErrors({});
    setShowWorkdoc(false);
    patchRecord({ id: recordId, data: {}, commentCount: 0 });
    Message.success({ content: t(Strings.form_submit_success) });
    if (shareId) {
      setContentType(IFormContentType.Welcome);
    }
  };

  const onJump = () => {
    Router.newTab(Navigation.HOME, { query: { home: 1 } });
  };

  const onFillAgain = () => {
    window.location.reload();
  };

  const msgContent = (
    <>
      {t(Strings.share_form_edit_tip)}
      <i
        id={AutoTestID.GO_LOGIN_BTN}
        className={styles.loginBtn}
        onClick={() => {
          localStorage.setItem('reference', window.location.href);
          location.href = `${FORM_LOGIN_URL}?reference=${window.location.href}&spaceId=${shareInfo.spaceId}`;
        }}
      >
        {t(Strings.login)}
      </i>
    </>
  );

  const clearCache = () => {
    ExpCache.clearAll();
    CacheManager.clearDsCache(datasheetId);
  };

  useEffect(() => {
    const formContainer = document.querySelector('.vikaFormContainer');

    function onMouseDown() {
      if (fillDisabled) {
        Message.destroy();
        Message.warning({
          content: msgContent,
          duration: undefined,
        });
      }
    }

    formContainer?.addEventListener('mousedown', onMouseDown);
    return () => formContainer?.removeEventListener('mousedown', onMouseDown);
    // eslint-disable-next-line
  }, [fillDisabled]);

  // TODO(kailang)
  // const collectDefaultData = (fieldMap: IFieldMap) => {
  //   const defaultData = {};
  //   for (const fId in fieldMap) {
  //     const defaultValue = Field.bindModel(fieldMap[fId]).defaultValue();
  //     if (defaultValue) {
  //       defaultData[fId] = defaultValue;
  //     }
  //   }
  //   return defaultData;
  // };

  const validValue = (localValue: any, fieldMap: IFieldMap) => {
    if (!localValue || !fieldMap) {
      return {};
    }
    const res = {};
    for (const key in localValue) {
      if (fieldMap[key]) {
        const value = localValue[key];
        if (Field.bindModel(fieldMap[key]).validate(value)) {
          res[key] = value;
        }
      }
    }
    return res;
  };

  useMount(() => {
    Player.doTrigger(Events.workbench_form_container_shown);
    if (fillDisabled) {
      Message.warning({
        content: msgContent,
        duration: undefined,
      });
    }
    if (!editable && hasSubmitPermission && shareId) {
      Message.warning({ content: t(Strings.form_only_read_tip), duration: 0 });
    } else {
      const formFieldContainer = getStorage(storageName);
      // const defaultData = collectDefaultData(fieldMap);
      const queryData = query2formData(query, fieldMap, fieldPermissionMap);
      const cacheData = validValue(formFieldContainer?.[id], fieldMap);
      setFormData({ ...cacheData, ...queryData });
      patchRecord({ id: recordId, data: cacheData, commentCount: 0 });
    }
    setMount(true);
  });

  const removeTmpSnapshot = () => {
    const preSnapshot = Selectors.getSnapshot(store.getState(), sourceInfo.datasheetId);
    if (!preSnapshot) {
      return;
    }
    const newSnapshot = produce(preSnapshot, (draft) => {
      const view = draft.meta.views.find((view) => view.id === viewId);
      if (!view) {
        return draft;
      }
      const rows = view.rows;
      const index = rows.findIndex((row) => row.recordId === recordId);
      if (index !== -1) {
        rows.splice(index, 1);
      }
      delete draft.recordMap[recordId];
      return draft;
    });
    dispatch(StoreActions.updateSnapshot(datasheetId, newSnapshot));
  };

  useUnmount(() => {
    unmounted.current = true;
    removeTmpSnapshot();
    const formFieldContainer = getStorage(storageName);
    setFormData(formFieldContainer?.[id] || {});
  });

  const lottieRef = useRef<any>();
  useEffect(() => {
    import('lottie-web/build/player/lottie_svg').then((module) => {
      lottieRef.current = module.default;
    });
  }, []);

  useEffect(() => {
    if (loading) {
      const loadingElement = document.querySelector('.formSubmitLoading');
      if (loadingElement) {
        lottieAnimate.current = lottieRef.current.loadAnimation({
          container: loadingElement!,
          renderer: 'svg',
          loop: true,
          autoplay: false,
          animationData: CompleteAnimationJson,
        });
        lottieAnimate.current && lottieAnimate.current.playSegments([0, 60], true);
      }
    }
  }, [loading]);

  const patchRecord = debounce((record: IRecord) => {
    if (unmounted.current) return;
    const preSnapshot = Selectors.getSnapshot(store.getState(), sourceInfo.datasheetId);
    if (!preSnapshot) {
      return;
    }
    const newSnapshot = produce(preSnapshot, (draft) => {
      const view = draft.meta.views.find((view) => view.id === viewId);
      if (view) {
        if (!view.rows.find((row) => row.recordId === recordId) && !recordId.endsWith('_temp')) {
          view.rows.push({ recordId });
        }
        draft.recordMap[recordId] = record;
      }
      return draft;
    });
    clearCache();
    dispatch(StoreActions.updateSnapshot(datasheetId, newSnapshot));
  }, 300);

  const { run: setFormToStorage } = useDebounceFn(
    (formData) => {
      const formFieldContainer = getStorage(storageName);
      setStorage(
        storageName,
        {
          ...formFieldContainer,
          [id]: formData,
        },
        StorageMethod.Set,
      );
    },
    { wait: 300 },
  );

  useEffect(() => {
    setFormToStorage(formData);
  }, [formData, setFormToStorage]);

  useEffect(() => {
    const diffFields = [] as string[];
    if (fieldMap === prevFieldMap.current) {
      return;
    }
    let hasChange = Object.keys(fieldMap).length !== Object.keys(prevFieldMap.current).length;

    for (const key in prevFieldMap.current) {
      const prevField: IField = prevFieldMap.current[key];
      const curField: IField = fieldMap[key];
      if (!curField || curField.type !== prevField.type) {
        hasChange = true;
        diffFields.push(prevField.id);
      }
    }
    if (diffFields.length) {
      const nextFormData = { ...formData };
      for (const fieldId of diffFields) {
        delete nextFormData[fieldId];
      }
      setFormData(nextFormData);
      patchRecord({ id: recordId, data: nextFormData, commentCount: 0 });
    }
    if (hasChange) {
      Message.info({ content: t(Strings.view_form_field_changed_tip) });
      prevFieldMap.current = fieldMap;
    }
    // eslint-disable-next-line
  }, [fieldMap]);

  const _setFormData = useCallback(
    (fieldId: any, value: any) => {
      setFormData((prev) => {
        const data = { ...prev, [fieldId]: value };
        patchRecord({ id: recordId, data } as IRecord);
        return data;
      });
      setFormErrors({ ...formErrors, [fieldId]: '' });
    },
    [formErrors, patchRecord, recordId],
  );

  const brandFooter = brandVisible ? (
    <div className={styles.brandContainerWrapper}>
      <div
        className={classnames(styles.brandContainer, {
          [styles.brandContainerMobile]: isMobile,
          [styles.autoFixer]: realContentType === IFormContentType.Welcome,
        })}
      >
        <TComponent
          tkey={t(Strings.brand_desc)}
          params={{
            logo: (
              <span className={styles.logoWrap} onClick={onJump}>
                <Logo size="mini" theme={theme} />
              </span>
            ),
          }}
        />
      </div>
    </div>
  ) : null;

  return (
    <FormContext.Provider
      value={{
        mount,
        formProps,
        formData,
        formErrors,
        showWorkdoc,
        setShowWorkdoc,
        setFormData: _setFormData,
        setFormErrors: (fieldId, errMsg) => {
          setFormErrors({ ...formErrors, [fieldId]: errMsg });
        },
        setFormToStorage: (fieldId, value) => {
          setFormToStorage({ ...formData, [fieldId]: value });
        },
      }}
    >
      <Head>
        <meta property="og:description" content={serialize(formProps.description)} />
        <title>{name}</title>
      </Head>
      <div className={classnames(styles.formContainer, 'vikaFormContainer')} id={AutoTestID.FORM_CONTAINER}>
        <VikaSplitPanel
          panelLeft={
            realContentType === IFormContentType.Form ? (
              <div className={styles.formContentWrapper}>
                <div
                  className={classnames(styles.formContent, {
                    [styles.fullScreen]: fullScreen || isMobile,
                    [styles.noCover]: !fullScreen && !coverVisible,
                    [styles.formContentMobile]: isMobile,
                  })}
                >
                  {/* Magic Forms own properties */}
                  <FormPropContainer
                    formId={id}
                    title={name}
                    formProps={formProps}
                    // Property editing is only possible with administrative rights
                    editable={manageable && !preFill}
                  />

                  {/* Column attributes and filled data */}
                  <div
                    className={classnames(styles.formFieldContainer, {
                      [styles.formFieldContainerMobile]: isMobile,
                    })}
                  >
                    <FormFieldContainer
                      filteredColumns={filteredColumns}
                      datasheetId={datasheetId}
                      viewId={viewId}
                      meta={formRelMeta}
                      editable={editable}
                      recordId={recordId}
                    />
                  </div>

                  {/* Submit button */}
                  {!preFill && (
                    <div
                      className={classnames(styles.submitWrapper, {
                        [styles.submitWrapperMobile]: isMobile,
                        [styles.submitWrapperLoading]: loading || animationLoading,
                      })}
                    >
                      <Button
                        className={styles.submitBtn}
                        block
                        style={{
                          height: '100%',
                        }}
                        color="primary"
                        onClick={onSubmit}
                        disabled={loading || !editable}
                      >
                        {animationLoading && <span className={classnames(styles.submitLoading, 'formSubmitLoading')} />}
                        {animationLoading && !loading && t(Strings.form_submit_success)}
                        {!animationLoading && !loading && (fillAnonymous && shareId ? t(Strings.button_submit_anonymous) : t(Strings.form_submit))}
                        {animationLoading && loading && t(Strings.form_submit_loading)}
                      </Button>
                    </div>
                  )}
                </div>
                {brandFooter}
              </div>
            ) : (
              <div />
            )
          }
          panelRight={
            !isPad && preFill && PreFillPanel ? (
              <PreFillPanel formData={formData} fieldMap={fieldMap} setPreFill={setPreFill} columns={currentView.columns} />
            ) : (
              <div />
            )
          }
          primary="second"
          size={!isPad && preFill ? 320 : 0}
          allowResize={false}
          pane1Style={{ overflow: 'hidden' }}
        />
        {isPad && preFill && PreFillPanel && (
          <Popup
            width="100%"
            height={isPad ? '60%' : '90%'}
            open={preFill}
            onClose={() => setPreFill(false)}
            closable={false}
            className={styles.mobilePreFill}
          >
            {<PreFillPanel formData={formData} fieldMap={fieldMap} setPreFill={setPreFill} columns={currentView.columns} />}
          </Popup>
        )}

        {/* Form welcome page */}
        {realContentType === IFormContentType.Welcome && (
          <>
            <div
              className={classnames(styles.welcomeWrapper, {
                [styles.welcomeWrapperMobile]: isMobile,
              })}
            >
              <div className={styles.welcome}>
                <div className={styles.welcomeInner}>
                  <span className={styles.iconSuccess}>
                    <Image src={IconSuccess} alt="submit_success" width={100} height={80} />
                  </span>
                  <span className={styles.thankText}>{t(Strings.form_thank_text)}</span>
                  {submitLimit === 0 && (
                    <TextButton color="primary" className={styles.linkBtn} onClick={onFillAgain}>
                      {t(Strings.form_fill_again)}
                    </TextButton>
                  )}
                </div>
              </div>
            </div>
            {brandFooter}
          </>
        )}

        {/* Top left: brand logo */}
        {brandVisible && shareId && !fullScreen && !isMobile && (
          <div className={classnames('formVikaLogo', styles.logoContainer)}>
            <span className={styles.img} onClick={onJump}>
              <Logo theme={theme} />
            </span>
          </div>
        )}

        {/* Edit field Modal */}
        {activeFieldId && activeFieldOperateType === FieldOperateType.FieldSetting && (
          <FieldSetting
            datasheetId={datasheetId}
            viewId={viewId}
            targetDOM={document.querySelector('.vikaFormContainer') as HTMLElement}
            showAdvancedFields={false}
          />
        )}

        {/* Edit field description Modal */}
        {activeFieldId && activeFieldOperateType === FieldOperateType.FieldDesc && (
          <FieldDesc
            fieldId={activeFieldId}
            datasheetId={datasheetId}
            readOnly={!manageable || preFill}
            targetDOM={document.querySelector('.vikaFormContainer') as HTMLElement}
          />
        )}

        <ContextMenu
          menuId={ConfigConstant.ContextMenuType.FORM_FIELD_OP}
          overlay={flatContextData(
            [
              [
                {
                  icon: <EditOutlined color={colors.thirdLevelText} />,
                  text: t(Strings.modify_field),
                  hidden: ({ props }: any) => !props?.onEdit,
                  onClick: ({ props }: any) => props?.onEdit && props.onEdit(),
                },
                {
                  icon: <InfoCircleOutlined color={colors.thirdLevelText} />,
                  text: t(Strings.editing_field_desc),
                  onClick: ({ props }: any) => props?.onEditDesc && props.onEditDesc(),
                },
                {
                  icon: <ArrowUpOutlined color={colors.thirdLevelText} />,
                  text: t(Strings.insert_field_above),
                  disabled: ({ props }: any) => !props.onInsertAbove,
                  onClick: ({ props }: any) => props?.onInsertAbove && props.onInsertAbove(),
                },
                {
                  icon: <ArrowDownOutlined color={colors.thirdLevelText} />,
                  text: t(Strings.insert_field_below),
                  onClick: ({ props }: any) => props?.onInsertBelow && props.onInsertBelow(),
                },
              ],
            ],
            true,
          )}
        />
      </div>
    </FormContext.Provider>
  );
};
