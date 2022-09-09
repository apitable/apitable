import { Button, Checkbox, TextButton, useListenVisualHeight, useThemeColors } from '@vikadata/components';
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
} from '@vikadata/core';
import { useKeyPress } from 'ahooks';
import { Input } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { ContextName, ShortcutContext } from 'pc/common/shortcut_key';
import { Message } from 'pc/components/common/message';
import { Modal } from 'pc/components/common/modal/modal';
import { Tooltip } from 'pc/components/common/tooltip';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Divider } from 'pc/components/common/divider';
import { Popup } from 'pc/components/common/mobile/popup';
import { notify } from 'pc/components/common/notify';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import { EXPAND_RECORD_CLS } from 'pc/components/expand_record/expand_record_modal';
import { useResponsive } from 'pc/hooks';
import { usePlatform } from 'pc/hooks/use_platform';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { ButtonOperateType, getParentNodeByClass, isTouchDevice } from 'pc/utils';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import HelpIcon from 'static/icon/common/common_icon_information.svg';
import { stopPropagation } from '../../../utils/dom';
import { FieldFormat } from '../format';
import { useFieldOperate } from '../hooks';
import { checkFactory, CheckFieldSettingBase } from './check_factory';
import { FieldTypeSelect } from './field_type_select';
import styles from './styles.module.less';

export const OPERATE_WIDTH = parseInt(styles.fieldSettingBoxWidth, 10); // 操作框的宽度
// const EXCEPT_SCROLL_HEIGHT = 85; // 需要滚动区域之外，底部不可滚动部分的高度
// const STAT_HEIGHT = 40; // 底部统计栏的高度

const { TextArea: TextAreaComponent } = Input;

interface IScrollToItem {
  align?: 'auto' | 'smart' | 'center' | 'end' | 'start';
  rowIndex?: number;
  columnIndex?: number;
}

interface IFieldSettingProps {
  scrollToItem?: (props: IScrollToItem) => void;
  onClose?(): void;
  datasheetId?: string; // 神奇表单中新增列时pageParams拿不到datasheetId
  viewId?: string; // 神奇表单中新增列时pageParams拿不到viewId
  targetDOM?: HTMLElement | null; // 自定义FieldSetting挂载DOM节点，默认为数表
  showAdvancedFields?: boolean;
}

const MIN_HEIGHT = 120;
const MAX_HEIGHT = 640;

/**
 * 除了DomGrid会唤起外，神奇表单和展开Modal均复用该组件
 */
