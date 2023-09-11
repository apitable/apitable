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

import { useClickAway } from 'ahooks';
import { Popover } from 'antd';
import { FC, PropsWithChildren, useRef, useState } from 'react';
import * as React from 'react';
import { Strings, t } from '@apitable/core';
import { Picker } from 'pc/components/common';
import { useResponsive } from 'pc/hooks';
import { ComponentDisplay, ScreenSize } from '../component_display';
import { Popup } from '../mobile/popup';
import styles from './style.module.less';

export interface IEmojiPopoverProps {
  onSelect(emoji: string): void;
}

export const EmojiPickerBase: FC<React.PropsWithChildren<PropsWithChildren<IEmojiPopoverProps>>> = (props) => {
  const { children, onSelect } = props;
  const ref = useRef<HTMLDivElement | null>(null);
  const { screenIsAtMost } = useResponsive();

  const [visible, setVisible] = useState(false);

  useClickAway(
    () => {
      if (!visible || screenIsAtMost(ScreenSize.md)) {
        return;
      }
      setVisible(false);
    },
    ref,
    'mousedown',
  );

  const EmojiPicker = () => {
    return (
      <div ref={ref}>
        <Picker
          onSelect={(emoji: { id: string }) => {
            onSelect(emoji.id);
            setVisible(false);
          }}
        />
      </div>
    );
  };

  return (
    <>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <Popover
          overlayClassName={styles.emojiPopover}
          overlayInnerStyle={{ padding: 0 }}
          content={EmojiPicker()}
          trigger="click"
          visible={visible}
          arrowPointAtCenter={false}
          mouseEnterDelay={0}
          mouseLeaveDelay={0}
          onVisibleChange={(visible) => setVisible(visible)}
          destroyTooltipOnHide={{ keepParent: false }}
          placement="bottom"
        >
          {children as React.ReactElement}
        </Popover>
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <Popup
          open={visible}
          onClose={() => setVisible(false)}
          height="90%"
          title={t(Strings.please_choose)}
          bodyStyle={{ padding: 0 }}
          destroyOnClose
        >
          {EmojiPicker()}
        </Popup>
        <div onClick={() => setVisible(true)}>{children as React.ReactElement}</div>
      </ComponentDisplay>
    </>
  );
};

export const EmojiPicker = React.memo(EmojiPickerBase);
