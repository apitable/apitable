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

import { useKeyPress } from 'ahooks';
import type { InputRef } from 'antd';
import { Input, message } from 'antd';
import produce from 'immer';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState, FC, PropsWithChildren } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { Button, Checkbox, TextButton, useListenVisualHeight, useThemeColors } from '@apitable/components';
import {
  CollaCommandName,
  DatasheetActions,
  Events,
  ExecuteResult,
  Field,
  FieldType,
  FieldTypeDescriptionMap,
  getFieldClass,
  getNewId,
  IDPrefix,
  IField,
  ISegment,
  IViewColumn,
  Player,
  Selectors,
  StoreActions,
  Strings,
  t,
  DatasheetApi,
} from '@apitable/core';
import { QuestionCircleOutlined, WarnCircleFilled } from '@apitable/icons';
import { ContextName, ShortcutContext } from 'modules/shared/shortcut_key';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Divider } from 'pc/components/common/divider';
import { Message } from 'pc/components/common/message';
import { Popup } from 'pc/components/common/mobile/popup';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { notify } from 'pc/components/common/notify';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common/tooltip';
import { EXPAND_RECORD_CLS } from 'pc/components/expand_record/expand_record_modal';
import { usePlatform } from 'pc/hooks/use_platform';
import { useResponsive } from 'pc/hooks/use_responsive';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { ButtonOperateType } from 'pc/utils/constant';
import { stopPropagation, getParentNodeByClass } from 'pc/utils/dom';
import { isTouchDevice } from 'pc/utils/mobile';
import { FieldFormat } from '../format/format';
import { useFieldOperate } from '../hooks';
import { checkFactory, CheckFieldSettingBase } from './check_factory';
import { FieldTypeSelect } from './field_type_select';
import styles from './styles.module.less';

export const OPERATE_WIDTH = parseInt(styles.fieldSettingBoxWidth, 10); // The width of the operation box
// const EXCEPT_SCROLL_HEIGHT = 85; // Height of the non-scrollable part at the bottom, outside the area to be scrolled
// const STAT_HEIGHT = 40; // Height of the bottom statistics column

const { TextArea: TextAreaComponent } = Input;

interface IScrollToItem {
  align?: 'auto' | 'smart' | 'center' | 'end' | 'start';
  rowIndex?: number;
  columnIndex?: number;
}

interface IFieldSettingProps {
  scrollToItem?: (props: IScrollToItem) => void;
  onClose?(): void;
  datasheetId?: string; // PageParams can't get datasheetId when adding columns in the form
  viewId?: string; // PageParams does not get the viewId when adding a new column in the form
  targetDOM?: HTMLElement | null; // Custom field setting mount DOM node, default is grid
  showAdvancedFields?: boolean;
}

const MIN_HEIGHT = 120;
const MAX_HEIGHT = 640;

/**
 * This component is reused by the Magic Form and Expand Modal, except for the DomGrid, which evokes it.
 */
