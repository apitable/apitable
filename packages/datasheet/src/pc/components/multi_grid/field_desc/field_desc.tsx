import { useClickOutside } from '@huse/click-outside';
import { CollaCommandName, Selectors, StoreActions, Strings, t } from '@apitable/core';
import { Input } from 'antd';
import classNames from 'classnames';
import { store } from 'pc/store';
import * as React from 'react';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { resourceService } from '../../../resource_service';
import { useFieldOperate } from '../hooks';
import styles from './styles.module.less';

const { TextArea } = Input;

const FIELD_DESC_WIDTH = 400;
export const FIELD_DESC_LENGTH = 1000;

interface IFieldDescProps {
  fieldId: string;
  readOnly: boolean;
  datasheetId: string;
  style?: React.CSSProperties;
  targetDOM?: HTMLElement | null; // 自定义FieldSetting挂载DOM节点，默认为数表
}

export interface IFieldDescRef {
  save(): void;
}
export const FieldDescBase: React.ForwardRefRenderFunction<IFieldDescRef, IFieldDescProps> = (props, ref) => {
  const { fieldId, readOnly, style, datasheetId, targetDOM } = props;
  const fieldMap = useSelector(state => Selectors.getFieldMap(state, datasheetId))!;
  const field = fieldMap[fieldId];
  const positionStyle = useFieldOperate(FIELD_DESC_WIDTH, datasheetId, targetDOM);
  const [fieldDesc, setFieldDesc] = useState(field.desc ? field.desc : '');
  const [textLen, setTextLen] = useState(field.desc ? field.desc.length : 0);
  const [overLimit, setOverLimit] = useState(false);
  const baseRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const staticRef = useRef({ mouseDown: false });

  useImperativeHandle(ref, (): IFieldDescRef => (
    {
      save() {
        onBlur();
      },
    }
  ));

  useClickOutside(baseRef, () => {
    onBlur();
    if (staticRef.current.mouseDown) {
      staticRef.current.mouseDown = false;
      return;
    }
    dispatch(StoreActions.clearActiveFieldState(datasheetId));
  });

  function inputText(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    setTextLen(value.length);
    if (value.length > FIELD_DESC_LENGTH) {
      setOverLimit(true);
      return;
    }
    setOverLimit(false);
    setFieldDesc(value);
  }

  function onBlur() {
    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.SetFieldAttr,
      fieldId,
      data: {
        ...field,
        desc: fieldDesc,
      },
      datasheetId,
    });
  }

  const onMouseDown = () => {
    staticRef.current.mouseDown = true;
  };

  const onMouseUp = () => {
    staticRef.current.mouseDown = false;
  };

  return (
    <div
      className={styles.fieldDesc}
      style={{
        ...positionStyle,
        ...style,
        width: FIELD_DESC_WIDTH,
      }}
      ref={baseRef}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <p className={styles.h3}>
        {
          t(Strings.field_desc)
        }
      </p>
      <TextArea
        autoSize={!overLimit}
        className={
          classNames({
            [styles.textarea]: true,
            error: overLimit,
          })
        }
        placeholder={
          t(Strings.editing_field_desc)
        }
        defaultValue={fieldDesc}
        onChange={inputText}
        disabled={readOnly}
      />
      <p
        className={
          classNames({
            [styles.count]: true,
            [styles.error]: overLimit,
          })
        }
      >
        {textLen}/{FIELD_DESC_LENGTH}
      </p>
    </div>
  );
};

export const FieldDesc = forwardRef(FieldDescBase);

export const expandFieldDescEditor = (props: IFieldDescProps) => {
  const targetDOM = props.targetDOM;

  const div = document.createElement('div');

  if (targetDOM) {
    targetDOM.appendChild(div);
  } else {
    document.body.appendChild(div);
  }

  const onClose = () => {
    ReactDOM.unmountComponentAtNode(div);
    if (div && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  };

  ReactDOM.render(
    <Provider store={store}>
      <div
        className={styles.mask}
        onClick={onClose}
      />
      <FieldDesc {...props}/>
    </Provider>
    ,
    div,
  );
};
