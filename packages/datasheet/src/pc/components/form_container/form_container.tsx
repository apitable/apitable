import * as Sentry from '@sentry/react';
import { Button, ContextMenu, TextButton, useThemeColors } from '@vikadata/components';
import {
  Api, AutoTestID, CacheManager, ConfigConstant, Events, ExpCache, Field, FieldOperateType, FieldType, FormApi, getNewId, IDPrefix, IField, IFieldMap,
  IFormState, IRecord, ISegment, isPrivateDeployment, Navigation, Player, Selectors, StatusCode, StoreActions, string2Segment, Strings, t,
} from '@apitable/core';
import { ArrowDownOutlined, ArrowUpOutlined, EditDescribeOutlined, EditOutlined } from '@vikadata/icons';
import { useDebounceFn, useMount, useUnmount } from 'ahooks';
import classnames from 'classnames';
import produce from 'immer';
import { isArray } from 'lodash';
import _map from 'lodash/map';
import { AnimationItem } from 'lottie-web';
import Head from 'next/head';
import Image from 'next/image';
import { Logo } from 'pc/components/common/logo';
import { Message } from 'pc/components/common/message';
import { Modal } from 'pc/components/common/modal';
import { FieldDesc } from 'pc/components/multi_grid/field_desc';
import { FieldSetting } from 'pc/components/multi_grid/field_setting';
import { Router } from 'pc/components/route_manager/router';
import { useDispatch, useQuery, useResponsive } from 'pc/hooks';
import { store } from 'pc/store';
import { flatContextData } from 'pc/utils';
import { getStorage, setStorage, StorageMethod, StorageName } from 'pc/utils/storage/storage';
import * as React from 'react';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import IconSuccess from 'static/icon/datasheet/form/successful.png';
import CompleteAnimationJson from 'static/json/complete_form.json';
import { ScreenSize } from '../common/component_display';
import { TComponent } from '../common/t_component';
import { getRecordName } from '../expand_record';
import { ShareContext } from '../share';
import { FormContext } from './form_context';
import { FormFieldContainer } from './form_field_container';
import { FormPropContainer } from './form_prop_container';
import styles from './style.module.less';
import { Node } from 'slate';

enum IFormContentType {
  Form = 'Form',
  Welcome = 'Welcome',
}

const serialize = nodes => {
  if (Array.isArray(nodes)) {
    return nodes.map(n => Node.string(n)).join('\n');
  }
  return '';
};