const FieldSettingBase: FC<PropsWithChildren<IFieldSettingProps>> = (props) => {
  const colors = useThemeColors();
  const { scrollToItem, datasheetId: propDatasheetId, viewId: propViewId, targetDOM, showAdvancedFields = true } = props;
  const dispatch = useDispatch();
  const { visibleColumnsCount, columns, columnCount, snapshot, activeFieldState, viewId, linkId, datasheetId, spaceId } = useAppSelector((state) => {
    const columnCount = Selectors.getColumnCount(state)!;
    const datasheetId = propDatasheetId || Selectors.getActiveDatasheetId(state)!;
    const snapshot = Selectors.getSnapshot(state, datasheetId)!;
    const activeFieldState = Selectors.gridViewActiveFieldState(state, datasheetId);
    const viewId = propViewId || state.pageParams.viewId;
    const linkId = Selectors.getLinkId(state);
    const visibleColumns = Selectors.getVisibleColumns(state);
    const view = Selectors.getCurrentView(state, datasheetId)!;
    const spaceId = Selectors.activeSpaceId(state)!;
    return {
      visibleColumnsCount: visibleColumns?.length || 0,
      columns: view.columns,
      columnCount,
      snapshot,
      activeFieldState,
      viewId,
      linkId,
      datasheetId,
      spaceId,
    };
  }, shallowEqual);

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const fieldMap = snapshot.meta.fieldMap;
  const field = fieldMap[activeFieldState.fieldId];
  const recordMap = snapshot.recordMap;

  const positionStyle = useFieldOperate(OPERATE_WIDTH, propDatasheetId, targetDOM);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const renameRef = useRef<InputRef | null>(null);
  const scrollShadowRef = useRef<HTMLDivElement>(null);

  const { style, onListenResize } = useListenVisualHeight({
    listenNode: containerRef,
    childNode: wrapperRef,
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
    position: 'sticky',
    showOnParent: false,
    onScroll: ({ height, scrollHeight, scrollTop }) => {
      const ele = scrollShadowRef.current;
      if (!ele) return;
      if (scrollTop + height > scrollHeight - 10) {
        ele.style.display = 'none';
        return;
      }
      if (ele.style.display === 'block') {
        return;
      }
      ele.style.display = 'block';
    },
  });

  const [submitPending, setSubmitPending] = useState(false);

  const hideOperateBox = useCallback(
    () => {
      if (submitPending && field.type === FieldType.Cascader) {
        Message.warning({
          content: t(Strings.cascader_snapshot_updating),
        });
        return;
      }
      dispatch(StoreActions.clearActiveFieldState(datasheetId));
      props.onClose?.();
    },
    // eslint-disable-next-line
    [dispatch, datasheetId, submitPending],
  );

  useEffect(() => {
    if (activeFieldState.fieldId === ButtonOperateType.AddField) {
      return;
    }
    if (!columns) return; // Recall no visibleColumns from the magic form or expand Modal
    const _field = columns.find((item: IViewColumn) => item.fieldId === activeFieldState.fieldId);
    if (!_field) {
      Message.warning({
        content: t(Strings.current_column_been_deleted),
      });
      hideOperateBox();
    }
  }, [columns, hideOperateBox, activeFieldState.fieldId]);

  useEffect(() => {
    ShortcutContext.bind(ContextName.isMenuOpening, () => true);
    return () => {
      ShortcutContext.unbind(ContextName.isMenuOpening);
    };
  });

  useKeyPress('Esc', () => {
    hideOperateBox();
  });

  useEffect(() => {
    Player.doTrigger(Events.datasheet_field_setting_shown);
    return () => {
      Player.doTrigger(Events.datasheet_field_setting_hidden);
    };
  }, []);

  const fieldInfoForState = field
    ? field
    : ({
      id: getNewId(IDPrefix.Field),
      // New fields are added and no longer populated with a field name by default
      name: '',
      type: FieldType.Text,
      property: getFieldClass(FieldType.Text).defaultProperty(),
    } as IField);
  const [currentField, setCurrentField] = useState(fieldInfoForState);
  const [baseErrMsg, setBaseErrMsg] = useState('');
  const [optionErrMsg, setOptionErrMsg] = useState<string | object>('');

  const { hasOptSetting } = FieldTypeDescriptionMap[currentField.type];

  const isComputedField = Field.bindModel(currentField).isComputed;

  useEffect(() => {
    if (isTouchDevice()) {
      return;
    }

    const textAreaDOM = renameRef.current?.['resizableTextArea'].textArea;
    if (textAreaDOM) {
      textAreaDOM.focus();
      textAreaDOM.setSelectionRange(0, textAreaDOM.value.length);
    }
  }, []);

  // const reRenderHeight = useCallback(() => {
  //   const element = wrapperRef.current;
  //   if (!element) {
  //     return;
  //   }
  //   const { height, bottom } = element.getBoundingClientRect();
  //   const diff = bottom + EXCEPT_SCROLL_HEIGHT + STAT_HEIGHT - window.innerHeight;
  //   element.setAttribute('style', `max-height:${height - diff}px`);
  // }, []);

  const { mobile } = usePlatform();

  useEffect(() => {
    if (mobile) {
      return;
    }
    // reRenderHeight();
    // eslint-disable-next-line
  }, [currentField.type, currentField.property]);

  // useEffect(() => {
  //   if (mobile) {
  //     return;
  //   }
  //   window.addEventListener('resize', reRenderHeight);
  //   return () => {
  //     window.removeEventListener('resize', reRenderHeight);
  //   };
  // });

  useEffect(() => {
    setOptionErrMsg('');
  }, [currentField]);

  useEffect(() => {
    setCurrentField(fieldInfoForState);
    setOptionErrMsg('');
    setBaseErrMsg('');
    // eslint-disable-next-line
  }, [activeFieldState.fieldId]);

  const onChange = (e: React.ChangeEvent<any>) => {
    const value = e.target.value;
    if (value.length > 100 && value.length > currentField.name.length) {
      return;
    }

    setCurrentField((pre: IField) => {
      const newField = {
        ...pre,
        name: value,
      };
      const hasTheSameName = Object.keys(fieldMap).some((fieldId) => {
        const item = fieldMap[fieldId];
        return item.name === value && pre.id !== item.id;
      });
      setBaseErrMsg(hasTheSameName ? t(Strings.is_repeat_column_name) : '');
      return newField;
    });
  };

  // Determine if there is a cell with data in the current column
  const hasFieldValue = () => {
    if (fieldInfoForState.type === currentField.type) {
      return false;
    }

    const currentFieldId = currentField.id;
    const recordList = Object.values(recordMap);

    return recordList.some((item) => {
      return item.data[currentFieldId];
    });
  };

  const modifyFieldType = (newField: IField) => {
    const result = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.SetFieldAttr,
      fieldId: currentField.id,
      data: {
        ...newField,
      },
      datasheetId,
    });

    // If a mounted dom is specified, no prompt will be given
    if (ExecuteResult.Success === result.result && !targetDOM) {
      // cascader field linkedDatasheetId or linkedViewId changes need update cascader snapshot
      if (
        newField.type === FieldType.Cascader &&
        (fieldInfoForState.property?.linkedDatasheetId !== newField.property.linkedDatasheetId ||
          fieldInfoForState.property?.linkedViewId !== newField.property.linkedViewId)
      ) {
        setSubmitPending(true);
        DatasheetApi.updateCascaderSnapshot({
          spaceId,
          datasheetId,
          fieldId: newField.id,
          linkedDatasheetId: newField.property.linkedDatasheetId,
          linkedViewId: newField.property.linkedViewId,
        }).then(() => {
          setSubmitPending(false);
          notify.open({
            message: t(Strings.toast_field_configuration_success),
            key: NotifyKey.ChangeFieldSetting,
          });
          hideOperateBox();
          return;
        });
      } else {
        notify.open({
          message: t(Strings.toast_field_configuration_success),
          key: NotifyKey.ChangeFieldSetting,
        });
        hideOperateBox();
        return;
      }
    } else {
      hideOperateBox();
    }
  };

  const handleFieldRequiredChange = (required: boolean) => {
    setCurrentField((curField: IField) => {
      return { ...curField, required };
    });
  };

  const addField = (newField: IField, colIndex?: number) => {
    const result = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.AddFields,
      data: [
        {
          data: {
            ...newField,
          },
          viewId,
          index: typeof colIndex === 'number' ? colIndex : columnCount,
          hiddenColumn: activeFieldState.hiddenColumn,
        },
      ],
      datasheetId,
    });
    if (ExecuteResult.Success === result.result) {
      const resultCallback = () => {
        notify.open({
          message: t(Strings.toast_add_field_success),
          key: NotifyKey.AddField,
        });
        hideOperateBox();
        setTimeout(() => {
          scrollToItem &&
            scrollToItem({
              columnIndex: visibleColumnsCount,
            });
        }, 0);
      };
      // cascader field add need update cascader snapshot
      if (newField.type === FieldType.Cascader) {
        setSubmitPending(true);
        DatasheetApi.updateCascaderSnapshot({
          spaceId,
          datasheetId,
          fieldId: newField.id,
          linkedDatasheetId: newField.property.linkedDatasheetId,
          linkedViewId: newField.property.linkedViewId,
        }).then(() => {
          setSubmitPending(false);
          resultCallback();
        });
      } else {
        resultCallback();
      }
    }
  };

  function renderModal(errMsg: string) {
    Modal.confirm({
      title: t(Strings.operate_info),
      content: errMsg,
      okText: t(Strings.submit),
      cancelText: t(Strings.give_up_edit),
      onCancel: hideOperateBox,
    });
  }

  // If the result of the conversion is a member field, scan the data and load the new member information
  const checkMemberField = async (checkResult: IField) => {
    if (checkResult.type === FieldType.Member) {
      const cellValues = DatasheetActions.getCellValuesByFieldId(store.getState(), snapshot, checkResult.id);
      const stdVals = cellValues
        .map((cv) => {
          return Field.bindModel(field).cellValueToStdValue(cv as ISegment[]);
        })
        .map((item) => item.data[0] && item.data[0].text)
        .filter((item) => item);

      await dispatch(StoreActions.loadLackUnitMap(stdVals.join(','), linkId) as any);
    }
    modifyFieldType(checkResult);
  };

  const onSubmit = (isModal?: boolean) => {
    if (baseErrMsg.length) {
      isModal && renderModal(baseErrMsg);
      return;
    }

    const checkResult = checkFactory[currentField.type]
      ? checkFactory[currentField.type](currentField, propDatasheetId)
      : CheckFieldSettingBase.checkStream(currentField, propDatasheetId);

    if (typeof checkResult === 'string' || checkResult.errors) {
      setOptionErrMsg(checkResult);
      const _checkResult = checkResult.errors ? (Object.values(checkResult.errors)[0] as string) : checkResult;
      isModal && renderModal(_checkResult);

      if(!isModal && currentField.type === FieldType.Button) {
        message.error(_checkResult);
      }
      return;
    }

    if (activeFieldState.fieldId === ButtonOperateType.AddField) {
      // Passing datasheetId externally means that FieldSetting is mounted in a non-numbered table, using the activeFieldState column index.
      if (propDatasheetId) {
        addField(checkResult, activeFieldState?.fieldIndex);
      } else {
        addField(checkResult);
      }
    } else {
      if (hasFieldValue()) {
        Modal.confirm({
          title: t(Strings.confirm_change_field),
          content: t(Strings.convert_tip),
          okText: t(Strings.convert),
          onOk: () => {
            checkMemberField(checkResult);
          },
        });
        return;
      }
      return modifyFieldType(checkResult);
    }
  };

  useEffect(() => {
    if (isMobile) {
      return;
    }

    function closeAndSave(e: MouseEvent) {
      const modalRoot = getParentNodeByClass(e.target as HTMLElement, 'ant-modal-root');
      const isClickInExpandRecord = getParentNodeByClass(e.target as HTMLElement, EXPAND_RECORD_CLS);

      if (!modalRoot || isClickInExpandRecord) {
        onSubmit(true);
      }
    }

    document.addEventListener('mousedown', closeAndSave);
    return () => {
      document.removeEventListener('mousedown', closeAndSave);
    };
  });

  function onPressEnter(e: React.KeyboardEvent) {
    if (e.shiftKey) return;
    stopPropagation(e);
    onSubmit();
  }

  const MainComponent: React.ReactElement = (
    <>
      <section className={styles.section}>
        <div className={styles.sectionTitle}>{t(Strings.field_title)}</div>
        <div className={styles.renameWrapper}>
          <TextAreaComponent
            ref={renameRef}
            autoSize={{ maxRows: 2 }}
            className={styles.textarea}
            placeholder={t(Strings.edit_field_name)}
            onPressEnter={onPressEnter}
            value={currentField.name}
            onChange={onChange}
            maxLength={100}
          />
        </div>
        {baseErrMsg.length > 0 && <p className={styles.error}>{baseErrMsg}</p>}
      </section>
      <FieldTypeSelect
        snapshot={snapshot}
        activeFieldId={activeFieldState.fieldId}
        currentField={currentField}
        setCurrentField={setCurrentField}
        activeFieldIndex={activeFieldState.fieldIndex}
        datasheetId={propDatasheetId}
        isMobile={isMobile}
        showAdvancedFields={showAdvancedFields}
      />
      {isMobile && currentField.type === FieldType.Cascader ? (
        <div className={styles.cascaderMobileTip}>
          <WarnCircleFilled color={colors.textCommonTertiary} />
          {t(Strings.cascader_mobile_unavailable_tip)}
        </div>
      ) : (
        <>
          {hasOptSetting && <Divider />}
          <FieldFormat
            from={activeFieldState.from}
            currentField={currentField}
            onCreate={(field) => {
              const integractedItem: IField = produce(field, draft => {
                draft.property.action = field.property.action;
              });

              const checkResult : IField= checkFactory[currentField.type]
                ? checkFactory[currentField.type](integractedItem, propDatasheetId)
                : CheckFieldSettingBase.checkStream(integractedItem, propDatasheetId);

              // @ts-ignore
              if (typeof checkResult === 'string' || checkResult.errors) {
                setOptionErrMsg(checkResult);
                // @ts-ignore
                const _checkResult = checkResult.errors ? (Object.values(checkResult.errors)[0] as string) : checkResult;
                renderModal(_checkResult as string);
                return;
              }

              // Passing datasheetId externally means that FieldSetting is mounted in a non-numbered table, using the activeFieldState column index.
              if (propDatasheetId) {
                addField(checkResult, activeFieldState?.fieldIndex);
              } else {
                addField(checkResult);
              }
              return;
            }
            }
            onUpdate={(field) => {
              modifyFieldType(field);
            }
            }
            setCurrentField={setCurrentField}
            hideOperateBox={hideOperateBox}
            datasheetId={propDatasheetId}
            optionErrMsg={optionErrMsg as object}
          />
        </>
      )}
      {typeof optionErrMsg === 'string' && <section className={styles.error}>{optionErrMsg}</section>}

      {!isComputedField && (
        <>
          <Divider />
          <div className={styles.requiredBox}>
            <Checkbox size={14} checked={currentField.required} onChange={handleFieldRequiredChange}>
              {t(Strings.set_field_required)}
            </Checkbox>
            <Tooltip
              title={
                <span>
                  {t(Strings.set_field_required_tip_title)}
                  <br />
                  {t(Strings.set_field_required_tip_1)}
                  <br />
                  {t(Strings.set_field_required_tip_2)}
                </span>
              }
            >
              <span className={styles.requiredTip}>
                <QuestionCircleOutlined color="currentColor" />
              </span>
            </Tooltip>
          </div>
        </>
      )}
    </>
  );

  useEffect(() => {
    onListenResize();
  }, [currentField, onListenResize]);

  return (
    <>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <div
          className={styles.fieldOperateBox}
          style={positionStyle}
          onMouseDown={(e) => e.nativeEvent.stopImmediatePropagation()}
          tabIndex={-1}
          onKeyDown={stopPropagation}
          ref={containerRef}
        >
          <div style={style} ref={wrapperRef} className={styles.scrollWrapper}>
            {MainComponent}
          </div>
          <div ref={scrollShadowRef} className={styles.scrollShadow} />
          <section className={styles.buttonWrapper}>
            <TextButton size="small" onClick={hideOperateBox} style={{ color: colors.thirdLevelText }}>
              {t(Strings.cancel)}
            </TextButton>
            <Button
              size="small"
              onClick={() => {
                onSubmit();
              }}
              loading={submitPending}
              color="primary"
            >
              {t(Strings.submit)}
            </Button>
          </section>
        </div>
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <Popup
          open
          onClose={hideOperateBox}
          height="90%"
          title={t(Strings.datasheet_choose_field_type)}
          footer={
            <Button color="primary" size="large" block onClick={() => onSubmit()}>
              {t(Strings.confirm)}
            </Button>
          }
        >
          <div className={styles.content}>{MainComponent}</div>
        </Popup>
      </ComponentDisplay>
    </>
  );
};

export const FieldSetting = React.memo(FieldSettingBase);
