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

import { forwardRef, memo, useCallback, useImperativeHandle, useRef, useState } from 'react';
import * as React from 'react';
import { Message } from '@apitable/components';
import { ConfigConstant, t, Strings } from '@apitable/core';
import { getNodeIcon } from 'pc/components/catalog/tree/node_icon';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Rate } from 'pc/components/common/rate';
import { isNumberKey, isTouchDevice } from 'pc/utils';
import { FocusHolder } from '../focus_holder';
import { IBaseEditorProps, IEditor } from '../interface';
import { RatingEditorMobile } from './rating_editor_mobile';
import style from './style.module.less';

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

  const onEndEdit = (cancel: boolean) => {
    if (!cancel) {
      saveValue();
    }
    setEditorValue(null);
  };

  const saveValue = () => {
    onSave && onSave(value);
  };

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

      if (!isNumberKey(e as any)) {
        rate = value !== null ? value : cellValue;
      } else {
        const currentTime = Date.now();
        if (rate === 0 && currentTime - lastTime <= 300) {
          rate = Number(`${value}${rate}`);
        }

        if (rate > props.field.property.max) {
          Message.error({ content: t(Strings.update_rate_error_notify), duration: 1.5 });
          rate = value !== null ? value : cellValue;
        }
      }

      setLastTime(Date.now());
      setEditorValue(rate);
    },
    [value, lastTime, cellValue, props.field.property.max],
  );

  return (
    <div className={style.ratingEditor} style={props.style} onKeyDown={handleKeyDown} onClick={focus}>
      <FocusHolder ref={editorRef} />
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <Rate
          disabled={!editable}
          value={value}
          character={getNodeIcon(props.field.property.icon, ConfigConstant.NodeType.DATASHEET, {
            size: emojiSize || ConfigConstant.CELL_EMOJI_SIZE,
            emojiSize: emojiSize || ConfigConstant.CELL_EMOJI_SIZE,
          })}
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
