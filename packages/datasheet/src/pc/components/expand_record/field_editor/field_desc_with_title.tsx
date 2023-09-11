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

import { useMount } from 'ahooks';
import { Tooltip } from 'antd';

import { FC, useRef, useState } from 'react';
import * as React from 'react';
// @ts-ignore
import Clamp from 'react-multiline-clamp';

import { useLongPress } from 'use-long-press';
import { webkitLineClamp } from 'webkit-line-clamp';
import { LinkButton, Typography, lightColors } from '@apitable/components';
import { IField, Strings, t } from '@apitable/core';

import { EditOutlined } from '@apitable/icons';
import { expandFieldDescEditorMobile } from 'pc/components/mobile_grid/field_desc_editor';
import { expandFieldDescEditor } from 'pc/components/multi_grid/field_desc';
import { usePlatform } from 'pc/hooks/use_platform';
import styles from './style.module.less';

interface IFieldDescWithTitleProps {
  datasheetId: string;
  readOnly: boolean;
  field: IField;
}

const DESC_MAX_LINES = 5;

export const FieldDescWithTitle: FC<React.PropsWithChildren<IFieldDescWithTitleProps>> = ({ datasheetId, readOnly, field }) => {
  const fieldDescRef = useRef<HTMLPreElement>(null);

  useMount(() => {
    if (fieldDescRef.current) {
      // polyfill for webkit line clamp
      webkitLineClamp(fieldDescRef.current, DESC_MAX_LINES);
    }
  });

  const { mobile } = usePlatform();
  const [pressed, setPressed] = useState(false);

  const bind = useLongPress(() => {
    setPressed(true);
  });

  return (
    <Tooltip
      openClassName={styles.tooltip}
      onVisibleChange={() => {
        setPressed(false);
      }}
      title={
        <div
          className={styles.tooltipContent}
          onClick={() => {
            setPressed(false);
            expandFieldDescEditorMobile({ field, readOnly });
          }}
        >
          <EditOutlined color={lightColors.white} size={24} />
          <Typography variant="body4" color={lightColors.white}>
            {t(Strings.edit)}
          </Typography>
        </div>
      }
      placement="top"
      autoAdjustOverflow
      visible={pressed && mobile}
    >
      <div>
        <Clamp
          lines={DESC_MAX_LINES}
          maxLines={1000}
          withToggle
          withTooltip={false}
          showMoreElement={({ toggle }: { toggle: (e: React.MouseEvent) => void }) => (
            <LinkButton underline={false} onClick={toggle} className={styles.showMore}>
              {t(Strings.see_more)}
            </LinkButton>
          )}
          showLessElement={({ toggle }: { toggle: (e: React.MouseEvent) => void }) => (
            <LinkButton underline={false} onClick={toggle} className={styles.showLess}>
              {t(Strings.collapse)}
            </LinkButton>
          )}
        >
          <pre
            className={styles.fieldDesc}
            ref={fieldDescRef}
            onClick={(e: React.MouseEvent) => {
              if (mobile) {
                return;
              }

              expandFieldDescEditor({
                fieldId: field.id,
                readOnly,
                datasheetId,
                targetDOM: (document.querySelector('.expandRecordModal') as HTMLElement) || null,
                style: {
                  left: e.pageX,
                  top: e.pageY,
                  transform: 'translateX(-50%)',
                },
              });
            }}
            {...bind}
          >
            {field.desc}
          </pre>
        </Clamp>
      </div>
    </Tooltip>
  );
};
