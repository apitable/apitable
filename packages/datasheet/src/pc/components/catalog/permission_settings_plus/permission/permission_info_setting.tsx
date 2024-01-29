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

import { Dropdown } from 'antd';
import classNames from 'classnames';
import { useState } from 'react';
import { Box, LinkButton, TextButton, Typography, useThemeColors } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { ChevronDownOutlined, ChevronUpOutlined, LockOutlined, UserGroupOutlined } from '@apitable/icons';
import { ScreenSize } from 'pc/components/common/component_display';
import { Popconfirm } from 'pc/components/common/popconfirm';
import { useResponsive } from 'pc/hooks';
import { Menu, MenuItem } from './menu';
import { IRoleOption } from './unit_item/interface';
import { PermissionSelectMobile } from './unit_item/permission_select_mobile';
import styles from './style.module.less';

export const PermissionInfoSetting: React.FC<
  React.PropsWithChildren<{
    isExtend?: boolean;
    totalMember: number;
    defaultRole: IRoleOption[];
    className?: string;
    readonly?: boolean;
    tipOptions: {
      extendTips: string;
      resetPopConfirmTitle: string;
      resetPopConfirmContent: string;
      resetPermissionDesc: string;
    };
    resetPermission: () => void;
    toggleIsMemberDetail: () => void;
    batchEditRole?: (role: string) => void;
    batchDeleteRole?: () => void;
  }>
> = (props) => {
  const {
    isExtend,
    totalMember,
    defaultRole,
    className,
    tipOptions,
    readonly,
    batchEditRole,
    resetPermission,
    toggleIsMemberDetail,
    batchDeleteRole,
  } = props;
  const colors = useThemeColors();
  const [resetPermissionConfirm, setResetPermissionConfirm] = useState<boolean>();

  const { extendTips, resetPopConfirmContent, resetPopConfirmTitle, resetPermissionDesc } = tipOptions;

  return (
    <div className={classNames(styles.permissionInfoSetting, className)}>
      {/* Description of current authority */}
      <div className={styles.tipContainer}>
        {isExtend ? (
          <Box>
            <UserGroupOutlined className={styles.tipIcon} color={colors.textCommonTertiary} />
            <Typography variant="body3" className={styles.tip} color={colors.textCommonSecondary}>
              {extendTips}
            </Typography>
          </Box>
        ) : (
          <div className={styles.hasSettingBox}>
            <LockOutlined className={styles.hasSettingIcon} color={colors.textBrandDefault} />
            <div>
              {resetPermissionDesc}
              {!readonly && (
                <Popconfirm
                  title={resetPopConfirmTitle}
                  content={resetPopConfirmContent}
                  visible={resetPermissionConfirm}
                  onCancel={() => {
                    setResetPermissionConfirm(false);
                  }}
                  trigger={'click'}
                  onOk={() => {
                    setResetPermissionConfirm(false);
                    resetPermission();
                  }}
                  type="warning"
                  onVisibleChange={setResetPermissionConfirm}
                >
                  <a id="resetPermissionButton">{t(Strings.reset_permission_default)}</a>
                </Popconfirm>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Batch settings */}
      <div className={styles.settingLine}>
        <div className={styles.viewByPersonBtn} onClick={() => toggleIsMemberDetail()}>
          <Typography variant="body3" color={colors.textCommonSecondary}>
            {t(Strings.share_and_permission_member_detail, {
              count: totalMember,
            })}
          </Typography>
        </div>
        {!readonly && <BatchSetting onClick={batchEditRole} onRemove={batchDeleteRole} defaultRole={defaultRole} />}
      </div>
    </div>
  );
};

const BatchSetting = (props: { defaultRole: IRoleOption[]; onClick?: (role: string) => void; onRemove?: () => void }) => {
  const { onClick, onRemove, defaultRole } = props;
  const [batchSelectVisible, setBatchSelectVisible] = useState<boolean>();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const colors = useThemeColors();

  const buttonIconColor = colors.black[500];

  if (isMobile) {
    return (
      <PermissionSelectMobile
        role={''}
        unitId={''}
        roleOptions={defaultRole}
        title={t(Strings.batch_edit_permission)}
        onChange={(_unitId, value) => onClick && onClick(value)}
        onRemove={onRemove}
      >
        <LinkButton
          component="div"
          underline={false}
          suffixIcon={batchSelectVisible ? <ChevronUpOutlined color={buttonIconColor} /> : <ChevronDownOutlined color={buttonIconColor} />}
          color={colors.firstLevelText}
        >
          {t(Strings.batch_edit_permission)}
        </LinkButton>
      </PermissionSelectMobile>
    );
  }

  return (
    <Dropdown
      trigger={['click']}
      overlay={
        <div style={{ maxWidth: '240px' }}>
          <Menu onClick={() => setBatchSelectVisible(false)}>
            {defaultRole.map((v) => (
              <MenuItem key={v.value} item={v} onClick={onClick} />
            ))}
            {onRemove && (
              <MenuItem
                className={styles.batchDeleteItem}
                item={{ label: t(Strings.remove_role), value: 'remove' }}
                option={{ labelColor: colors.textDangerDefault }}
                onClick={onRemove}
              >
                {t(Strings.remove_role)}
              </MenuItem>
            )}
          </Menu>
        </div>
      }
      visible={batchSelectVisible}
      onVisibleChange={setBatchSelectVisible}
    >
      <TextButton
        size="small"
        suffixIcon={batchSelectVisible ? <ChevronUpOutlined size={12} /> : <ChevronDownOutlined size={12} />}
        style={{
          fontSize: 13,
        }}
      >
        {t(Strings.batch_edit_permission)}
      </TextButton>
    </Dropdown>
  );
};
