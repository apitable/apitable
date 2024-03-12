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
import { find, omit } from 'lodash';
import { ChangeEvent, default as React, forwardRef, memo, useImperativeHandle, useRef, useState } from 'react';
import { LinkButton, useThemeColors } from '@apitable/components';
import { Field, FieldType, ICellValue, IField, ISegment, SegmentType, Selectors, Strings, t } from '@apitable/core';
import { EditOutlined, EmailOutlined, NewtabOutlined, TelephoneOutlined, WebOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import { UrlActionUI } from 'pc/components/konva_grid/components/url_action_container/url_action_ui';
import cellTextStyle from 'pc/components/multi_grid/cell/cell_text/style.module.less';
import { useEnhanceTextClick } from 'pc/components/multi_grid/cell/hooks/use_enhance_text_click';
import { useAppSelector } from 'pc/store/react-redux';
import { stopPropagation } from 'pc/utils';
import { IBaseEditorProps, IEditor } from '../interface';
import style from './styles.module.less';

interface IEnhanceTextEditorProps extends IBaseEditorProps {
  placeholder?: string;
  field: IField;
  recordId: string;
  style: React.CSSProperties;
  editable: boolean;
  editing: boolean;
  setEditing?: React.Dispatch<React.SetStateAction<boolean>>;
  cellValue?: ICellValue;
  isForm?: boolean;
}

export const EnhanceTextEditorBase: React.ForwardRefRenderFunction<IEditor, IEnhanceTextEditorProps> = (props, ref) => {
  const { disabled, placeholder, field, onSave, onChange: propsOnChange, cellValue, recordId, isForm, setEditing } = props;
  const [value, setValue] = useState('');
  const colors = useThemeColors();
  const cacheValueRef = useRef<ISegment[] | null | undefined>(null);
  const imageLoadErrorRef = useRef<boolean>(false);
  const editorRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const [activeUrlAction, setActiveUrlAction] = useState(false);
  const datasheetId = useAppSelector((state) => Selectors.getActiveDatasheetId(state))!;

  useImperativeHandle(
    ref,
    (): IEditor => ({
      focus: (preventScroll) => {
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
        cacheValueRef.current = value;
      },
      setValue: (value?: ISegment[] | null) => {
        onStartEdit(value);
      },
      saveValue: () => {
        saveValue();
      },
    }),
  );

  const segment2String = (value: ISegment[] | null): string => {
    if (!value) {
      return '';
    }
    if (typeof value === 'string') {
      return value;
    }
    return value.reduce((pre, cur) => pre + cur.text, '');
  };

  const setEditorValue = (value: ISegment[] | null) => {
    setValue(segment2String(value));
  };

  const focus = (preventScroll?: boolean) => {
    editorRef.current && editorRef.current.focus({ preventScroll });
    setFocused(true);
  };

  const blur = () => {
    editorRef.current && editorRef.current.blur();
    setFocused(false);
  };

  const getValidValue = (value: string) => {
    // Ensure no loss of mailbox formatted text data when converting single line text types to mailboxes
    let omitProps = {};
    if (cacheValueRef.current && cacheValueRef.current.some((v) => v.text === value)) {
      omitProps = omit(find(cacheValueRef.current, { text: value }), ['text']);
    }
    let restProps = {};
    if (field.type === FieldType.URL) {
      restProps = omit(cellValue?.[0], ['text', 'type']);
    }
    // Plain long text, matching segment phone email address, then stored as [Text]
    const segment: ISegment[] = [{ ...restProps, type: SegmentType.Text, text: value, ...omitProps }];
    return value.length ? segment : null;
  };

  const updateValue = (event: ChangeEvent<HTMLInputElement>) => {
    if (props.editing) {
      const value = event.target.value;
      if (field.type === FieldType.Phone) {
        const newValue = value
          .replace(/[^+0-9-]/g, '')
          .replace(/^([+])/, '$1')
          .replace(/\+{2,}/g, '+')
          .replace(/^([+][0-9-]*){0,1}([0-9-]*)/, '$1$2');

        setValue(newValue);
        propsOnChange && propsOnChange(getValidValue(newValue));
      } else if (field.type === FieldType.Email) {
        const newValue = value.replace(/\s/g, '');
        setValue(newValue);
        propsOnChange && propsOnChange(getValidValue(newValue));
      } else {
        setValue(value);
        propsOnChange && propsOnChange(getValidValue(value));
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ' && field.type === FieldType.Email) {
      event.preventDefault();
    }
  };

  const onEndEdit = (cancel: boolean) => {
    if (!cancel) {
      saveValue();
    }
    setEditorValue(null);
  };

  const saveValue = () => {
    onSave && onSave(getValidValue(value));
  };

  const setSelectionToEnd = () => {
    const element = editorRef.current;
    if (!element) {
      return;
    }
    element.scrollTop = element.scrollHeight;
  };

  const onStartEdit = (value?: ISegment[] | null) => {
    if (value === undefined) return;
    setEditorValue(value);
    setTimeout(() => {
      setSelectionToEnd();
    }, 20);
  };

  const _handleEnhanceTextClick = useEnhanceTextClick();
  if (!props.editable) {
    return (
      <div className={classNames(style.enhanceText, cellTextStyle.cellText)} onClick={() => _handleEnhanceTextClick(field.type, value)}>
        <div tabIndex={-1} ref={editorRef} />
        {value}
      </div>
    );
  }

  const getEnhanceTypeIcon = (type: string | number) => {
    if (!value && (field.type !== FieldType.URL || isForm)) return null;
    const typeIconMap = {
      [FieldType.URL]: !isForm ? (
        <Tooltip title={t(Strings.url_cell_edit)} placement="top">
          <span>
            <EditOutlined color={colors.thirdLevelText} size={16} />
          </span>
        </Tooltip>
      ) : (
        <NewtabOutlined color={colors.thirdLevelText} />
      ),
      [FieldType.Email]: <EmailOutlined color={colors.thirdLevelText} size={16} />,
      [FieldType.Phone]: <TelephoneOutlined color={colors.thirdLevelText} size={16} />,
    };
    return (
      <span
        className={classNames(style.enhanceTextIcon, field.type === FieldType.URL && style.hover)}
        onClick={() => {
          if (!isForm && field.type === FieldType.URL) {
            setActiveUrlAction(true);
          } else {
            _handleEnhanceTextClick(field.type, value);
          }
        }}
      >
        {typeIconMap[type]}
      </span>
    );
  };

  const showURLTitleFlag = !focused && field.type === FieldType.URL && cellValue;

  const favicon = field.type === FieldType.URL && field.property?.isRecogURLFlag && cellValue?.[0]?.favicon;

  const renderURL = () => {
    if (!showURLTitleFlag) return null;

    const urlTitle =
      field.type === FieldType.URL ? Field.bindModel(field).cellValueToTitle(cellValue) : Field.bindModel(field).cellValueToString(cellValue as any);
    if (!urlTitle) return null;

    return (
      <div className={style.content}>
        {!focused && favicon && (
          <img
            onError={() => {
              imageLoadErrorRef.current = true;
            }}
            onLoad={() => {
              imageLoadErrorRef.current = false;
            }}
            style={{ width: imageLoadErrorRef.current ? 0 : '16px' }}
            src={favicon}
            alt=""
          />
        )}
        {!focused && favicon && imageLoadErrorRef.current && <WebOutlined size={18} color={colors.textCommonPrimary} />}
        <Tooltip title={value} placement="top">
          <LinkButton
            type=""
            className={style.title}
            onMouseDown={() => {
              if (/^https?:\/\//.test(value)) {
                window.open(value, '_blank');
                return;
              }
              window.open(`http://${value}`);
            }}
          >
            {urlTitle}
          </LinkButton>
        </Tooltip>
      </div>
    );
  };

  return (
    <div ref={wrapperRef} className={style.textEditor} style={{ ...props.style }} onMouseMove={stopPropagation} onWheel={stopPropagation}>
      <div className={style.enhanceTextEditor}>
        {renderURL()}
        <input
          ref={editorRef}
          placeholder={placeholder}
          className={classNames(field.type === FieldType.URL && style.urlInput)}
          disabled={disabled}
          value={value}
          onChange={updateValue}
          onKeyPress={handleKeyPress}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            minHeight: isForm ? 40 : 32,
            color: showURLTitleFlag ? 'transparent' : 'inherit',
          }}
        />
        {getEnhanceTypeIcon(field.type)}
      </div>
      {!isForm && activeUrlAction && (
        <UrlActionUI
          activeUrlAction={activeUrlAction}
          setActiveUrlAction={setActiveUrlAction}
          fieldId={field.id}
          recordId={recordId}
          datasheetId={datasheetId}
          title={field.name}
          tempValue={value}
          callback={(val) => {
            setValue(val);
            setEditing?.(false);
          }}
        />
      )}
    </div>
  );
};

export const EnhanceTextEditor = memo(forwardRef(EnhanceTextEditorBase));
