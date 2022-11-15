import { ConfigConstant, integrateCdnHost, Settings, Strings, t } from '@apitable/core';
import { Button, colorVars, TextButton, Typography, useThemeColors } from '@apitable/components';
import { CloseMiddleOutlined, TitleFavoriteFilled } from '@apitable/icons';
import classnames from 'classnames';
import Image from 'next/image';
import { Emoji } from 'pc/components/common';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { goToUpgrade } from 'pc/components/subscribe_system';
import { isSaaSApp } from 'pc/components/subscribe_system/usage_warn_modal/utils';
import { stopPropagation } from 'pc/utils';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import styles from './styles.module.less';

interface IUsageWarnModalParams {
  alertContent: string;
  reload?: boolean;
}

const UsageWarnModalInner: React.FC<IUsageWarnModalParams> = ({
  alertContent, reload
}) => {
  const colors = useThemeColors();

  const renderAvatar = opacity => (
    <div className={styles.avatar} style={{ borderColor: `rgba(123, 103, 238, ${opacity})` }}>
      <div className={styles.avatarIcon}>
        <Image src={Settings.customer_qrcode_url.value} alt='' width={64} height={64} />
      </div>
      <div className={styles.avatarStar}>
        <TitleFavoriteFilled color={colors.fc14} size='12px' />
      </div>
    </div>
  );

  const renderQrCode = size => (
    <div className={styles.qrCodeImage} style={{ width: size, height: size }}>
      <div className={styles.qrCodeImageCorner} />
      <div className={styles.qrCodeImageCorner} />
      <div className={styles.qrCodeImageCorner} />
      <div className={styles.qrCodeImageCorner} />
      <Image width={size - 20} height={size - 20} src={integrateCdnHost(Settings.pay_contact_us.value)} />
    </div>
  );

  const _goToUpgrade = () => {
    goToUpgrade();
    reload && location.reload();
  };

  const _viewDetail = ()=>{
    window.open('/pricing', '_blank', 'noopener,noreferrer');
    reload && location.reload();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.pageLeft}>
        {renderAvatar(0.3)}
        <Typography variant='h5' className={classnames(styles.textCenter, styles.alertTitle)}>
          {t(Strings.usage_overlimit_alert_title)}
        </Typography>
        <Typography variant='h5' className={classnames(styles.textCenter, styles.alertContent)}>
          {alertContent}
        </Typography>
        <Button color='primary' size={'middle'} className={styles.upgradeBtn} onClick={_goToUpgrade} block>
          <span style={{ position: 'relative', top: 3 }}>
            <Emoji emoji={'star2'} set='apple' size={ConfigConstant.CELL_EMOJI_SIZE} />
          </span>
          <span style={{ position: 'relative', left: 3 }}>{t(Strings.upgrade_now)}</span>
        </Button>
        {
          isSaaSApp() && <TextButton
            color='default'
            className={styles.checkMorePrivileges}
            onClick={_viewDetail}
            block
          >
            {t(Strings.check_more_privileges)}
          </TextButton>
        }
      </div>
      <div className={styles.pageRight}>
        <div className={styles.qrCodeImageContentBorder}>
          <Typography variant='h6' className={styles.qrCodeImageTip}>
            {t(Strings.startup_company_support_program)}
          </Typography>
          <Typography variant='body3' className={styles.qrCodeImageSubTip}>
            {t(Strings.contact_us_to_join_company_support)}
          </Typography>
          {renderQrCode(194)}
        </div>
      </div>
    </div>
  );
};

export const usageWarnModal = (params: IUsageWarnModalParams) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  const onModalClose = () => {
    root.unmount();
    container.parentElement!.removeChild(container);
    params.reload && location.reload();
  };

  root.render(
    <div onMouseDown={stopPropagation}>
      <Modal
        visible
        wrapClassName={styles.modalWrapper}
        maskClosable={false}
        closeIcon={<CloseMiddleOutlined color={colorVars.fc3} size={8} />}
        onCancel={onModalClose}
        destroyOnClose
        width='720px'
        footer={null}
        centered
        zIndex={1100}
      >
        <UsageWarnModalInner {...params} />
      </Modal>
    </div>,
  );
};

