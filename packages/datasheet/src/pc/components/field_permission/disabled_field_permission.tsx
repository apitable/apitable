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

import Image from 'next/image';
import * as React from 'react';
import { Button, Message } from '@apitable/components';
import { DatasheetApi, Selectors, Strings, t } from '@apitable/core';
import { Modal } from 'pc/components/common';
import { IDisabledPermission } from 'pc/components/field_permission/interface';
import styles from 'pc/components/field_permission/styles.module.less';
import { useAppSelector } from 'pc/store/react-redux';
import permissionImage from 'static/icon/datasheet/datasheet_img_field_permission.png';
// @ts-ignore
import { triggerUsageAlert } from 'enterprise/billing';

export const DisabledFieldPermission: React.FC<React.PropsWithChildren<IDisabledPermission>> = (props) => {
  const { setPermissionStatus, field } = props;
  const datasheetId = useAppSelector((state) => state.pageParams.datasheetId)!;
  const views = useAppSelector(Selectors.getViewsList);
  const spaceInfo = useAppSelector((state) => state.space.curSpaceInfo)!;

  const openFieldPermission = async () => {
    const res = await DatasheetApi.setFieldPermissionStatus(datasheetId, field.id, true);
    const { success, message } = res.data;

    if (!success) {
      Message.warning({
        content: message,
      });
      return;
    }
    triggerUsageAlert('fieldPermissionNums', { usage: spaceInfo.fieldRoleNums + 1 });
    setPermissionStatus(true);
  };

  const openPermission = () => {
    const viewNames = views.reduce<string[]>((pre, view) => {
      if (pre.length >= 10) {
        return pre;
      }
      if (view.filterInfo || view.groupInfo || view.sortInfo) {
        pre.push(view.name);
      }
      return pre;
    }, []);

    if (viewNames.length) {
      Modal.confirm({
        type: 'warning',
        title: t(Strings.field_permission_open),
        content: (
          <>
            <div className={styles.warningUl}>
              <p>{t(Strings.field_permission_open_warning)}</p>
            </div>
          </>
        ),
        onOk: openFieldPermission,
      });
      return;
    }
    openFieldPermission();
  };

  return (
    <div className={styles.unOpenPermissionWrapper}>
      <div className={styles.lockIconWrapper}>
        <Image src={permissionImage} alt="" width={240} height={180} />
      </div>
      <p>{t(Strings.field_permission_open_tip)}</p>
      <Button color={'primary'} onClick={openPermission} style={{ width: 220 }}>
        {t(Strings.field_permission_open)}
      </Button>
    </div>
  );
};