const isEmptyValue = value => {
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

export const FormContainer: React.FC = () => {
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
  } = useSelector(state => {
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
  const [animationLoading, setAnimationLoading] = useState<boolean>(false);
  const lottieAnimate = useRef<AnimationItem>();
  const [contentType, setContentType] = useState<IFormContentType>(IFormContentType.Form);
  const { datasheetId, viewId } = sourceInfo;
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const { shareInfo } = useContext(ShareContext);
  const fillDisabled = shareId && !fillAnonymous && !isLogin; // 分享状态下，配置了不能匿名填写，则未登录不能填写神奇表单
  const hasSubmitPermission = isLogin || fillAnonymous;
  const currentView = formRelMeta.views.filter(view => view.id === viewId)[0];
  const fieldMap = useMemo(() => formRelMeta.fieldMap || {}, [formRelMeta.fieldMap]);
  const prevFieldMap = useRef(fieldMap);
  const unmounted = useRef(false);
  const query = useQuery();
  const colors = useThemeColors();

  const dispatch = useDispatch();
  const storageName = shareId ? StorageName.SharedFormFieldContainer : StorageName.FormFieldContainer;
  const recordId = tempRecordID;

  const filteredColumns = useMemo(() => {
    if (!currentView) {
      dispatch(StoreActions.formErrorCode(id, StatusCode.FORM_FOREIGN_DATASHEET_NOT_EXIST));
      return [];
    }

    // 联合类型ts4.1.5以下用map会报错 https://github.com/microsoft/TypeScript/issues/33591
    // 这里新增index字段是为了在有隐藏列的情况下神奇表单新增列也能拿到真实的列index
    return _map(currentView.columns, (column, index) => ({ ...column, colIndex: index })).filter((column, index) => {
      const { fieldId, hidden } = column;
      const field = fieldMap[fieldId];
      if (field == null) {
        return false;
      }

      // 隐藏是计算字段的首列
      if (index == 0 && Field.bindModel(field).isComputed) {
        return false;
      }

      const formSheetAccessible = Selectors.getFormSheetAccessibleByFieldId(fieldPermissionMap, fieldId);

      return !hidden && formSheetAccessible && (!Field.bindModel(field).isComputed || shownComputedTypes.includes(field.type));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView, fieldMap, fieldPermissionMap]);

  const realContentType = useMemo(() => {
    // 分享的神奇表单限制只能提交一次，非站内成员提交完之后再次访问会进入欢迎页
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
    const dataList = Object.values(formData).filter(v => {
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

  // 网络状况导致无法提交的提示
  const networkErrorTip = () => {
    Modal.warning({
      title: t(Strings.form_submit_fail),
      content: t(Strings.form_network_error_tip),
      okText: t(Strings.confirm),
      onOk: () => resetLoadingState(),
      onCancel: () => resetLoadingState(),
    });
  };

  // 没有填写神奇表单的任何字段
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
    Object.keys(formData).forEach(fieldId => {
      const fieldMap = formRelMeta.fieldMap;
      const { property, type } = fieldMap[fieldId];
      const value = formData[fieldId];
      if (type === FieldType.Member && property?.shouldSendMsg && value?.length) {
        unitIds.push(...value);
      }
    });
    return [...new Set(unitIds)];
  };

  // 站内神奇表单提交之后，进行成员提及
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
      unitIds.forEach(unitId => {
        // 如果有多个成员字段则用第一个 fileName
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

  // 提交表单数据
  const onSubmit = () => {
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
      .filter(column => {
        const { fieldId } = column;
        return !Selectors.getFormSheetAccessibleByFieldId(fieldPermissionMap, fieldId);
      })
      .reduce((set, column) => {
        set.add(column.fieldId);
        return set;
      }, new Set<string>());

    const postData = Object.keys(formData).reduce((obj, key) => {
      if (formData[key] != null && !noAccessibleFieldIdSet.has(key)) {
        obj[key] = formData[key];
      }
      return obj;
    }, {});
    if (shareId) {
      return FormApi.addShareFormRecord(id, shareId, postData)
        .then(response => {
          const { success, code, data } = response.data;
          if (success) {
            return onSubmitSuccess(data.recordId, shareId);
          }
          const isOverLimit = code === StatusCode.SPACE_CAPACITY_OVER_LIMIT;
          warningTip(isOverLimit ? t(Strings.form_space_capacity_over_limit) : t(Strings.form_error_tip));
        })
        .catch(() => networkErrorTip())
        .finally(() => setLoading(false));
    }
    return FormApi.addFormRecord(id, postData)
      .then(response => {
        const { success, code, data } = response.data;
        if (success) {
          return onSubmitSuccess(data.recordId);
        }
        const isOverLimit = code === StatusCode.SPACE_CAPACITY_OVER_LIMIT;
        warningTip(isOverLimit ? t(Strings.form_space_capacity_over_limit) : t(Strings.form_error_tip));
      })
      .catch(() => networkErrorTip())
      .finally(() => setLoading(false));
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
    patchRecord({ id: recordId, data: {}, commentCount: 0 });
    Message.success({ content: t(Strings.form_submit_success) });
    if (shareId) {
      setContentType(IFormContentType.Welcome);
    }
    // 神策埋点
    try {
      !isPrivateDeployment() && (window as any).sensors.track('formSubmitSuccess', { $url: window.location.href });
    } catch (error) {
      Sentry.captureMessage(String(error));
    }
  };

  // 跳转官网
  const onJump = () => {
    Router.newTab(Navigation.HOME, { query: { home: 1 }});
  };

  // 再次填写
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
          Router.push(Navigation.LOGIN, { query: { reference: window.location.href, spaceId: shareInfo.spaceId }});
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
          duration: null,
        });
      }
    }

    formContainer?.addEventListener('mousedown', onMouseDown);
    return () => formContainer?.removeEventListener('mousedown', onMouseDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fillDisabled]);

  // TODO(kailang) 下个 sprint 支持表单默认值
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

  const validValue = (localValue, fieldMap) => {
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

  const validQuery = (fieldMap: IFieldMap) => {
    const res: { [fieldId: string]: ISegment[] } = {};
    for (const [key, value] of query) {
      if (fieldMap[key]) {
        const fieldAccessible = Selectors.getFormSheetAccessibleByFieldId(fieldPermissionMap, key);
        if (fieldAccessible && [FieldType.SingleText, FieldType.Text].includes(fieldMap[key].type)) {
          res[key] = string2Segment(value);
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
        duration: null,
      });
    }
    if (!editable && hasSubmitPermission && shareId) {
      Message.warning({ content: t(Strings.form_only_read_tip), duration: 0 });
    } else {
      const formFieldContainer = getStorage(storageName);
      // const defaultData = collectDefaultData(fieldMap);
      const queryData = validQuery(fieldMap);
      const cacheData = validValue(formFieldContainer?.[id], fieldMap);
      setFormData({ ...cacheData, ...queryData });
      patchRecord({ id: recordId, data: cacheData, commentCount: 0 });
    }
  });

  const removeTmpSnapshot = () => {
    const preSnapshot = Selectors.getSnapshot(store.getState(), sourceInfo.datasheetId);
    if (!preSnapshot) {
      return;
    }
    const newSnapshot = produce(preSnapshot, draft => {
      const view = draft.meta.views.find(view => view.id === viewId);
      if (!view) {
        return draft;
      }
      const rows = view.rows;
      const index = rows.findIndex(row => row.recordId === recordId);
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
    // 读取缓存，初始化formData
    const formFieldContainer = getStorage(storageName);
    setFormData(formFieldContainer?.[id] || {});
  });

  const lottieRef = useRef<any>();
  useEffect(() => {
    // 提前预加载动画脚本，提交时不会出现先加载脚本再出现动画的情况
    import('lottie-web/build/player/lottie_svg').then(module => {
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

  const patchRecord = useCallback(
    (record: IRecord) => {
      // 防止因为子组件卸载时调用setFormData，从而patch一条假记录到数表
      if (unmounted.current) return;
      const preSnapshot = Selectors.getSnapshot(store.getState(), sourceInfo.datasheetId);
      if (!preSnapshot) {
        return;
      }
      const newSnapshot = produce(preSnapshot, draft => {
        const view = draft.meta.views.find(view => view.id === viewId);
        if (view) {
          if (!view.rows.find(row => row.recordId === recordId)) {
            view.rows.push({ recordId });
          }
          draft.recordMap[recordId] = record;
        }
        return draft;
      });
      clearCache();
      dispatch(StoreActions.updateSnapshot(datasheetId, newSnapshot));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [datasheetId, dispatch, viewId, recordId, sourceInfo.datasheetId],
  );
  // 收集表数据写入localStorage
  const { run: setFormToStorage } = useDebounceFn(
    formData => {
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
      Message.info({ content: t(Strings.vika_form_change_tip) });
      prevFieldMap.current = fieldMap;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldMap]);

  const _setFormData = useCallback(
    (fieldId, value) => {
      setFormData(prev => {
        const data = { ...prev, [fieldId]: value };
        patchRecord({ id: recordId, data } as IRecord);
        return data;
      });
      setFormErrors({ ...formErrors, [fieldId]: '' });
    },
    [formErrors, patchRecord, recordId],
  );

  return (
    <FormContext.Provider
      value={{
        formProps,
        formData,
        formErrors,
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
        <meta property='og:description' content={serialize(formProps.description) || '维格表, 积木式多媒体数据表格, 维格表技术首创者, 数据整理神器, 让人人都是数据设计师'} />
      </Head>
      <div className={classnames(styles.formContainer, 'vikaFormContainer')} id={AutoTestID.FORM_CONTAINER}>
        {/* 表单填写页 */}
        {realContentType === IFormContentType.Form && (
          <div
            className={classnames(styles.formContent, {
              [styles.fullScreen]: fullScreen || isMobile,
              [styles.noCover]: !fullScreen && !coverVisible,
              [styles.formContentMobile]: isMobile,
            })}
          >
            {/* 神奇表单自有属性 */}
            <FormPropContainer
              formId={id}
              title={name}
              formProps={formProps}
              // 只有管理权限才能进行属性编辑
              editable={manageable}
            />

            {/* 列属性和填写的数据 */}
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

            {/* 提交按钮 */}
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
                color='primary'
                onClick={onSubmit}
                disabled={loading || !editable}
              >
                {animationLoading && <span className={classnames(styles.submitLoading, 'formSubmitLoading')} />}
                {animationLoading && !loading && t(Strings.form_submit_success)}
                {!animationLoading && !loading && (fillAnonymous && shareId ? t(Strings.form_fill_anonymous) : t(Strings.form_submit))}
                {animationLoading && loading && t(Strings.form_submit_loading)}
              </Button>
            </div>
          </div>
        )}

        {/* 表单欢迎页 */}
        {realContentType === IFormContentType.Welcome && (
          <div
            className={classnames(styles.welcomeWrapper, {
              [styles.welcomeWrapperMobile]: isMobile,
            })}
          >
            <div className={styles.welcome}>
              <div className={styles.welcomeInner}>
                <span className={styles.iconSuccess}>
                  <Image src={IconSuccess} alt='submit_success' width={100} height={80} />
                </span>
                <span className={styles.thankText}>{t(Strings.form_thank_text)}</span>
                {submitLimit === 0 && (
                  <TextButton color='primary' className={styles.linkBtn} onClick={onFillAgain}>
                    {t(Strings.form_fill_again)}
                  </TextButton>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 页脚：品牌水印 */}
        {brandVisible && (
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
                      <Logo size='mini' />
                    </span>
                  ),
                }}
              />
            </div>
          </div>
        )}

        {/* 左上角：品牌 logo */}
        {shareId && !fullScreen && !isMobile && (
          <div className={classnames('formVikaLogo', styles.logoContainer)}>
            <span className={styles.img} onClick={onJump}>
              <Logo />
            </span>
          </div>
        )}

        {/* 编辑字段Modal */}
        {activeFieldId && activeFieldOperateType === FieldOperateType.FieldSetting && (
          <FieldSetting
            datasheetId={datasheetId}
            viewId={viewId}
            targetDOM={document.querySelector('.vikaFormContainer') as HTMLElement}
            showAdvancedFields={false}
          />
        )}

        {/* 编辑字段描述Modal */}
        {activeFieldId && activeFieldOperateType === FieldOperateType.FieldDesc && (
          <FieldDesc
            fieldId={activeFieldId}
            datasheetId={datasheetId}
            readOnly={!manageable}
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
                  hidden: ({ props }) => !props?.onEdit,
                  onClick: ({ props }) => props?.onEdit && props.onEdit(),
                },
                {
                  icon: <EditDescribeOutlined color={colors.thirdLevelText} />,
                  text: t(Strings.editing_field_desc),
                  onClick: ({ props }) => props?.onEditDesc && props.onEditDesc(),
                },
                {
                  icon: <ArrowUpOutlined color={colors.thirdLevelText} />,
                  text: t(Strings.insert_field_above),
                  disabled: ({ props }) => !props.onInsertAbove,
                  onClick: ({ props }) => props?.onInsertAbove && props.onInsertAbove(),
                },
                {
                  icon: <ArrowDownOutlined color={colors.thirdLevelText} />,
                  text: t(Strings.insert_field_below),
                  onClick: ({ props }) => props?.onInsertBelow && props.onInsertBelow(),
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
