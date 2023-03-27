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

import { Strings, t } from '@apitable/core';
import * as React from 'react';
import { ColorPickerPane, IColorPickerPane } from './color_picker_pane';
import { stopPropagation } from 'pc/utils';
import { Popup } from '../mobile/popup';

interface IColorPickerMobileProps extends IColorPickerPane {
  visible: boolean;
}

export const ColorPickerMobile: React.FC<React.PropsWithChildren<IColorPickerMobileProps>> = props => {
  const {
    visible,
    ...rest
  } = props;

  return (
    <Popup
      title={t(Strings.please_choose)}
      height='auto'
      open={visible}
      onClose={e => {
        stopPropagation(e as any);
        props.onClose();
      }}
      destroyOnClose
    >
      <ColorPickerPane
        {...rest}
      />
    </Popup>
  );
};
