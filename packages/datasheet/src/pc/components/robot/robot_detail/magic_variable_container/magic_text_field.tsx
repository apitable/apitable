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

import { useClickAway } from 'ahooks';
import RcTrigger from 'rc-trigger';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { createEditor, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import { Selectors } from '@apitable/core';
import { map2Text } from 'pc/components/robot/robot_detail/magic_variable_container/config';
import { fixImeInputBug } from 'pc/components/slate_editor/slate_editor';
import { MagicVariableElement } from '.';
import { useAllFields } from '../../hooks';
import { INodeOutputSchema, ITriggerType } from '../../interface';
import { IWidgetProps } from '../node_form/core/interface';
// import { getSchemaType } from '../node_form/core/utils';
import { enrichDatasheetTriggerOutputSchema, formData2SlateValue, insertMagicVariable, transformSlateValue, withMagicVariable } from './helper';
import { MagicVariableContainer } from './magic_variable_container';
import styles from './styles.module.less';

const DefaultElement = (props: any) => {
  return <p {...props.attributes}>{props.children}</p>;
};

type IMagicTextFieldProps = IWidgetProps & {
  nodeOutputSchemaList: INodeOutputSchema[];
  // addMagicVariableKey: (key: string) => void;
  value: any;
  onChange?: (value: any) => void;
  isOneLine?: boolean;
  triggerType: ITriggerType | null;
};

export const MagicTextField = (props: IMagicTextFieldProps) => {
  const { onChange, schema, nodeOutputSchemaList: originalNodeOutputSchemaList } = props;
  const isJSONField = (schema as any)?.format === 'json';
  const [isOpen, setOpen] = useState(false);
  const ref = useRef(null);
  const inputRef = useRef<any>();
  const triggerRef = useRef<any>(null);
  const popupRef = useRef<any>(null);
  const triggerId = originalNodeOutputSchemaList?.[0]?.id;

  const editor = useMemo(() => withHistory(withMagicVariable(withReact(createEditor() as ReactEditor), triggerId)), []);

  const slateValue = formData2SlateValue(props.value);
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

  const updateFormValue = useCallback(
    (value: any) => {
      // console.log('1.Form input SlateValue', value);
      const { value: transformedValue } = transformSlateValue(value);
      // console.log('2.Form input TransformSlateValue', transformedValue, isMagicVariable);
      onChange && onChange(transformedValue);
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (event: any) => {
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
    },
    [setOpen, editor],
  );

  const handleEditorChange = (value: any) => {
    setValue(value);
  };

  const datasheetId = useSelector(Selectors.getActiveDatasheetId)!;
  const fieldPermissionMap = useSelector((state) => {
    return Selectors.getFieldPermissionMap(state, datasheetId);
  });
  const fields = useAllFields();
  // Two triggers take dynamic parameters to mask five fields when the form is submitted and when the record is created
  // const disable5Fields = ['form_submitted', 'record_created'].includes(triggerType?.endpoint!);
  const nodeOutputSchemaList = props.nodeOutputSchemaList.map((nodeOutputSchema, index) => {
    // The first one is the trigger, and for now only the fields of the trigger will be enhanced
    if (index === 0) {
      return enrichDatasheetTriggerOutputSchema(nodeOutputSchema, fields, fieldPermissionMap!);
    }
    return nodeOutputSchema;
  });

  const renderElement = (props: any) => {
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
    <Slate editor={editor} value={value as any} onChange={handleEditorChange}>
      <div
        className={styles.magicVariableBox}
        ref={ref}
        onKeyDown={(e) => {
          // Block avoiding form submissions
          if (e.key === 'Enter' && isOpen) {
            e.preventDefault();
          }
        }}
      >
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
              if (!isOpen) {
                updateFormValue(value);
              }
            }}
            renderElement={renderElement}
            onKeyDown={handleKeyDown}
            placeholder={map2Text[placeholderKey]}
            onCompositionEnd={handleCompositionEnd}
            // placeholder={t(Strings.robot_enter_request_address_placeholder)}
          />
        </RcTrigger>
      </div>
    </Slate>
  );
};
