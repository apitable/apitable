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

import { Collapse, Row, Col } from 'antd';
import classNames from 'classnames';
import { FC } from 'react';
import * as React from 'react';
import { colorVars } from '@apitable/components';
import { t, Strings } from '@apitable/core';
import { CheckOutlined, QuestionCircleOutlined, TriangleRightFilled } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { IModalProps } from 'pc/components/common/modal/modal/modal.interface';
import { hexToRGB } from 'pc/utils';
import styles from './style.module.less';

const { Panel } = Collapse;

interface ITagProps {
  text: string;
  color?: string;
}

const colorArr = [colorVars.rc02, colorVars.rc01, colorVars.successColor, colorVars.rc07];

const tagTitles = [
  { text: `${t(Strings.space)}/${t(Strings.share_permisson_model_node_owner)}`, color: colorArr[0] },
  { text: t(Strings.can_control), color: colorArr[1] },
  { text: t(Strings.can_edit), color: colorArr[2] },
  { text: t(Strings.can_updater), color: colorArr[0] },
  { text: t(Strings.can_read), color: colorArr[3] },
];

interface IPermissionDescProps {
  style?: React.CSSProperties;
}

export const PermissionDesc: FC<React.PropsWithChildren<IPermissionDescProps>> = ({ style }) => {
  const renderTag = (arr: ITagProps[]) => {
    if (!arr.length) {
      return;
    }
    return arr.map((item) => {
      const baseStyle = {
        background: hexToRGB(item.color || colorVars.rowSelectedBg, item.color ? 0.1 : 0.6),
        color: item.color || colorVars.secondLevelText,
      };
      return (
        <div className={styles.titleTag} style={baseStyle} key={item.text}>
          {item.text}
        </div>
      );
    });
  };
  const renderCollapse = () => {
    let config;
    try {
      config = JSON.parse(t(Strings.permission_config_in_workbench_page));
    } catch (e) {
      console.warn(e);
    }

    if (!config) {
      return;
    }
    return config.map((per: any) => {
      const { title, detail, key } = per;
      return (
        <Panel
          header={
            <div className={styles.panelHeader}>
              <TriangleRightFilled />
              {title}
            </div>
          }
          key={key}
        >
          {detail.map((item: any) => (
            <Row className={styles.perItem} key={item.title}>
              <Col span={7} className={styles.perItemLeft}>
                {item.title}
              </Col>
              <Col span={17} className={classNames(styles.tagTitleRight, styles.perItemRight)}>
                <CheckOutlined color={item.permissions.includes(0) ? colorArr[0] : colorVars.lineColor} />
                <CheckOutlined color={item.permissions.includes(1) ? colorArr[1] : colorVars.lineColor} />
                <CheckOutlined color={item.permissions.includes(2) ? colorArr[2] : colorVars.lineColor} />
                <CheckOutlined color={item.permissions.includes(3) ? colorArr[0] : colorVars.lineColor} />
                <CheckOutlined color={item.permissions.includes(4) ? colorArr[3] : colorVars.lineColor} />
              </Col>
            </Row>
          ))}
        </Panel>
      );
    });
  };
  return (
    <div className={styles.permissionDesc} style={style}>
      <Row>
        <Col span={7}>{renderTag([{ text: t(Strings.function) }])}</Col>
        <Col span={17} className={styles.tagTitleRight}>
          {renderTag(tagTitles)}
        </Col>
      </Row>
      <div className={styles.collapse}>
        <Collapse ghost bordered={false} defaultActiveKey={[0, 1]}>
          {renderCollapse()}
        </Collapse>
      </div>
    </div>
  );
};

export const PermissionDescModal: FC<React.PropsWithChildren<IModalProps>> = (props) => {
  return (
    <Modal
      title={
        <div>
          <span>{t(Strings.view_permission_description)}</span>
          <Tooltip title={t(Strings.permission_setting_tip)}>
            <span>
              <a href={t(Strings.set_permission_modal_help)} target="_blank" rel="noreferror noreferrer" style={{ display: 'flex' }}>
                <QuestionCircleOutlined size={16} color={colorVars.thirdLevelText} />
              </a>
            </span>
          </Tooltip>
        </div>
      }
      maskClosable
      footer={null}
      width={876}
      centered
      className={styles.permissionDescModal}
      destroyOnClose
      {...props}
    >
      <div className={styles.body}>
        <PermissionDesc />
      </div>
    </Modal>
  );
};
