import classNames from 'classnames';
import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import { ConfigConstant } from '@apitable/core';
import { AutomationOutlined, DashboardOutlined, DatasheetOutlined, FormOutlined, MirrorOutlined } from '@apitable/icons';
import { WrapperTooltip } from 'pc/components/widget/widget_panel/widget_panel_header';
import styles from './style.module.less';

const Budget: React.FC<React.PropsWithChildren<unknown>> = (props) => {
  return <div className={styles.budget}>{props.children}</div>;
};

export const File: React.FC<
  React.PropsWithChildren<{
    disable?: { budget: string; message: string };
    active?: boolean;
    id: string;
    onClick?: (id: string) => void;
    richContent?: boolean;
    nodeType: ConfigConstant.NodeType;
  }>
> = (props) => {
  const colors = useThemeColors();
  const { children, disable, id, onClick, richContent, active } = props;

  const renderIcon = () => {
    switch (props.nodeType) {
      case ConfigConstant.NodeType.AUTOMATION:
        return <AutomationOutlined className={styles.leftIcon} color={active ? colors.primaryColor : colors.fourthLevelText} />;
      case ConfigConstant.NodeType.DASHBOARD:
        return <DashboardOutlined className={styles.leftIcon} color={active ? colors.primaryColor : colors.fourthLevelText} />;
      case ConfigConstant.NodeType.FORM:
        return <FormOutlined className={styles.leftIcon} color={active ? colors.primaryColor : colors.fourthLevelText} />;
      case ConfigConstant.NodeType.MIRROR:
        return <MirrorOutlined className={styles.leftIcon} color={active ? colors.primaryColor : colors.fourthLevelText} />;
      default:
        return <DatasheetOutlined className={styles.leftIcon} color={active ? colors.primaryColor : colors.fourthLevelText} />;
    }
  };

  return (
    <WrapperTooltip wrapper={Boolean(disable)} tip={disable ? disable.message : ''} style={{ display: 'block' }}>
      <div className={styles.nodeContainerWrapper}>
        <div
          className={classNames(styles.nodeContainer, {
            [styles.disable]: Boolean(disable),
            [styles.active]: active,
          })}
          onClick={() => !disable && onClick && onClick(id)}
        >
          {renderIcon()}

          {richContent ? (
            <span className={styles.text} dangerouslySetInnerHTML={{ __html: children as string }} />
          ) : (
            <span className={styles.text}>{children}</span>
          )}
          {disable && <Budget>{disable.budget}</Budget>}
        </div>
      </div>
    </WrapperTooltip>
  );
};
