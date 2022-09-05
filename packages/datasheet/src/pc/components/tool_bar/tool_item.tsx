import { TextButton, Button } from '@vikadata/components';
import { useResponsive } from 'pc/hooks';
import { ReactNode } from 'react';
import * as React from 'react';
import { ScreenSize } from '../common/component_display';
import classNames from 'classnames';
import styles from './style.module.less';
import { WrapperTooltip } from 'pc/components/widget/widget_panel/widget_panel_header';
import { expandViewLock } from 'pc/components/view_lock/expand_view_lock';
import { useSelector } from 'react-redux';
import { Selectors } from '@vikadata/core';

type IToolItemProps = {
  icon: ReactNode;
  text: ReactNode;
  isActive?: boolean;
  className?: string;
  onClick?(e: any): void;
  disabled?: boolean;
  id?: string;
  showLabel?: boolean;
  isHide?: boolean;
  showViewLockModal?: boolean;
};

// 工具栏添加新的工具项后，需要计算出最小可显示 icon + 名称的宽度。更新这里的阈值。
// toolItem 内的文字位数 也会影响这里的宽度
// const SHOW_TOOL_TEXT_WIDTH = 999;

export const ToolItem: React.FC<IToolItemProps> = props => {
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const { isActive, className, showLabel = true, disabled, onClick, icon, text, id, showViewLockModal, isHide } = props;
  const shouldShowText = isHide || showLabel || isMobile; // 移动端始终显示 Label
  const activeView = useSelector(Selectors.getCurrentView)!;

  const buttonProps: any = {
    className: classNames(className, {
      [styles.pcStyle]: !isActive,
      [styles.onlyIcon]: !shouldShowText,
    }),
    disabled,
    onClick: e => {
      if (showViewLockModal) {
        expandViewLock(activeView.id);
        return;
      }
      onClick?.(e);
    },
    prefixIcon: icon,
    id,
    size: 'small',
    'data-test-id': id,
    style: { pointerEvents: disabled ? 'none' : 'auto', marginRight: shouldShowText ? 8 : 0 },
  };

  return (
    <WrapperTooltip wrapper={!shouldShowText && typeof text === 'string'} tip={typeof text === 'string' ? text : ''}>
      <span
        style={{
          cursor: disabled ? 'not-allowed' : 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: isMobile ? 0 : 'initial',
        }}
      >
        {isActive ? (
          <Button variant="jelly" color="primary" {...buttonProps}>
            {shouldShowText && text}
          </Button>
        ) : (
          <TextButton {...buttonProps}>{shouldShowText && text}</TextButton>
        )}
      </span>
    </WrapperTooltip>
  );
};
