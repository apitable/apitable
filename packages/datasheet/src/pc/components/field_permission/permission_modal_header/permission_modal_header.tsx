import styles from './styles.module.less';
import { Typography, useThemeColors } from '@apitable/components';
import { TComponent } from 'pc/components/common/t_component';
import { t, Strings } from '@apitable/core';
import CloseIcon from 'static/icon/common/common_icon_close_large.svg';
import * as React from 'react';
import { useResponsive } from 'pc/hooks';
import { ScreenSize } from 'pc/components/common/component_display';

interface IPermissionModalHeaderProps {
  typeName: string;
  targetName: string;
  docIcon?: JSX.Element;
  onModalClose?(): void;
  targetIcon?: JSX.Element;
}

export const PermissionModalHeader: React.FC<IPermissionModalHeaderProps> = props => {
  const colors = useThemeColors();
  const { typeName, targetName, targetIcon, onModalClose, docIcon } = props;

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  return (
    <div className={styles.modalHeader}>
      <div className={styles.leftWrapper}>
        <Typography variant={'body1'} component={'span'} className={styles.text}>
          <TComponent
            tkey={t(Strings.set_permission_modal_title)}
            params={{
              name: (
                <span className={styles.targetClx}>
                  {targetIcon}
                  <Typography variant={'h6'} component={'span'} ellipsis style={{ flex: 1, maxWidth: isMobile ? 95 : 270 }}>
                    {targetName}
                  </Typography>
                </span>
              ),
              type: typeName,
            }}
          />
        </Typography>
        {docIcon}
      </div>
      {onModalClose && <CloseIcon fill={colors.fourthLevelText} onClick={onModalClose} width={24} height={24} />}
    </div>
  );
};
