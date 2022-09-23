import { FC } from 'react';
import InfoIcon from 'static/icon/common/common_icon_information.svg';
import { Checkbox } from 'antd';
import { Strings, t, IReduxState } from '@vikadata/core';
import styles from './style.module.less';
import { Tooltip } from 'pc/components/common';
import { useSelector } from 'react-redux';
import { isSocialDingTalk, isSocialPlatformEnabled, isSocialWecom } from 'pc/components/home/social_platform';

interface IPermissionCardProps {
  defaultChecked?: string[];
  checked?: string[];
  onChange?: (value: string, checked: boolean) => void;
  inRead?: boolean;
}

export const PermissionCard: FC<IPermissionCardProps> = ({ defaultChecked, checked, onChange, inRead }) => {
  const spaceInfo = useSelector((state: IReduxState) => state.space.curSpaceInfo);

  const onCheckChange = (value: string, checked: boolean) => {
    if (onChange) {
      onChange(value, checked);
    }
  };
  const checkData = [
    {
      title: t(Strings.add_sub_admin_title_workbench),
      key: 'workbench',
      desc: t(Strings.add_sub_admin_workbench_configuration),
      checkList: [
        {
          name: t(Strings.role_permission_manage_workbench),
          value: 'MANAGE_WORKBENCH',
          disabled: false,
        },
      ],
    },
    {
      title: t(Strings.add_sub_admin_title_member_team),
      desc: t(Strings.add_sub_admin_contacts_configuration),
      key: 'address',
      checkList: [
        {
          name: t(Strings.role_permission_manage_team),
          value: 'MANAGE_TEAM',
          disabled: !spaceInfo || (isSocialPlatformEnabled(spaceInfo) && !isSocialDingTalk(spaceInfo) && !isSocialWecom(spaceInfo)),
        },
        {
          name: t(Strings.role_permission_manage_member),
          value: 'MANAGE_MEMBER',
          disabled: !spaceInfo || (isSocialPlatformEnabled(spaceInfo) && !isSocialDingTalk(spaceInfo) && !isSocialWecom(spaceInfo)),
        },
        {
          name: t(Strings.role_permission_manage_role),
          value: 'MANAGE_ROLE',
          disabled: !spaceInfo || (isSocialPlatformEnabled(spaceInfo) && !isSocialDingTalk(spaceInfo) && !isSocialWecom(spaceInfo)),
        },
      ],
    },
    {
      title: t(Strings.company_security),
      desc: t(Strings.add_sub_admin_permissions_configuration),
      key: 'security',
      checkList: [
        {
          name: t(Strings.role_permission_manage_security),
          value: 'MANAGE_SECURITY',
          disabled: false,
        },
      ],
    },
    {
      title: t(Strings.more_setting),
      desc: t(Strings.more_setting_tip),
      key: 'shelfManage',
      checkList: [
        {
          name: t(Strings.manage_template_center),
          value: 'MANAGE_TEMPLATE',
          disabled: false,
        },
        {
          name: t(Strings.manage_widget_center),
          value: 'MANAGE_WIDGET',
          disabled: false,
        },
      ],
    },
  ];

  return (
    <div className={styles.cardWrap}>
      {checkData.map(item => (
        <div className={styles.permissionCard} key={item.key}>
          <div className={styles.title}>
            <span>{item.title}</span>
            <Tooltip title={item.desc} placement="top" trigger="click" showTipAnyway>
              <span>
                <InfoIcon />
              </span>
            </Tooltip>
          </div>
          <div className={styles.checkboxWrap}>
            {item.checkList.map(item => (
              <div className={styles.checkboxItem} key={item.value}>
                <Checkbox
                  onChange={e => onCheckChange(e.target.value, e.target.checked)}
                  value={item.value}
                  defaultChecked={defaultChecked ? defaultChecked.includes(item.value) : undefined}
                  checked={checked ? checked.includes(item.value) : undefined}
                  disabled={Boolean(inRead || item.disabled)}
                >
                  {item.name.toString()}
                </Checkbox>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
