import { FC, useState, PropsWithChildren } from 'react';
import * as React from 'react';
import { ConfigConstant } from '@apitable/core';
import { Picker } from 'pc/components/common';
import { Popover } from 'antd';
import styles from './style.module.less';
import { useCatalogTreeRequest } from 'pc/hooks';
import { useRequest } from 'pc/hooks';

export interface IEmojiPopoverProps {
  /* 节点类型 */
  type: ConfigConstant.NodeType;
  nodeId: string;
  iconEditable?: boolean;
  offset?: number[];
}

export const EmojiPopoverBase: FC<PropsWithChildren<IEmojiPopoverProps>> = ({ nodeId, iconEditable = true, type, offset, children }) => {
  const [visible, setVisible] = useState(false);
  const { updateNodeIconReq } = useCatalogTreeRequest();
  const { run: updateNodeIcon } = useRequest(updateNodeIconReq, { manual: true });

  const stopPropagation = e => {
    e.stopPropagation();
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
  };

  const EmojiPicker = ({ nodeId }) => {
    const selectEmoji = emoji => {
      updateNodeIcon(nodeId, type, emoji.id);
      setVisible(false);
    };

    return (
      <div onClick={stopPropagation} onContextMenu={stopPropagation}>
        <Picker onSelect={selectEmoji} onReset={resetIcon} />
      </div>
    );
  };

  const resetIcon = () => {
    updateNodeIcon(nodeId, type, '');
  };

  if (!iconEditable) {
    return children as React.ReactElement;
  }

  return (
    <Popover
      overlayClassName={styles.emojiPopover}
      content={<EmojiPicker nodeId={nodeId} />}
      trigger="click"
      visible={visible}
      arrowPointAtCenter={false}
      mouseEnterDelay={0}
      mouseLeaveDelay={0}
      onVisibleChange={visible => setVisible(visible)}
      destroyTooltipOnHide={{ keepParent: false }}
      align={{
        points: ['tl', 'bl'],
        offset,
      }}
    >
      {children as React.ReactElement}
    </Popover >
  );
};

export const EmojiPopover = React.memo(EmojiPopoverBase);
