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

import { useAtomValue } from 'jotai';
import * as React from 'react';
import { memo, MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createEditor, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import useSWR from 'swr';
import { Dropdown, IDropdownControl, IOverLayProps, Box } from '@apitable/components';

import {
  automationStateAtom
} from 'pc/components/automation/controller';
import { map2Text } from 'pc/components/robot/robot_detail/magic_variable_container/config';
import { fixImeInputBug } from 'pc/components/slate_editor/slate_editor';
import {
  getTriggerDatasheetId,
  useAutomationFieldInfo
} from '../../../automation/controller/hooks/use_robot_fields';
import { INodeOutputSchema, ITriggerType } from '../../interface';
import { IWidgetProps } from '../node_form/core/interface';
import { enrichDatasheetTriggerOutputSchema, formData2SlateValue, insertMagicVariable, transformSlateValue, withMagicVariable } from './helper';
import { MagicVariableContainer } from './magic_variable_container';
import { MagicVariableElement } from '.';
import styles from './styles.module.less';

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
  const [isOpen, setOpenState] = useState(false);
  const ref = useRef(null);
  const isOpenRef = useRef(false);

  const triggerControllRef = useRef<IDropdownControl|null>(null);

  const setOpen = useCallback((isOpen: boolean) => {

    setOpenState(isOpen);
    if(isOpen) {
      triggerControllRef?.current?.open();
    }else {
      triggerControllRef?.current?.close();
    }

  }, [setOpenState]);

  const editor = useMemo(() => withHistory(withMagicVariable(withReact(createEditor() as ReactEditor))), []);

  const state = useAtomValue(automationStateAtom);
  const slateValue = formData2SlateValue(props.value);
  const [value, setValue] = useState(slateValue);

  const refV: MutableRefObject<any> = useRef(null);

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
      if (event.key === '/') {
        Transforms.insertText(editor, '/');
        event.preventDefault();
        setOpen(true);
        return true;
      }
      return false;
    },
    [editor, setOpen],
  );

  const handleEditorChange = (value: any) => {
    refV.current = value;
    setValue(value);
  };

  // const activeDatasheetId = useAppSelector(Selectors.getActiveDatasheetId);

  const triggers = state?.robot?.triggers ?? [];
  const { data: dataList } = useSWR(['getTriggersRelatedDatasheetId', triggers], () => getTriggerDatasheetId(triggers), {
  });

  const dataLis = dataList ?? [];

  const l = useAutomationFieldInfo(triggers, dataLis);

  const nodeOutputSchemaList = props.nodeOutputSchemaList.map((nodeOutputSchema, index) => {
    const item = l[index];

    if (nodeOutputSchema?.id.startsWith('atr') && item && item?.fields?.length && item.fieldPermissionMap) {
      return enrichDatasheetTriggerOutputSchema(nodeOutputSchema, item.fields, item.fieldPermissionMap!);
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

        <Dropdown
          clazz={{
            overlay: styles.overlayStyle,
          }}
          ref={triggerControllRef}
          options={{
            offset: 12,
            arrow: false,
            disableClick: true,
            autoWidth: true,
            placement: 'bottom-end',
            stopPropagation: true,
          }}
          onVisibleChange={(visible) => {
            setOpenState(visible);
          }}
          trigger={
            <Box width={'100%'} display={'block'}>
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
              />
            </Box>
          }
        >
          {({ toggle }: IOverLayProps) => {
            return (
              <MagicVariableContainer
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
                  toggle();
                }}
              />
            );
          }}
        </Dropdown>
      </div>
    </Slate>
  );
});
