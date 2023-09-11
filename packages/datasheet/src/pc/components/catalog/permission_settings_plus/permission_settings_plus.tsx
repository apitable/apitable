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
import { FC, useState } from 'react';
import { useThemeColors, Tooltip } from '@apitable/components';
import { ConfigConstant, Strings, t } from '@apitable/core';
import { QuestionCircleOutlined } from '@apitable/icons';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { PermissionModalHeader } from 'pc/components/field_permission/permission_modal_header';
import { PermissionDescModal } from 'pc/components/space_manage/workbench/permission_desc';
import { getNodeIcon } from '../tree/node_icon';
import { Permission } from './permission';
import styles from './style.module.less';

export interface IPermissionSettingsProps {
  data: {
    nodeId: string;
    name: string;
    type: ConfigConstant.NodeType;
    icon: string;
  };
  visible: boolean;
  onClose: () => void;
}

export const PermissionSettingsPlus: FC<React.PropsWithChildren<IPermissionSettingsProps>> = ({ data, visible, onClose }) => {
  const [permDescModalVisible, setPermDescModalVisible] = useState(false);
  const colors = useThemeColors();

  if (!visible) {
    return <></>;
  }

  const Title = () => {
    return (
      <Tooltip content={t(Strings.instruction_of_node_permission)}>
        <span className={styles.helpBtn}>
          <QuestionCircleOutlined color={colors.textCommonTertiary} onClick={() => setPermDescModalVisible(true)} className={styles.infoIcon} />
        </span>
      </Tooltip>
    );
  };

  return (
    <>
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        {visible && (
          <Popup
            className={styles.permissionDrawer}
            height="90%"
            open={visible}
            placement="bottom"
            title={
              <PermissionModalHeader
                typeName={t(Strings.file)}
                targetName={data.name}
                targetIcon={getNodeIcon(data.icon, data.type, { normalColor: colors.textCommonTertiary })}
                docIcon={<Title />}
              />
            }
            onClose={() => onClose()}
            push={{ distance: 0 }}
            destroyOnClose
          >
            <Permission data={data} />
          </Popup>
        )}
      </ComponentDisplay>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        {visible && (
          <Modal
            visible
            title={
              <PermissionModalHeader
                typeName={t(Strings.file)}
                targetName={data.name}
                targetIcon={getNodeIcon(data.icon, data.type, { normalColor: colors.textCommonTertiary })}
                docIcon={<Title />}
              />
            }
            bodyStyle={{ padding: '0 0 24px 0' }}
            width={560}
            onCancel={onClose}
            destroyOnClose
            footer={null}
            className={classNames(styles.permissionModal, 'permission_setting_class')}
            centered
          >
            <>
              <Permission data={data} />
              {permDescModalVisible && <PermissionDescModal visible onCancel={() => setPermDescModalVisible(false)} />}
            </>
          </Modal>
        )}
      </ComponentDisplay>
    </>
  );
};
