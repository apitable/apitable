import { LinkButton, useThemeColors } from '@vikadata/components';
import { integrateCdnHost, Settings, Strings, t } from '@apitable/core';
import { Space } from 'antd';
import Image from 'next/image';
import { useQuery } from 'pc/hooks';
import { FC, useRef } from 'react';
// import OfficialAccount from 'static/icon/signin/signin_img_officialaccounts.png';
import videoPoster from 'static/icon/signin/signin_img_phone_cover.png';
import SlidingIcon from 'static/icon/signin/signin_img_phone_sliding.svg';
import { isDingtalkFunc, isLarkFunc, isQQFunc, isWechatFunc, isWecomFunc } from '../social_platform';
import { MobileAndAccountLogin } from './home_body/mobile_and_account_login';
import { QuickLogin } from './home_body/quick_login';
import { HomeFooter } from './home_footer';
import { HomeHeader } from './home_header';
import styles from './style.module.less';

const videoSrc = integrateCdnHost(Settings.introduction_video.value);

export const MobileHome: FC = () => {
  const colors = useThemeColors();
  const query = useQuery();
  const quickLogin = query.get('quickLogin') || 'on';
  const secondPageRef = useRef<HTMLDivElement>(null);
  // 判断是否是在指定的内置浏览器中，企业微信需要判断是否为专属域名
  const isQuickLogin = isWechatFunc() || isDingtalkFunc() || isQQFunc() || isLarkFunc() || isWecomFunc();

  const clickHandler = () => {
    const secondPageElement = secondPageRef.current;
    if (!secondPageElement) {
      return;
    }
    secondPageElement.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.mobileAndAccount}>
      <div className={styles.container}>
        <div className={styles.firstPage}>
          <div className={styles.top}>
            <HomeHeader />
            <div className={styles.loginContainer}>
              {(isQuickLogin && quickLogin === 'on') ?
                <QuickLogin /> :
                <MobileAndAccountLogin />
              }
            </div>
            <div className={styles.bottom}>
              {<HomeFooter />}
              <SlidingIcon className={styles.slidingBtn} onClick={clickHandler} />
            </div>
          </div>
        </div>
        <div className={styles.secondPage} ref={secondPageRef}>
          <video className={styles.video} controls poster={videoPoster as any as string}>
            <source src={videoSrc} type="video/mp4" />
            {t(Strings.nonsupport_video)}
          </video>
          <div className={styles.qrCodeWrapper}>
            <Space size={48} align="center" className={styles.qrCodeGroup}>
              <div className={styles.qrCode}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_PUBLIC_URL}/signin_img_communicationgroup_qrcode.png`}
                  alt="CommunicationGroup Code"
                  width={88} height={88}
                />
                <div className={styles.caption}>{t(Strings.communication_group_qrcode)}</div>
              </div>
              <div className={styles.qrCode}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_PUBLIC_URL}/signin_img_officialaccounts_qrcode.png`}
                  alt="OfficialAccount Code"
                  width={88} height={88}
                />
                <div className={styles.caption}>{t(Strings.official_account_qrcode)}</div>
              </div>
            </Space>
          </div>
          <div className={styles.icp}>
            <LinkButton className={styles.icpBtn} href={Settings['icp1'].value} underline={false} color={colors.fc3} target="_blank">
              {t(Strings.icp1)}
            </LinkButton>
            <div className={styles.line} />
            <LinkButton className={styles.icpBtn} href={Settings['icp2'].value} underline={false} color={colors.fc3} target="_blank">
              {t(Strings.icp2)}
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
};