export const FieldSettingBase: React.FC<IFieldSettingProps> = props => {
  const colors = useThemeColors();
  const { scrollToItem, datasheetId: propDatasheetId, viewId: propViewId, targetDOM, showAdvancedFields = true } = props;
  const dispatch = useDispatch();
  const { visibleColumnsCount, columns, columnCount, snapshot, activeFieldState, viewId, linkId, datasheetId } = useSelector(state => {
    const columnCount = Selectors.getColumnCount(state)!;
    const datasheetId = propDatasheetId || Selectors.getActiveDatasheetId(state)!;
    const snapshot = Selectors.getSnapshot(state, datasheetId)!;
    const activeFieldState = Selectors.gridViewActiveFieldState(state, datasheetId);
    const viewId = propViewId || state.pageParams.viewId;
    const linkId = Selectors.getLinkId(state);
    const visibleColumns = Selectors.getVisibleColumns(state);
    const view = Selectors.getCurrentView(state, datasheetId)!;
    return {
      visibleColumnsCount: visibleColumns?.length || 0,
      columns: view.columns,
      columnCount,
      snapshot,
      activeFieldState,
      viewId,
      linkId,
      datasheetId,
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
  const renameRef = useRef<TextArea | null>(null);
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
        // 屏蔽可滚动样式
        ele.style.display = 'none';
        return;
      }
      // 展示可滚动样式
      if (ele.style.display === 'block') {
        return;
      }
      ele.style.display = 'block';
    },
  });

  const hideOperateBox = useCallback(
    () => {
      dispatch(StoreActions.clearActiveFieldState(datasheetId));
      props.onClose?.();
    },
    // eslint-disable-next-line
    [dispatch, datasheetId],
  );

  useEffect(() => {
    if (activeFieldState.fieldId === ButtonOperateType.AddField) {
      return;
    }
    if (!columns) return; // 从神奇表单或展开Modal唤起没有visibleColumns
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
      // 新增字段，不再默认填充一个字段名称
      name: '',
      type: FieldType.Text,
      property: getFieldClass(FieldType.Text).defaultProperty(),
    } as IField);
  const [currentField, setCurrentField] = useState(fieldInfoForState);
  const [baseErrMsg, setBaseErrMsg] = useState('');
  const [optionErrMsg, setOptionErrMsg] = useState('');

  const { hasOptSetting } = FieldTypeDescriptionMap[currentField.type];
  const commandManager = resourceService.instance!.commandManager;

  const isComputedField = Field.bindModel(currentField).isComputed;

  useEffect(() => {
    if (isTouchDevice()) {
      return;
    }
    const textAreaDOM = renameRef.current?.resizableTextArea.textArea;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFieldState.fieldId]);

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
      const hasTheSameName = Object.keys(fieldMap).some(fieldId => {
        const item = fieldMap[fieldId];
        return item.name === value && pre.id !== item.id;
      });
      setBaseErrMsg(hasTheSameName ? t(Strings.is_repeat_column_name) : '');
      return newField;
    });
  };

  // 判断当前的列是否存在有数据的cell
  const hasFieldValue = () => {
    if (fieldInfoForState.type === currentField.type) {
      return false;
    }

    const currentFieldId = currentField.id;
    const recordList = Object.values(recordMap);

    return recordList.some(item => {
      return item.data[currentFieldId];
    });
  };

  const modifyFieldType = (newField: IField) => {
    const result = commandManager.execute({
      cmd: CollaCommandName.SetFieldAttr,
      fieldId: currentField.id,
      data: {
        ...newField,
      },
      datasheetId,
    });

    // 如果指定了挂载的dom，则不提示
    if (ExecuteResult.Success === result.result && !targetDOM) {
      notify.open({
        message: t(Strings.toast_field_configuration_success),
        key: NotifyKey.ChangeFieldSetting,
      });
    }
    hideOperateBox();
  };

  const handleFieldRequiredChange = required => {
    setCurrentField((curField: IField) => {
      return { ...curField, required };
    });
  };

  function addField(newField: IField, colIndex?: number) {
    const result = commandManager.execute({
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
      // 如果指定了挂载的dom，则不提示
      if (!targetDOM) {
        notify.open({
          message: t(Strings.toast_add_field_success),
          key: NotifyKey.AddField,
        });
      }

      hideOperateBox();

      setTimeout(() => {
        scrollToItem &&
          scrollToItem({
            columnIndex: visibleColumnsCount,
          });
      }, 0);
    }
  }

  function renderModal(errMsg: string) {
    Modal.confirm({
      title: t(Strings.operate_info),
      content: errMsg,
      okText: t(Strings.submit),
      cancelText: t(Strings.give_up_edit),
      onCancel: hideOperateBox,
    });
  }

  // 如果转换的结果是成员字段，扫描数据，加载新的成员信息
  const checkMemberField = async(checkResult: IField) => {
    if (checkResult.type === FieldType.Member) {
      const cellValues = DatasheetActions.getCellValuesByFieldId(store.getState(), snapshot, checkResult.id);
      const stdVals = cellValues
        .map(cv => {
          return Field.bindModel(field).cellValueToStdValue(cv as ISegment[]);
        })
        .map(item => item.data[0] && item.data[0].text)
        .filter(item => item);

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

    if (typeof checkResult === 'string') {
      setOptionErrMsg(checkResult);
      isModal && renderModal(checkResult);
      return;
    }

    if (activeFieldState.fieldId === ButtonOperateType.AddField) {
      // 外部传入datasheetId表示非数表中挂载FieldSetting, 使用activeFieldState的列index
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
      {hasOptSetting && <Divider />}
      <FieldFormat
        from={activeFieldState.from}
        currentField={currentField}
        setCurrentField={setCurrentField}
        hideOperateBox={hideOperateBox}
        datasheetId={propDatasheetId}
      />
      {optionErrMsg && <section className={styles.error}>{optionErrMsg}</section>}

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
                <HelpIcon fill="currentColor" />
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
          onMouseDown={e => e.nativeEvent.stopImmediatePropagation()}
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
              color="primary"
            >
              {t(Strings.submit)}
            </Button>
          </section>
        </div>
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <Popup
          visible
          onClose={hideOperateBox}
          height="90%"
          title={t(Strings.choose_type_of_vika_field)}
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
