import { Button, Message } from '@vikadata/components';
import { DatasheetApi, Selectors, Strings, t } from '@apitable/core';
import Image from 'next/image';
import { triggerUsageAlert } from 'pc/common/billing';
import { Modal } from 'pc/components/common';
import { IDisabledPermission } from 'pc/components/field_permission/interface';
import styles from 'pc/components/field_permission/styles.module.less';
import * as React from 'react';
import { useSelector } from 'react-redux';
import permissionImage from 'static/icon/datasheet/datasheet_img_field_permission.png';

export const DisabledFieldPermission: React.FC<IDisabledPermission> = (props) => {
  const { setPermissionStatus, field } = props;
  const datasheetId = useSelector(state => state.pageParams.datasheetId)!;
  const views = useSelector(Selectors.getViewsList);
  const spaceInfo = useSelector(state => state.space.curSpaceInfo)!;

  const openFieldPermission = async() => {
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
        content: <>
          <div className={styles.warningUl}>
            <p>
              {t(Strings.field_permission_open_warning)}
            </p>
          </div>
        </>,
        onOk: openFieldPermission,
      });
      return;
    }
    openFieldPermission();
  };

  return <div className={styles.unOpenPermissionWrapper}>
    <div className={styles.lockIconWrapper}>
      <Image src={permissionImage} alt="" width={240} height={180} />
    </div>
    <p>
      {t(Strings.field_permission_open_tip)}
    </p>
    <Button
      color={'primary'}
      onClick={openPermission}
      style={{ width: 220 }}
    >
      {
        t(Strings.field_permission_open)
      }
    </Button>
  </div>;
};

