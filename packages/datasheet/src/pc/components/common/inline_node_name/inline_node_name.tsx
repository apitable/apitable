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

export const InlineNodeName: React.FC<IInlineNodeNameProps> = props => {
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
      visible={showTip}
      mouseEnterDelay={0.5}
      onVisibleChange={handleShowTipChange}
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
