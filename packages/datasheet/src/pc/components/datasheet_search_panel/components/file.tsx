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
import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import { ConfigConstant } from '@apitable/core';
import { DatasheetOutlined, MirrorOutlined, FormOutlined, DashboardOutlined, AutomationOutlined } from '@apitable/icons';
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

export const FormSearchItem: React.FC<
    React.PropsWithChildren<{
        disable?: { budget: string; message: string };
        active?: boolean;
        id: string;
        onClick?: (id: string) => void;
        richContent?: boolean;
        isMirror?: boolean;
    }>
> = (props) => {
  const colors = useThemeColors();
  const { children, disable, id, onClick, richContent, active, isMirror } = props;
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
          <FormOutlined className={styles.leftIcon} color={active ? colors.primaryColor : colors.fourthLevelText} />

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
