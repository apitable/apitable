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

import { Dispatch, SetStateAction } from 'react';
import * as React from 'react';
import { Button, useThemeColors } from '@apitable/components';
import { ICheckboxField, IField, t, Strings } from '@apitable/core';
import { ChevronDownOutlined } from '@apitable/icons';
import { Emoji } from 'pc/components/common';
import { EmojiPicker } from 'pc/components/common/emoji_picker';
import { EMOJI_SIZE } from '../../catalog/tree/tree';
import styles from './styles.module.less';
interface IFormateCheckboxProps {
  currentField: ICheckboxField;
  setCurrentField: Dispatch<SetStateAction<IField>>;
}

export const FormateCheckbox: React.FC<React.PropsWithChildren<IFormateCheckboxProps>> = (props: IFormateCheckboxProps) => {
  const { currentField, setCurrentField } = props;
  const colors = useThemeColors();
  const onSelect = (emoji: any) => {
    setCurrentField({
      ...currentField,
      property: { ...currentField.property, icon: emoji },
    });
  };

  const TriggerComponent = (
    <Button
      style={{
        height: 40,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'none',
        paddingLeft: 0,
      }}
    >
      <Emoji emoji={currentField.property.icon} set="apple" size={EMOJI_SIZE} />
      <span style={{ marginLeft: 4 }}>
        <ChevronDownOutlined size={16} color={colors.fourthLevelText} />
      </span>
    </Button>
  );

  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle} style={{ margin: 0 }}>
        {t(Strings.icon_setting)}
      </div>
      <div className="flex item-center space-between">
        <div style={{ width: '100%' }}>
          <EmojiPicker onSelect={onSelect}>{TriggerComponent}</EmojiPicker>
        </div>
      </div>
    </div>
  );
};
