import { IFieldPermissionProps } from 'pc/components/field_permission/interface';
import { EnableFieldPermissionPlus } from 'pc/components/field_permission/enable_field_permission_plus';
import { Selectors, Strings, t } from '@vikadata/core';
import { Modal } from 'pc/components/common/modal/modal';
import styles from 'pc/components/field_permission/styles.module.less';
import { black, Tooltip, useThemeColors, ThemeProvider } from '@vikadata/components';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { getFieldTypeIcon } from 'pc/components/multi_grid/field_setting';
import { PermissionModalHeader } from './permission_modal_header';
import { InformationSmallOutlined } from '@vikadata/icons/dist/components';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

export const FieldPermissionPlus: React.FC<IFieldPermissionProps> = props => {
  const colors = useThemeColors();
  const { field, onModalClose } = props;
  const theme = useSelector(Selectors.getTheme);

  const Main = () => {
    return <>{<EnableFieldPermissionPlus {...props} />}</>;
  };

  const Title = () => {
    return (
      <PermissionModalHeader
        typeName={t(Strings.column)}
        targetName={field.name}
        targetIcon={getFieldTypeIcon(field.type, black['500'])}
        docIcon={
          <Tooltip content={t(Strings.field_permission_help_desc)}>
            <a href={t(Strings.field_permission_help_url)} className={styles.helpIcon}>
              <InformationSmallOutlined color={colors.thirdLevelText} className={styles.infoIcon} />
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
          visible
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
