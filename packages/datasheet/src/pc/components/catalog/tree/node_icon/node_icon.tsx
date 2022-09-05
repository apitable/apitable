import { colorVars } from '@vikadata/components';
import { ConfigConstant, EmojisConfig } from '@vikadata/core';
import { makeNodeIconComponent } from 'pc/components/catalog/node_context_menu';
import { Emoji } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from 'pc/hooks';
import { nodeConfigData } from 'pc/utils';
import { FC } from 'react';
import { EmojiPopover } from '../../emoji_popover';
import styles from './style.module.less';

export interface INodeIconProps {
  /* 节点Id */
  nodeId: string;
  /* 节点类型 */
  type?: ConfigConstant.NodeType;
  /* emoji icon名称 */
  icon?: string;
  /* 是否是已展开的节点 */
  expanded?: boolean;
  /* 是否是没有子节点的节点 */
  hasChildren?: boolean;
  /* 是否可以编辑节点图标 */
  editable?: boolean;
  actived?: boolean;
  size?: number;
}

export const NodeIcon: FC<INodeIconProps> = ({
  nodeId,
  icon,
  type = ConfigConstant.NodeType.DATASHEET,
  expanded = false,
  hasChildren = false,
  editable = true,
  actived = false,
  size = 18,
}) => {
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  return (
    <EmojiPopover nodeId={nodeId} type={type} iconEditable={editable && !isMobile}>
      <span className={styles.iconWrapper}>{getNodeIcon(icon, type, { expanded, hasChildren, size, emojiSize: size, actived })}</span>
    </EmojiPopover>
  );
};

/**
 * 通过指定参数获取节点的图标
 * @param icon emoji的名称
 * @param type 节点类型
 * @param options 其它参数(size: 默认节点图标的大小，emojiSize：emoji的大小，expanded: 是否是打开状态，hasChildren：是否有子节点)
 */
export const getNodeIcon = (
  icon: string | null | undefined,
  type: ConfigConstant.NodeType,
  options: {
    size?: number;
    emojiSize?: number;
    expanded?: boolean;
    hasChildren?: boolean;
    actived?: boolean;
    normalColor?: string;
    activedColor?: string;
  } = {},
) => {
  const {
    size = 20,
    emojiSize = 20,
    expanded,
    hasChildren = true,
    actived = false,
    normalColor = colorVars.fourthLevelText,
    activedColor = colorVars.primaryColor,
  } = options;
  if (icon) {
    const url = EmojisConfig[icon]?.url;
    return url ? (
      <img
        src={EmojisConfig[icon]?.url}
        style={{
          width: emojiSize,
          height: emojiSize,
        }}
      />
    ) : (
      <Emoji emoji={icon} size={emojiSize} set="apple" />
    );
  }
  const nodeConfig = nodeConfigData.find(item => item.type === type);
  if (!nodeConfig) return;
  let iconName = nodeConfig.icon;
  if (hasChildren && nodeConfig?.notEmptyIcon) {
    iconName = nodeConfig.notEmptyIcon;
  }
  if (expanded && nodeConfig?.openedIcon) {
    iconName = nodeConfig.openedIcon;
  }

  return makeNodeIconComponent(iconName, { size, color: actived ? activedColor : normalColor });
};
