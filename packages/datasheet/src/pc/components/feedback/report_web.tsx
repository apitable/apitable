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

import RcTrigger from 'rc-trigger';
import { FC, useState } from 'react';
import { Strings, t } from '@apitable/core';
import { AdviseOutlined, AlarmOutlined, QuestionCircleOutlined, QuestionOutlined } from '@apitable/icons';
import { ButtonPlus, ContextmenuItem, MobileContextMenu, Modal } from 'pc/components/common';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { getEnvVariables } from 'pc/utils/env';
import JoinCommunityIcon from 'static/icon/common/group.svg';
import { ComponentDisplay, ScreenSize } from '../common/component_display';
import { ReportReason } from './report_reason';
import styles from './style.module.less';

interface IReportWeb {
  nodeId: string;
}

export const ReportWeb: FC<React.PropsWithChildren<IReportWeb>> = ({ nodeId }) => {
  /** Control menu display */
  const [menuVisible, setMenuVisible] = useState(false);
  /** Control the display of the modal box for filling in the reason for reporting */
  const [reasonModalVisible, setReasonModalVisible] = useState(false);
  const isFeishu = navigator.userAgent.toLowerCase().indexOf('lark') > -1;
  // import { IContextMenuData } from '@apitable/components'; 'error'
  const menuData: any[] = [
    [
      {
        icon: <AdviseOutlined />,
        text: t(Strings.vomit_a_slot),
        onClick: () => navigationToUrl(getEnvVariables().USER_FEEDBACK_FORM_URL),
      },
      {
        icon: <QuestionCircleOutlined />,
        text: t(Strings.help_center),
        onClick: () => navigationToUrl(t(Strings.help_help_center_url)),
      },
      {
        icon: <AlarmOutlined />,
        text: t(Strings.inform),
        onClick: () => setReasonModalVisible(true),
      },
      {
        icon: <JoinCommunityIcon />,
        text: t(Strings.join_the_community),
        onClick: () => navigationToUrl(isFeishu ? `${window.location.origin}/feishu/` : getEnvVariables().USER_FEEDBACK_FORM_URL),
      },
    ],
  ];

  const renderMenu = () => {
    return (
      <div className={styles.feedbackMenu}>
        <div onClick={() => setMenuVisible(false)}>
          {menuData[0].map((item: any, index: number) => (
            <ContextmenuItem key={index} name={item.text} icon={item.icon} onClick={item.onClick} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.reportWeb}>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <RcTrigger
          action="click"
          popup={renderMenu()}
          destroyPopupOnHide
          popupAlign={{
            points: ['br', 'bl'],
            offset: [-10, 0],
          }}
          popupStyle={{ width: '240px' }}
          popupVisible={menuVisible}
          onPopupVisibleChange={(visible) => setMenuVisible(visible)}
          zIndex={1000}
        >
          <ButtonPlus.Font onClick={() => setMenuVisible(true)} className={styles.feedbackBtn} icon={<QuestionOutlined />} size="small" shadow />
        </RcTrigger>
        {reasonModalVisible && <ReportReason nodeId={nodeId} onClose={() => setReasonModalVisible(false)} />}
      </ComponentDisplay>
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <MobileContextMenu title={t(Strings.help)} visible={menuVisible} height="50%" data={menuData} onClose={() => setMenuVisible(false)} />
        <ButtonPlus.Font onClick={() => setMenuVisible(true)} className={styles.feedbackBtn} icon={<QuestionOutlined />} size="small" shadow />
        {reasonModalVisible && (
          <Modal className={styles.reasonModal} onCancel={() => setReasonModalVisible(false)} centered footer={null} visible>
            <ReportReason nodeId={nodeId} onClose={() => setReasonModalVisible(false)} />
          </Modal>
        )}
      </ComponentDisplay>
    </div>
  );
};
