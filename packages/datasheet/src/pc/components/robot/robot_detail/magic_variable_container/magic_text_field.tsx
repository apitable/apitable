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

import { useClickOutside } from '@huse/click-outside';
import { useAtomValue } from 'jotai/index';
import RcTrigger from 'rc-trigger';
import * as React from 'react';
import { memo, MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createEditor, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import { map2Text } from 'pc/components/robot/robot_detail/magic_variable_container/config';
import { fixImeInputBug } from 'pc/components/slate_editor/slate_editor';
import { useAutomationRobotFields, useTriggerDatasheetId } from '../../../automation/controller/hooks/use_robot_fields';
import { INodeOutputSchema, ITriggerType } from '../../interface';
import { IWidgetProps } from '../node_form/core/interface';
import { enrichDatasheetTriggerOutputSchema, formData2SlateValue, insertMagicVariable, transformSlateValue, withMagicVariable } from './helper';
import { MagicVariableContainer } from './magic_variable_container';
import styles from './styles.module.less';
import { MagicVariableElement } from '.';

const DefaultElement = (props: any) => {
  return <p {...props.attributes}>{props.children}</p>;
};

type IMagicTextFieldProps = IWidgetProps & {
  nodeOutputSchemaList: INodeOutputSchema[];
  value: any;
  onChange?: (value: any) => void;
  isOneLine?: boolean;
  triggerType: ITriggerType | null;
};

export const MagicTextField = memo((props: IMagicTextFieldProps) => {
  const { onChange, schema } = props;
  const isJSONField = (schema as any)?.format === 'json';
  const [isOpen, setOpen] = useState(false);
  const ref = useRef(null);
  const isOpenRef = useRef(false);
  const inputRef = useRef<any>();
  const triggerRef = useRef<any>(null);
  const popupRef = useRef<any>(null);
  const datasheetId = useTriggerDatasheetId();

  const editor = useMemo(() => withHistory(withMagicVariable(withReact(createEditor() as ReactEditor))), []);

  const slateValue = formData2SlateValue(props.value);
  const [value, setValue] = useState(slateValue);

  const refV: MutableRefObject<any> = useRef(null);
  useClickOutside(popupRef, () => {

    isOpenRef.current=false;
    setOpen(false);
  });

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
      if(isOpenRef.current) {
        return;
      }
      const { value: transformedValue } = transformSlateValue(value);
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
        isOpenRef.current=true;
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
    refV.current = value;
    setValue(value);
  };

  const { fields, fieldPermissionMap } = useAutomationRobotFields(datasheetId!);

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

  // @ts-ignore
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
                setOpen(false);
                insertMagicVariable(data, editor, () => {
                  setTimeout(() => {
                    const { value: transformedValue } = transformSlateValue(refV.current);
                    onChange && onChange(transformedValue);
                  }, 20);
                });
              }}
              nodeOutputSchemaList={nodeOutputSchemaList}
              setOpen={(isOpen) => {
                isOpenRef.current=isOpen;
                setOpen(isOpen);
              }}
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
});
