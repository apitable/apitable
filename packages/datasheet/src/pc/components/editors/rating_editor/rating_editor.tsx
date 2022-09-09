import { ConfigConstant, t, Strings } from '@vikadata/core';
import { Rate } from 'pc/components/common/rate';
import { forwardRef, memo, useCallback, useImperativeHandle, useRef, useState } from 'react';
import * as React from 'react';
import { IBaseEditorProps, IEditor } from '../interface';
import style from './style.module.less';
import { Emoji } from 'pc/components/common/emoji';
import { FocusHolder } from '../focus_holder';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { RatingEditorMobile } from './rating_editor_mobile';
import { isNumberKey, isTouchDevice } from 'pc/utils';
import { Message } from '@vikadata/components';

export interface IRatingEditorProps extends IBaseEditorProps {
  style: React.CSSProperties;
  editable: boolean;
  editing: boolean;
  emojiSize?: number;
  commandFn?: (data: number | null) => void;
  filtering?: boolean;
  cellValue?: number;
}

const RatingEditorBase: React.ForwardRefRenderFunction<IEditor, IRatingEditorProps> = (props, ref) => {
  const { editable, onSave, emojiSize, onChange: propsOnChange, cellValue = 0 } = props;
  const [value, setValue] = useState<number | null>(null);
  const editorRef = useRef<HTMLInputElement>(null);
  const [lastTime, setLastTime] = useState(0);

  useImperativeHandle(
    ref,
    (): IEditor => ({
      focus: () => {
        focus();
      },
      onEndEdit: (cancel: boolean) => {
        onEndEdit(cancel);
      },
      onStartEdit: (value?: number | null) => {
        onStartEdit(value);
      },
      setValue: (value?: number | null) => {
        onStartEdit(value);
      },
      saveValue: () => {
        saveValue();
      },
    }),
  );

  const setEditorValue = (value: number | null) => {
    setValue(value);
  };

  const focus = () => {
    if (!isTouchDevice()) {
      editorRef.current?.focus();
    }
  };

  // 给 parent 组件调用的回调
  const onEndEdit = (cancel: boolean) => {
    if (!cancel) {
      saveValue();
    }
    setEditorValue(null);
  };

  const saveValue = () => {
    onSave && onSave(value);
  };

  // 给 parent 组件调用的回调
  const onStartEdit = (value?: number | null) => {
    if (value === undefined) return;
    setEditorValue(value);
  };

  const handleChange = (value: number | null) => {
    if (props.editing) {
      setValue(value);
      propsOnChange && propsOnChange(value);
      if (!props.commandFn) return;
      props.commandFn(value);
    }
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const { key } = e;
      let rate: number | null = Number(key);

      // 非数字
      if (!isNumberKey(e as any)) {
        rate = value !== null ? value : cellValue;
      } else {
        const currentTime = Date.now();
        // 当输入的评分为 0 时，向前推 0.3 秒追溯是否为 10 分
        if (rate === 0 && currentTime - lastTime <= 300) {
          rate = Number(`${value}${rate}`);
        }

        if (rate > props.field.property.max) {
          Message.error({ content: t(Strings.update_rate_error_notify), duration: 1.5 });
          // value 存在为 null 情况，调用 cellValue 赋值
          rate = value !== null ? value : cellValue;
        }
      }

      setLastTime(Date.now());
      setEditorValue(rate);
    },
    [value, lastTime, cellValue, props.field.property.max],
  );

  return (
    <div
      className={style.ratingEditor}
      style={props.style}
      onKeyDown={handleKeyDown}
      // 再次点击时存在焦点丢失问题，需要重新聚焦下
      onClick={focus}
    >
      <FocusHolder ref={editorRef} />
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <Rate
          disabled={!editable}
          value={value}
          character={<Emoji emoji={props.field.property.icon} set="apple" size={emojiSize || ConfigConstant.CELL_EMOJI_SIZE} />}
          onChange={handleChange}
          max={props.field.property.max}
        />
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <RatingEditorMobile
          value={value}
          onChange={handleChange}
          max={props.field.property.max}
          emoji={props.field.property.icon}
          editable={editable}
          editing={props.editing}
          filtering={props.filtering}
        />
      </ComponentDisplay>
    </div>
  );
};

export const RatingEditor = memo(forwardRef(RatingEditorBase));
