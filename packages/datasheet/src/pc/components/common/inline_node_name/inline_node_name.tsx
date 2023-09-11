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
import { useState } from 'react';
import * as React from 'react';
import { NodeIcon } from 'pc/components/catalog/tree/node_icon';
import { getNodeTypeByNodeId } from 'pc/utils';
import { Tooltip } from '../tooltip';
import styles from './styles.module.less';

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

export const InlineNodeName: React.FC<React.PropsWithChildren<IInlineNodeNameProps>> = (props) => {
  const {
    nodeId,
    nodeName,
    nodeIcon,
    withIcon,
    iconSize = 18,
    size = 16,
    withBrackets,
    nodeNameStyle,
    prefix = '',
    className,
    withTip,
    iconEditable,
  } = props;
  const [showTip, setShowTip] = useState(false);

  if (!nodeName && !nodeIcon) return <></>;

  const handleShowTipChange = (show: boolean) => {
    if (withTip) setShowTip(show);
  };
  return (
    <Tooltip title={nodeName} placement="left" open={showTip} mouseEnterDelay={0.5} onOpenChange={handleShowTipChange}>
      <div className={classNames(styles.datasheetInfo, className, iconEditable && styles.iconEditable)}>
        {prefix}
        {withBrackets && '「'}
        {withIcon && (
          <NodeIcon nodeId={nodeId} icon={nodeIcon} type={getNodeTypeByNodeId(nodeId)} size={nodeIcon ? iconSize : size} editable={iconEditable} />
        )}
        <Tooltip title={nodeName} textEllipsis>
          <span className={styles.name} style={nodeNameStyle}>
            {nodeName}
          </span>
        </Tooltip>
        {withBrackets && '」'}
      </div>
    </Tooltip>
  );
};
