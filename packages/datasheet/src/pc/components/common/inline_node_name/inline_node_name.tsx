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

import { useState } from 'react';
import * as React from 'react';
// import { useSelector, shallowEqual } from 'react-redux';
// import { Selectors } from '@apitable/core';
import { Emoji } from '../emoji';
import styles from './styles.module.less';
import classNames from 'classnames';
import { EmojiPopover } from 'pc/components/catalog/emoji_popover';
import { Tooltip } from '../tooltip';
import { getNodeTypeByNodeId } from 'pc/utils';
import { useThemeColors } from '@apitable/components';
import { makeNodeIconComponent } from 'pc/components/catalog/node_context_menu';
import { NodeIcon } from 'pc/components/catalog/node_context_menu/node_icons';

interface IInlineNodeNameProps {
  nodeId: string;
  nodeName: string | undefined;
  nodeNameStyle?: React.CSSProperties;
  nodeIcon: string | undefined;
  withIcon?: boolean;
  withBrackets?: boolean; 
  withTip?: boolean;
  iconSize?: number;
  size?: number;
  prefix?: string;
  className?: string;
  iconEditable?: boolean;
}

export const InlineNodeName: React.FC<React.PropsWithChildren<IInlineNodeNameProps>> = props => {
  const {
    nodeId, nodeName, nodeIcon, withIcon, iconSize = 18, size = 16, withBrackets, nodeNameStyle,
    prefix = '', className, withTip, iconEditable,
  } = props;
  const colors = useThemeColors();
  const [showTip, setShowTip] = useState(false);

  if (!nodeName && !nodeIcon) return <></>;

  const handleShowTipChange = (show: boolean) => {
    if (withTip) setShowTip(show);
  };
  return (
    <Tooltip
      title={nodeName}
      placement="left"
      open={showTip}
      mouseEnterDelay={0.5}
      onOpenChange={handleShowTipChange}
    >
      <div className={classNames(styles.datasheetInfo, className, iconEditable && styles.iconEditable)}>
        {prefix}
        {withBrackets && '「'}
        {withIcon && (nodeIcon ? (
          <EmojiPopover nodeId={nodeId} type={getNodeTypeByNodeId(nodeId)} iconEditable={iconEditable} offset={[5]}>
            <Emoji emoji={nodeIcon} size={iconSize} />
          </EmojiPopover>
        ) : makeNodeIconComponent(NodeIcon.Datasheet, { size, color: colors.fourthLevelText }))}
        <Tooltip title={nodeName} textEllipsis>
          <span className={styles.name} style={nodeNameStyle}>{nodeName}</span>
        </Tooltip>
        {withBrackets && '」'}
      </div>
    </Tooltip>
  );
};
