import { useClickAway } from 'ahooks';
import { Selectors, t, Strings } from '@apitable/core';
import RcTrigger from 'rc-trigger';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { createEditor, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import { MagicVariableElement } from '.';
import { useAllFields } from '../../hooks';
import { INodeOutputSchema, ITriggerType } from '../../interface';
import { IWidgetProps } from '../node_form/core/interface';
// import { getSchemaType } from '../node_form/core/utils';
import {
  enrichDatasheetTriggerOutputSchema,
  formData2SlateValue,
  insertMagicVariable, transformSlateValue, withMagicVariable
} from './helper';
import { MagicVariableContainer } from './magic_variable_container';
import styles from './styles.module.less';
import { fixImeInputBug } from 'pc/components/slate_editor/slate_editor';

const DefaultElement = props => {
  return <p {...props.attributes}>{props.children}</p>;
};

const map2Text = {
  url: t(Strings.robot_enter_request_address_placeholder),
  key: t(Strings.robot_enter_key_placeholder),
  value: t(Strings.robot_enter_value_placeholder),
  data: t(Strings.robot_enter_body_text_placeholder),
  webhookUrl: t(Strings.robot_enter_webhook_placeholder),
  content: t(Strings.robot_enter_message_content_placeholder)
};

type IMagicTextFieldProps = IWidgetProps & {
  nodeOutputSchemaList: INodeOutputSchema[];
  // addMagicVariableKey: (key: string) => void;
  value: any;
  onChange?: (value: any) => void;
  isOneLine?: boolean;
  triggerType: ITriggerType | null;
};

// 神奇变量编辑器内部维护状态，当失焦点的时候，同步只给上级表单。
export const MagicTextField = (props: IMagicTextFieldProps) => {
  const { onChange, schema } = props;
  // console.log(props.rawErrors);
  // const fieldType = getSchemaType(props.schema);
  // console.log('MagicTextField.fieldType', fieldType);
  // console.log('MagicTextField.props.value', props.value);
  const isJSONField = (schema as any)?.format === 'json';
  const [isOpen, setOpen] = useState(false);
  const ref = useRef(null);
  const inputRef = useRef<any>();
  const triggerRef = useRef<any>(null);
  const popupRef = useRef<any>(null);
  const editor = useMemo(() => withHistory(withMagicVariable(withReact(createEditor() as ReactEditor))), []);
  // console.log('3.Form input init value', props.value);
  const slateValue = formData2SlateValue(props.value);
  // console.log('4.Form input slate value', slateValue);
  const [value, setValue] = useState(slateValue);

  useClickAway(() => {
    setOpen(false);
  }, popupRef);

  useEffect(() => {
    if (!isOpen) {
      const { lastSelection } = editor as any;
      if (lastSelection) {
        Transforms.select(editor, lastSelection);
        ReactEditor.focus(editor);
      }
    }
  }, [isOpen, editor]);

  const updateFormValue = useCallback((value) => {
    // console.log('1.Form input SlateValue', value);
    const { value: transformedValue } = transformSlateValue(value);
    // console.log('2.Form input TransformSlateValue', transformedValue, isMagicVariable);
    onChange && onChange(transformedValue);
  }, [onChange]);

  const handleKeyDown = useCallback((event) => {
    inputRef.current && clearTimeout(inputRef.current);
    if (event.key === '/') {
      Transforms.insertText(editor, '/');
      event.preventDefault();
      inputRef.current = setTimeout(() => {
        setOpen(true);
      }, 300);
      return true;
    }
    return false;
  }, [setOpen, editor]);

  const handleEditorChange = (value) => {
    setValue(value);
  };

  const datasheetId = useSelector(Selectors.getActiveDatasheetId)!;
  const fieldPermissionMap = useSelector(state => {
    return Selectors.getFieldPermissionMap(state, datasheetId);
  });
  const fields = useAllFields();
  // 当表单提交时、当记录创建时两个 trigger 取动态参数屏蔽五个字段
  // const disable5Fields = ['form_submitted', 'record_created'].includes(triggerType?.endpoint!);
  const nodeOutputSchemaList = props.nodeOutputSchemaList.map((nodeOutputSchema, index) => {
    // 第一个是 trigger，暂时只增强 trigger 的 fields
    if (index === 0) {
      return enrichDatasheetTriggerOutputSchema(nodeOutputSchema, fields, fieldPermissionMap!);
    }
    return nodeOutputSchema;
  });

  const renderElement = (props) => {
    switch (props.element.type) {
      case 'magicVariable':
        return <MagicVariableElement {...props} nodeOutputSchemaList={nodeOutputSchemaList} />;
      default:
        return <DefaultElement {...props} />;
    }
  };

  const ids = props.id.split('_');
  const placeholderKey = ids[ids.length - 1];

  const handleCompositionEnd = (event: React.CompositionEvent<HTMLDivElement>) => {
    return fixImeInputBug(event, editor);
  };

  return (
    <Slate
      editor={editor}
      value={value as any}
      onChange={handleEditorChange}
    >
      <div className={styles.magicVariableBox} ref={ref} onKeyDown={e => {
        // 阻止避免表单提交
        if (e.key === 'Enter' && isOpen) {
          e.preventDefault();
        }
      }}>
        {/* <span onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}>
          <IconButton
            icon={AddOutlined}
          />
        </span> */}
        <RcTrigger
          ref={triggerRef}
          getPopupContainer={() => ref.current!}
          popupAlign={{
            points: ['tl', 'bl'],
            offset: [-4, 8],
            overflow: { adjustX: true, adjustY: true },
          }}
          popupStyle={{ width: '100%' }}
          popup={
            <MagicVariableContainer
              ref={popupRef}
              isJSONField={isJSONField}
              insertMagicVariable={(data) => {
                insertMagicVariable(data, editor);
                setOpen(false);
              }}
              nodeOutputSchemaList={nodeOutputSchemaList}
              setOpen={setOpen}
            />
          }
          popupVisible={isOpen}
          autoDestroy
          destroyPopupOnHide
        >
          <Editable
            className={styles.editor}
            onBlur={() => {
              // 在面板没打开的情况下，才同步
              if (!isOpen) {
                updateFormValue(value);
              }
            }}
            renderElement={renderElement}
            onKeyDown={handleKeyDown}
            placeholder={map2Text[placeholderKey]}
            onCompositionEnd={handleCompositionEnd}
          // placeholder={t(Strings.robot_enter_request_address_placeholder)}
          // placeholder="输入 / 添加神奇变量..."
          />
        </RcTrigger>
      </div>
    </Slate>
  );
};
