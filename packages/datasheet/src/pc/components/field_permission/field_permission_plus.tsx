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
import { Tooltip, useThemeColors, ThemeProvider } from '@apitable/components';
import { Selectors, Strings, t } from '@apitable/core';
import { QuestionCircleOutlined } from '@apitable/icons/dist/components';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { EnableFieldPermissionPlus } from 'pc/components/field_permission/enable_field_permission_plus';
import { IFieldPermissionProps } from 'pc/components/field_permission/interface';
import styles from 'pc/components/field_permission/styles.module.less';
import { getFieldTypeIcon } from 'pc/components/multi_grid/field_setting';
import { useAppSelector } from 'pc/store/react-redux';
import { PermissionModalHeader } from './permission_modal_header';

export const FieldPermissionPlus: React.FC<React.PropsWithChildren<IFieldPermissionProps>> = (props) => {
  const colors = useThemeColors();
  const { field, onModalClose } = props;
  const theme = useAppSelector(Selectors.getTheme);

  const Main = () => {
    return <>{<EnableFieldPermissionPlus {...props} />}</>;
  };

  const Title = () => {
    return (
      <PermissionModalHeader
        typeName={t(Strings.column)}
        targetName={field.name}
        targetIcon={getFieldTypeIcon(field.type, colors.textCommonTertiary)}
        docIcon={
          <Tooltip content={t(Strings.field_permission_help_desc)}>
            <a href={t(Strings.field_permission_help_url)} target="_blank" className={styles.helpIcon} rel="noreferrer">
              <QuestionCircleOutlined color={colors.textCommonTertiary} className={styles.infoIcon} />
            </a>
          </Tooltip>
        }
      />
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <Modal
          className={classNames('permission_setting_class', styles.fieldPermissionModalWrap)}
          visible
          wrapClassName={styles.fieldPermissionModal}
          onCancel={onModalClose}
          destroyOnClose
          footer={null}
          centered
          width={560}
          bodyStyle={{ padding: '0 0 24px 0' }}
          title={<Title />}
        >
          <Main />
        </Modal>
      </ComponentDisplay>
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <Popup
          className={styles.permissionDrawer}
          height="90%"
          open
          placement="bottom"
          title={<Title />}
          onClose={() => onModalClose()}
          push={{ distance: 0 }}
          destroyOnClose
          bodyStyle={{ padding: '0 0 24px 0' }}
        >
          <Main />
        </Popup>
      </ComponentDisplay>
    </ThemeProvider>
  );
};
