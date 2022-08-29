import { FieldType, getTextFieldType, ISegment, string2Segment, Strings, t } from '@vikadata/core';
import classNames from 'classnames';
import { ContextName, ShortcutContext } from 'pc/common/shortcut_key';
import { stopPropagation } from 'pc/utils/dom';
import RcTextArea from 'rc-textarea';

import {
  ChangeEvent,
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import * as React from 'react';
import { IBaseEditorProps, IEditor } from '../interface';
import styles from './style.module.less';
import { CellText } from 'pc/components/multi_grid/cell/cell_text';
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

  useImperativeHandle(ref, (): IEditor => ({
    focus: (preventScroll?: boolean) => { focus(preventScroll); },
    blur: () => { blur(); },
    onEndEdit: (cancel: boolean) => { onEndEdit(cancel); },
    onStartEdit: (value?: ISegment[] | null) => { onStartEdit(value); },
    setValue: (value?: ISegment[] | null) => { onStartEdit(value); },
    saveValue: () => { saveValue(); },
  }));

  useEffect(() => {
    if (!(rcTextAreaRef.current)) {
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

  // 给 parent 组件调用的回调
  const onEndEdit = (cancel: boolean) => {
    if (!cancel) {
      saveValue();
    }
    setEditorValue(null);
  };

  const getValidValue = (originValue) => {
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

  // 给 parent 组件调用的回调
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

  /**
   * 修改 Text 类型单元格部分快捷键功能（仅编辑态）:
   * Shift + Enter —— 结束编辑并聚焦下个单元格
   * Enter —— 单元格内换行
   */
  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const wrapMetaCode = event.ctrlKey || event.altKey;
    const isWrapKeyCombination = wrapMetaCode && event.keyCode === 13;

    if (!(editing && isWrapKeyCombination)) {
      return;
    }

    // execCommand docRef: https://momane.com/use-document-execcommand-to-set-value
    document.execCommand('insertText', false, '\n');

    /**
     * 手动添加的换行符并不会让 textarea 滚动到光标的位置，所以借助 失焦->聚焦 的方式让 textarea 滚动
     * execCommand 这种调用还是无法让 textArea 自动滚动
     */
    textAreaRef.current?.blur();
    setTimeout(() => {
      textAreaRef.current?.focus();
    }, 0);
  };

  /**
   *  表格区域，输入框的最低高度取决于激活单元格的高度，也就是这里的 height，由于 rcTextArea 设置 autoSize 后会动态的计算 minHeight 和 maxHeight，
   *  直接在 rcTextArea 上设置 style 会失效，换一个思路考虑，当进入编辑态的时候，输入框的最小高度就已经被确定了，可以直接多 rcTextArea 设置一个最小行数，
   *  单行的高度为 31 （变量 TEXT_LINE_HEIGHT），可以用 「height / 行高」 计算出 minRows
   */
  const autoSize = isInExpandRecord ? { minRows } : { minRows: Math.round(height / TEXT_LINE_HEIGHT), maxRows: 7 };

  return (
    <div
      ref={wrapperRef}
      className={styles.textEditor}
      style={{ ...style }}
      onWheel={stopPropagation}
      onMouseMove={stopPropagation}
    >
      {
        (isInExpandRecord && !editable) ? 
          <CellText cellValue={cellValue} field={props.field} isActive />
          : isEnhanceText || isSingleText ? <input
            ref={enhanceEditorRef}
            placeholder={placeholder}
            value={value}
            onChange={updateValue}
            onBlur={() => { onBlur && onBlur(); }}
            readOnly={!editable}
            className="textEditorInput"
          /> :
            <RcTextArea
              ref={rcTextAreaRef}
              autoSize={autoSize}
              placeholder={placeholder}
              value={value}
              onChange={updateValue}
              readOnly={!editable}
              disabled={disabled}
              onKeyDown={onKeyDown}
              onBlur={() => { onBlur && onBlur(); }}
            /> 
      }
      {
        needEditorTip && !isEnhanceText && !isInExpandRecord && !isSingleText && editing && editable &&
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
      }
    </div>
  );
};

export const TextEditor = memo(forwardRef(TextEditorBase));
