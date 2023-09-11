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

import { SelectValue } from 'antd/lib/select';
import classNames from 'classnames';
import { Dispatch, SetStateAction } from 'react';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Select, Button, useThemeColors } from '@apitable/components';
import { ConfigConstant, IField, IRatingField, Strings, t } from '@apitable/core';
import { ChevronDownOutlined } from '@apitable/icons';
import { getNodeIcon } from 'pc/components/catalog/tree/node_icon';
import { MobileSelect } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { EmojiPicker } from 'pc/components/common/emoji_picker';
import { EMOJI_SIZE } from '../../catalog/tree/tree';
import styles from './styles.module.less';

interface IFormateRatingProps {
  currentField: IRatingField;
  setCurrentField: Dispatch<SetStateAction<IField>>;
}

export const FormateRating: React.FC<React.PropsWithChildren<IFormateRatingProps>> = (props: IFormateRatingProps) => {
  const colors = useThemeColors();
  const handleMaxChange = ({ value }: { value: SelectValue }) => {
    props.setCurrentField({
      ...props.currentField,
      property: { ...props.currentField.property, max: value as number },
    });
  };

  const options = [...Array(10).keys()].map((item) => ({
    value: item + 1,
    label: `${item + 1}`,
  }));

  const onSelect = (emoji: any) => {
    props.setCurrentField({
      ...props.currentField,
      property: { ...props.currentField.property, icon: emoji },
    });
  };

  const btnStyle: React.CSSProperties = {
    background: 'none',
  };

  return (
    <div className={classNames(styles.section, 'flex', 'item-center')}>
      <div className={styles.horizontalItem}>
        <div className={styles.horizontalItemTitle}>{t(Strings.icon_setting)}</div>
        <EmojiPicker onSelect={onSelect}>
          <Button style={btnStyle} className={styles.emojiBtn} suffixIcon={<ChevronDownOutlined size={16} color={colors.fourthLevelText} />}>
            {getNodeIcon(props.currentField.property.icon, ConfigConstant.NodeType.DATASHEET, {
              size: EMOJI_SIZE,
              emojiSize: EMOJI_SIZE,
            })}
          </Button>
        </EmojiPicker>
      </div>
      <div className={styles.horizontalItem}>
        <div className={styles.horizontalItemTitle}>{t(Strings.max_value)}</div>
        <ComponentDisplay minWidthCompatible={ScreenSize.md}>
          <Select
            triggerCls={styles.customSelect}
            dropdownMatchSelectWidth={false}
            value={props.currentField.property.max}
            listStyle={{ maxHeight: 350 }}
            onSelected={handleMaxChange}
            options={options}
          />
        </ComponentDisplay>

        <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
          <MobileSelect
            defaultValue={props.currentField.property.max}
            optionData={options}
            onChange={(value) => handleMaxChange({ value })}
            style={{
              height: 40,
            }}
          />
        </ComponentDisplay>
      </div>
    </div>
  );
};
