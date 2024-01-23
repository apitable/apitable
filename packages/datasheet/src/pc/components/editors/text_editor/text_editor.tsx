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

import classNames from 'classnames';
import RcTextArea from 'rc-textarea';
import { ChangeEvent, forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from 'react';
import * as React from 'react';
import { FieldType, getTextFieldType, ISegment, string2Segment, Strings, t } from '@apitable/core';
import { ContextName, ShortcutContext } from 'modules/shared/shortcut_key';
import { CellText } from 'pc/components/multi_grid/cell/cell_text';
import { stopPropagation } from 'pc/utils/dom';
import { IBaseEditorProps, IEditor } from '../interface';
import styles from './style.module.less';

export interface ITextEditorProps extends IBaseEditorProps {
  placeholder?: string;
  style: React.CSSProperties;
  editable: boolean;
  editing: boolean;
  minRows?: number;
  needEditorTip?: boolean;
  onBlur?: (...args: any) => void;
}

const TEXT_LINE_HEIGHT = 31;

const TextEditorBase: React.ForwardRefRenderFunction<IEditor, ITextEditorProps> = (props, ref) => {
  const { editing, placeholder, editable, disabled, style, minRows, height, needEditorTip = true, onSave, onChange, onBlur } = props;
  const [value, setValue] = useState('');
  const [cellValue, setCellValue] = useState<ISegment[] | null>(null);
  const rcTextAreaRef = useRef<RcTextArea>(null);
  const enhanceEditorRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { isEnhanceText, isSingleText } = getTextFieldType(props.field.type);
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const isInExpandRecord = ShortcutContext.context[ContextName.isRecordExpanding]();

  useImperativeHandle(
    ref,
    (): IEditor => ({
      focus: (preventScroll?: boolean) => {
        focus(preventScroll);
      },
      blur: () => {
        blur();
      },
      onEndEdit: (cancel: boolean) => {
        onEndEdit(cancel);
      },
      onStartEdit: (value?: ISegment[] | null) => {
        onStartEdit(value);
      },
      setValue: (value?: ISegment[] | null) => {
        handleSetValue(value ?? null);
      },
      saveValue: () => {
        saveValue();
      },
    }),
  );

  useEffect(() => {
    if (!rcTextAreaRef.current) {
      return;
    }
    textAreaRef.current = rcTextAreaRef.current.resizableTextArea.textArea;
  });

  const segment2String = (value: ISegment[] | null): string => {
    if (!value) {
      return '';
    }
    return value.reduce((pre, cur) => pre + cur.text, '');
  };

  const setEditorValue = (value: ISegment[] | null) => {
    setValue(segment2String(value));
  };

  const focus = (preventScroll?: boolean) => {
    textAreaRef.current && textAreaRef.current.focus({ preventScroll: preventScroll });
    enhanceEditorRef.current && enhanceEditorRef.current.focus({ preventScroll: preventScroll });
  };

  const blur = () => {
    textAreaRef.current && textAreaRef.current.blur();
    enhanceEditorRef.current && enhanceEditorRef.current.blur();
  };

  const updateValue = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const value = event.target.value;
    if (editing) {
      setValue(value);
    }
    onChange && onChange(getValidValue(value));
  };

  const onEndEdit = (cancel: boolean) => {
    if (!cancel) {
      saveValue();
    }
    setEditorValue(null);
  };

  const getValidValue = (originValue: string) => {
    let segment: ISegment[] = [];
    switch (props.field.type) {
      case FieldType.URL:
      case FieldType.Email:
      case FieldType.Phone:
        segment = string2Segment(originValue?.trim());
        break;
      case FieldType.SingleText:
      case FieldType.Text:
      default:
        segment = string2Segment(originValue);
        break;
    }
    return originValue.length ? segment : null;
  };

  const saveValue = () => {
    onSave && onSave(getValidValue(value));
  };

  const setSelectionToEnd = () => {
    const element = textAreaRef.current || enhanceEditorRef.current;
    if (!element) {
      return;
    }
    if (isEnhanceText || isSingleText) {
      element.scrollLeft = element.scrollWidth;
      return;
    }
    element.scrollTop = element.scrollHeight;
  };

  const handleSetValue = (value: ISegment[] | null) => {
    setEditorValue(value);
    setCellValue(value);
  };

  const onStartEdit = (value?: ISegment[] | null) => {
    if (value === undefined) {
      return;
    }
    setEditorValue(value);
    setCellValue(value);
    setTimeout(() => {
      setSelectionToEnd();
    }, 20);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const wrapMetaCode = event.ctrlKey || event.altKey;
    const isWrapKeyCombination = wrapMetaCode && event.keyCode === 13;

    if (!(editing && isWrapKeyCombination)) {
      return;
    }

    // execCommand docRef: https://momane.com/use-document-execcommand-to-set-value
    document.execCommand('insertText', false, '\n');

    textAreaRef.current?.blur();
    setTimeout(() => {
      textAreaRef.current?.focus();
    }, 0);
  };

  const autoSize = isInExpandRecord ? { minRows } : { minRows: Math.round(height / TEXT_LINE_HEIGHT), maxRows: 7 };

  const isMultiText = props.field.type === FieldType.Text;

  return (
    <div
      ref={wrapperRef}
      className={classNames(styles.textEditor, isMultiText && 'multiText')}
      style={{ ...style }}
      onWheel={stopPropagation}
      onMouseMove={stopPropagation}
    >
      {isInExpandRecord && !editable ? (
        <CellText cellValue={cellValue} field={props.field} isActive />
      ) : isEnhanceText || isSingleText ? (
        <input
          ref={enhanceEditorRef}
          placeholder={placeholder}
          value={value}
          onChange={updateValue}
          onBlur={() => {
            onBlur && onBlur();
          }}
          readOnly={!editable}
          className="textEditorInput"
        />
      ) : (
        <RcTextArea
          ref={rcTextAreaRef}
          autoSize={autoSize}
          placeholder={placeholder}
          value={value}
          onChange={updateValue}
          readOnly={!editable}
          disabled={disabled}
          onKeyDown={onKeyDown}
          onBlur={() => {
            onBlur && onBlur();
          }}
        />
      )}
      {needEditorTip && !isEnhanceText && !isInExpandRecord && !isSingleText && editing && editable && (
        <div
          className={classNames({
            [styles.tip]: true,
          })}
          onClick={() => {
            focus();
          }}
        >
          {t(Strings.new_a_line)}
          <span>， {t(Strings.text_editor_tip_end)}</span>
        </div>
      )}
    </div>
  );
};

export const TextEditor = memo(forwardRef(TextEditorBase));
