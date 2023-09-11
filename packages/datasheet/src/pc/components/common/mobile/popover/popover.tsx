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

import RcTrigger, { TriggerProps } from 'rc-trigger';
import { useState } from 'react';
import * as React from 'react';
import ArrowIcon from 'static/icon/common/mobile/tooltips_arrow.svg';
import style from './style.module.less';

type ITriggerProps = Omit<TriggerProps, 'popup'> & { content: TriggerProps['popup'] };

export const Popover: React.FC<React.PropsWithChildren<ITriggerProps>> = (props) => {
  const { content, ...rest } = props;

  const [visible, setVisible] = useState(false);

  return (
    <RcTrigger
      popupVisible={visible}
      onPopupVisibleChange={(visible) => setVisible(visible)}
      destroyPopupOnHide
      action={['click']}
      popupStyle={{
        position: 'absolute',
        zIndex: 1000,
        pointerEvents: 'initial',
      }}
      popupAlign={{
        points: ['tr', 'br'],
        offset: [6, 8],
      }}
      popup={
        <div className={style.toolsWrapper} onClick={() => setVisible(false)}>
          <div className={style.arrowWrapper}>
            <ArrowIcon fill={'#262838'} width={20} height={12} />
          </div>
          {content as any}
        </div>
      }
      {...rest}
    >
      {props.children}
    </RcTrigger>
  );
};
