import { lightColors, LinkButton } from '@vikadata/components';
import { isPrivateDeployment, Strings, t } from '@vikadata/core';
import { ShareQrcodeOutlined, WorkbenchLargeOutlined } from '@vikadata/icons';
import { useToggle } from 'ahooks';
import { PhoneAndEmailLogin } from 'pc/components/home/login/phone_and_email_login';

import { ScanLogin } from 'pc/components/home/login/scan_login';
import { isRenderServer } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';

import styles from './style.module.less';

const initToggle = (): boolean => {
  const preference = !process.env.SSR && localStorage.getItem('vika-login-preference');

  if (!preference) return true;

  return preference === 'scan' && !isPrivateDeployment();
};

export const LoginToggle = (): JSX.Element => {
  const env = getEnvVariables();
  const [isScanLogin, { toggle }] = useToggle(env.CLOUD_DISABLE_SCAN_CODE_TO_LOGIN ? false : initToggle());
  const onToggle = () => {
    localStorage.setItem('vika-login-preference', isScanLogin ? 'phone-and-email' : 'scan');

    toggle();
  };

  return (
    <>
      <div onClick={() => onToggle()} className={styles.toggler}>
        {
          !isRenderServer() && <div className={styles.toggleTextWrapper}>
            {isScanLogin ? (
              <LinkButton
                underline={false}
                component='button'
                prefixIcon={<WorkbenchLargeOutlined color={lightColors.deepPurple[500]} />}
                color={lightColors.deepPurple[500]}
                style={{ padding: 0 }}
              >
                {t(Strings.phone_email_login)}
              </LinkButton>
            ) : (
              !env.CLOUD_DISABLE_SCAN_CODE_TO_LOGIN && <LinkButton
                underline={false}
                component='button'
                prefixIcon={<ShareQrcodeOutlined color={lightColors.deepPurple[500]} />}
                color={lightColors.deepPurple[500]}
                style={{ padding: 0 }}
              >
                {t(Strings.scan_to_login)}
              </LinkButton>
            )}
          </div>
        }
      </div>
      <div className={styles.toggleTitle}>{!isScanLogin ? t(Strings.phone_email_login) : t(Strings.scan_to_login)}</div>
      {isScanLogin ? <ScanLogin /> : (
        <div className={styles.phoneAndEmailContainer}>
          <PhoneAndEmailLogin />
        </div>
      )}
    </>
  );
};
