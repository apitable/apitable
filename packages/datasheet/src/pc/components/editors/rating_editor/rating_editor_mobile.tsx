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
import { memo, useState } from 'react';
import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import { ConfigConstant, t, Strings } from '@apitable/core';
import { ChevronDownOutlined } from '@apitable/icons';
import { Emoji } from 'pc/components/common/emoji';
import { Popup } from 'pc/components/common/mobile/popup';
import { Rate } from 'pc/components/common/rate';
import { RateItem } from './rate_item';
import style from './style.module.less';

export interface IRatingEditorMobileProps {
  editable: boolean;
  editing: boolean;
  max: number;
  value: number | null;
  onChange(value: number): void;
  emoji: any;
  filtering?: boolean;
}

const RatingEditorMobileBase: React.FC<React.PropsWithChildren<IRatingEditorMobileProps>> = (props) => {
  const { editable, max, value, editing, emoji, onChange, filtering } = props;
  const colors = useThemeColors();
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div className={classNames(style.editorContent, filtering && style.filtering)} onClick={() => setVisible(!visible)}>
        <Rate disabled={!editable} value={value} character={<Emoji emoji={emoji} set="apple" size={ConfigConstant.CELL_EMOJI_SIZE} />} max={max} />
        {editable && <ChevronDownOutlined size={16} color={colors.fourthLevelText} />}
      </div>
      {visible && editable && (
        <Popup
          title={t(Strings.please_choose)}
          height={'50%'}
          open={visible && editing}
          onClose={() => setVisible(false)}
          className={style.ratingEditorPopupWrapper}
        >
          <div className={style.rateItemList}>
            {[...Array(max + 1).keys()].map((_item, index) => (
              <RateItem
                key={index}
                onChange={(value) => {
                  onChange(value);
                  setVisible(false);
                }}
                value={index}
                checked={value === index}
              >
                <Emoji emoji={emoji} set="apple" size={ConfigConstant.CELL_EMOJI_SIZE} />
              </RateItem>
            ))}
          </div>
        </Popup>
      )}
    </>
  );
};

export const RatingEditorMobile = memo(RatingEditorMobileBase);
