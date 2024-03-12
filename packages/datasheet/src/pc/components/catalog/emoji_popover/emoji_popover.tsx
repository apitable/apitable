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

import { Popover } from 'antd';
import { FC, useState, PropsWithChildren } from 'react';
import * as React from 'react';
import { ConfigConstant } from '@apitable/core';
import { Picker } from 'pc/components/common/emoji/emoji';
import { useCatalogTreeRequest } from 'pc/hooks/use_catalogtree_request';
import { useRequest } from 'pc/hooks/use_request';
import styles from './style.module.less';

export interface IEmojiPopoverProps {
  /* Node type */
  type: ConfigConstant.NodeType;
  nodeId: string;
  iconEditable?: boolean;
  offset?: number[];
}

export const EmojiPopoverBase: FC<React.PropsWithChildren<PropsWithChildren<IEmojiPopoverProps>>> = ({
  nodeId,
  iconEditable = true,
  type,
  offset,
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const { updateNodeIconReq } = useCatalogTreeRequest();
  const { run: updateNodeIcon } = useRequest(updateNodeIconReq, { manual: true });

  const stopPropagation = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
  };

  const EmojiPicker = ({ nodeId }: { nodeId: string }) => {
    const selectEmoji = (emoji: { id: string }) => {
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
      open={visible}
      arrowPointAtCenter={false}
      mouseEnterDelay={0}
      mouseLeaveDelay={0}
      onOpenChange={(visible) => setVisible(visible)}
      destroyTooltipOnHide={{ keepParent: false }}
      align={{
        points: ['tl', 'bl'],
        offset,
      }}
    >
      {children as React.ReactElement}
    </Popover>
  );
};

export const EmojiPopover = React.memo(EmojiPopoverBase);
