import { FC, PropsWithChildren, useRef, useState } from 'react';
import * as React from 'react';
import { Picker } from 'pc/components/common';
import { Popover } from 'antd';
import styles from './style.module.less';
import { ComponentDisplay, ScreenSize } from '../component_display';
import { Popup } from '../mobile/popup';
import { Strings, t } from '@vikadata/core';
import { useClickAway } from 'ahooks';
import { useResponsive } from 'pc/hooks';

export interface IEmojiPopoverProps {
  onSelect(emoji: string): void;
}

export const EmojiPickerBase: FC<PropsWithChildren<IEmojiPopoverProps>> = props => {
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
          onSelect={emoji => {
            onSelect(emoji.id); // onSelect 返回的是一个对象，只需要 id。
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
          onVisibleChange={visible => setVisible(visible)}
          destroyTooltipOnHide={{ keepParent: false }}
          placement="bottom"
        >
          {children as React.ReactElement}
        </Popover>
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <Popup
          visible={visible}
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
