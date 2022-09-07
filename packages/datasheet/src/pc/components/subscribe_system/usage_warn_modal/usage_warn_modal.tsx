import { Button, colorVars, LinkButton, Typography, useThemeColors } from '@vikadata/components';
import { ConfigConstant, integrateCdnHost, Settings, Strings, t } from '@vikadata/core';
import { CloseMiddleOutlined, TitleFavoriteFilled } from '@vikadata/icons';
import classnames from 'classnames';
import Image from 'next/image';
import { Emoji } from 'pc/components/common';
import { Modal } from 'pc/components/common/modal/modal';
import * as React from 'react';
import ReactDOM from 'react-dom';
import styles from './styles.module.less';
import { goToUpgrade } from 'pc/components/subscribe_system';

interface IUsageWarnModalParams {
  alertContent: string;
}

const UsageWarnModalInner: React.FC<IUsageWarnModalParams> = ({
  alertContent
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
        <Button color='primary' size={'middle'} className={styles.upgradeBtn} onClick={() => goToUpgrade()} block>
          <span style={{ position: 'relative', top: 3 }}>
            <Emoji emoji={'star2'} set='apple' size={ConfigConstant.CELL_EMOJI_SIZE} />
          </span>
          <span style={{ position: 'relative', left: 3 }}>{t(Strings.upgrade_now)}</span>
        </Button>
        <LinkButton
          color='default'
          className={styles.checkMorePrivileges}
          onClick={() => window.open('/pricing', '_blank', 'noopener,noreferrer')}
          underline={false}
          block
        >
          {t(Strings.check_more_privileges)}
        </LinkButton>
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
  const onModalClose = () => {
    ReactDOM.unmountComponentAtNode(container);
    container.parentElement!.removeChild(container);
  };

  ReactDOM.render(
    <Modal
      visible
      wrapClassName={styles.modalWrapper}
      closeIcon={<CloseMiddleOutlined color={colorVars.fc3} size={8} />}
      onCancel={onModalClose}
      destroyOnClose
      width='720px'
      footer={null}
      centered
    >
      <UsageWarnModalInner {...params} />
    </Modal>,
    container,
  );
};
