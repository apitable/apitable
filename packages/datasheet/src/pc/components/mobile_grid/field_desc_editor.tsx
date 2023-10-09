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

import { Input } from 'antd';
import { Modal } from 'antd-mobile';
import type { Action } from 'antd-mobile/es/components/modal';
import classNames from 'classnames';
import * as React from 'react';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useThemeColors } from '@apitable/components';
import { CollaCommandName, Strings, t, IField } from '@apitable/core';
import { resourceService } from 'pc/resource_service';
import { Message } from '../common';
import { FIELD_DESC_LENGTH } from '../multi_grid/field_desc';
import styles from './styles.module.less';

const { TextArea } = Input;

const noop = () => {};

interface IFieldDescEditor {
  field: IField;
  onClose: () => void;
  readOnly: boolean;
}

const FieldDescEditor = ({ field, onClose, readOnly }: IFieldDescEditor) => {
  const [value, setValue] = useState(field.desc || '');
  const colors = useThemeColors();
  const textLenHasExceeded = value.length > FIELD_DESC_LENGTH;

  const onOk = () =>
    new Promise<void>((resolve, reject) => {
      if (textLenHasExceeded) {
        reject(t(Strings.field_desc_length_exceeded));
      }
      resourceService.instance!.commandManager.execute({
        cmd: CollaCommandName.SetFieldAttr,
        fieldId: field.id,
        data: {
          ...field,
          desc: value,
        },
      });
      resolve();
    });

  const actions: Action[] = [
    {
      text: t(Strings.cancel),
      style: { userSelect: 'none', color: colors.staticDark0 },
      key: t(Strings.cancel),
      onClick: () =>
        new Promise((resolve) => {
          resolve();
        }),
    },
    {
      text: t(Strings.confirm),
      onClick: () => onOk(),
      style: {
        // https://css-tricks.com/8-digit-hex-codes/
        color: textLenHasExceeded ? `${colors.primaryColor}80` : colors.primaryColor,
        userSelect: 'none',
      },
      key: t(Strings.confirm),
    },
  ];

  const readOnlyFooter: Action[] = [
    {
      text: t(Strings.confirm),
      onClick: () => {
        onClose();
      },
      style: {
        color: colors.fc1,
      },
      key: t(Strings.cancel),
    },
  ];

  const footer = actions.map((button: Action) => {
    const originPress = button.onClick || noop;
    button.onClick = () => {
      const res = originPress() as any as Promise<void>;
      if (typeof res != 'undefined') {
        res
          .then(() => {
            onClose();
          })
          .catch((error) => {
            Message.error({ content: error });
          });
      } else {
        onClose();
      }
    };
    return button;
  });

  return (
    <Modal
      visible
      title={t(Strings.field_desc)}
      showCloseButton={false}
      closeOnMaskClick={false}
      actions={(readOnly ? readOnlyFooter : footer) as any}
      content={
        <>
          <TextArea
            placeholder={t(Strings.editing_field_desc)}
            className={classNames(styles.textarea, {
              [styles.error]: textLenHasExceeded,
              [styles.readOnly]: readOnly,
            })}
            disabled={readOnly}
            rows={5}
            defaultValue={field.desc}
            readOnly={readOnly}
            onChange={(e) => setValue(e.target.value)}
          />
          <p
            className={classNames(styles.count, {
              [styles.error]: textLenHasExceeded,
            })}
          >
            {value.length}/{FIELD_DESC_LENGTH}
          </p>
        </>
      }
    />
  );
};

export const expandFieldDescEditorMobile = ({ field, readOnly }: Omit<IFieldDescEditor, 'onClose'>) => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = createRoot(div);
  const onClose = () => {
    root.unmount();
    if (div && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  };

  root.render(<FieldDescEditor field={field} readOnly={readOnly} onClose={onClose} />);
};
