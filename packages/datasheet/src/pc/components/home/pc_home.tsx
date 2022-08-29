import { ButtonGroup, lightColors, LinkButton } from '@vikadata/components';
import { AutoTestID, getCustomConfig, isIdassPrivateDeployment, isPrivateDeployment, Navigation, Settings, Strings, t } from '@vikadata/core';
import { Space } from 'antd';
import Image from 'next/image';

import { Logo } from 'pc/components/common';
import { LoginToggle } from 'pc/components/home/login_toggle';
import { isDingtalkFunc, isLarkFunc, isQQFunc, isWechatFunc, isWecomFunc } from 'pc/components/home/social_platform';
import { isRenderServer } from 'pc/utils';
import { isMobileApp } from 'pc/utils/env';
import { FC } from 'react';
import { useSelector } from 'react-redux';

import ConsultImg from 'static/icon/signin/signin_img_homepage.png';
import BackgroundLeft from 'static/icon/signin/signin_img_homepage_bj_left.png';
import BackgroundRight from 'static/icon/signin/signin_img_homepage_bj_right.png';
import TemplateIcon from 'static/icon/workbench/catalogue/template.svg';

import { Method, useNavigation } from '../route_manager/use_navigation';
import { IntroductionVideo } from './introduction_video';
import { Login } from './login';
import { PcSsoIdaasHome } from './pc_sso_idaas_home';

import styles from './style.module.less';

const PcHome: FC = () => {
  const isWecom = useSelector(state => state.space.envs?.weComEnv?.enabled || isWecomFunc());

  const navigationTo = useNavigation();

  const { siteUrl, introduceVideoDisable } = getCustomConfig();

  const jumpOfficialWebsite = () => {
    if (siteUrl) {
      window.open(siteUrl, '__blank');
      return;
    }
    navigationTo({ path: Navigation.HOME, method: Method.NewTab, query: { home: 1 }});
  };

  return (
    <>
      {isIdassPrivateDeployment() ? <PcSsoIdaasHome /> :
        <>
          <span className={styles.backgroundLeft}>
            <Image src={BackgroundLeft} alt="background left" layout={'fill'} objectFit={'contain'} />
          </span>
          <div className={styles.homeLeft}>
            <div>
              <div className={styles.logo} onClick={jumpOfficialWebsite}>
                {isPrivateDeployment() ? (
                  <span
                    className={styles.logoPng}
                    onClick={jumpOfficialWebsite}
                    style={{
                      height: 36
                    }}
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_PUBLIC_URL}/common_img_logo.png`}
                      alt="vika_logo"
                      width={32}
                      height={32}
                    />
                  </span>

                ) :
                  (
                    <span
                      className={styles.logoPng}>
                      <Logo size="large" />
                    </span>
                  )
                }
                <div className={styles.logoSlogan}>{t(Strings.login_logo_slogan)}</div>
              </div>
              <div className={styles.placeholder} />
              {!introduceVideoDisable &&
                <div className={styles.video}>
                  <IntroductionVideo />
                </div>
              }
            </div>
            <div className={styles.bottom}>
              <span className={styles.consultImg}>
                <Image src={ConsultImg} alt="consult" layout={'responsive'} />
              </span>
              <Space size={55} align="start" className={styles.qrCodeGroup}>
                <div className={styles.qrCode}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_PUBLIC_URL}/signin_img_communicationgroup_qrcode.png`} alt="CommunicationGroup Code"
                    width={80}
                    height={80}
                  />
                  <div className={styles.caption}>{t(Strings.communication_group_qrcode)}</div>
                </div>
                <div className={styles.qrCode}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_PUBLIC_URL}/signin_img_officialaccounts_qrcode.png`} alt="OfficialAccount Code"
                    width={80}
                    height={80}
                  />
                  {!isPrivateDeployment() && <div className={styles.caption}>{t(Strings.official_account_qrcode)}</div>}
                </div>
              </Space>
            </div>
          </div>
          <div className={styles.homeRight}>
            <span className={styles.backgroundRight}>
              <Image src={BackgroundRight} alt="background right" layout={'fill'} objectFit={'contain'} />
            </span>

            <div className={styles.nav}>
              {
                !isRenderServer() && <ButtonGroup withSeparate>
                  {!isPrivateDeployment() && (
                    <>
                      <LinkButton
                        component="button"
                        underline={false}
                        style={{ color: lightColors.black[500] }}
                      >
                        <a href={Settings.private_deployment_form.value} target="_blank" style={{ color: 'inherit' }} rel="noreferrer">
                          {t(Strings.self_hosting)}
                        </a>
                      </LinkButton>
                      <LinkButton
                        component="button"
                        underline={false}
                        style={{ color: lightColors.black[500] }}
                      >
                        <a href={'/chatgroup/'} target="_blank" style={{ color: 'inherit' }} rel="noreferrer">{t(Strings.feedback)}</a>
                      </LinkButton>
                    </>
                  )}
                  <LinkButton
                    component="button"
                    underline={false}
                    style={{ color: lightColors.black[500] }}
                  >
                    <a href="/help/" target="_blank" style={{ color: 'inherit' }}>{t(Strings.support)}</a>
                  </LinkButton>
                  <LinkButton
                    component="button"
                    underline={false}
                    onClick={jumpOfficialWebsite}
                    style={{ color: lightColors.black[500] }}
                  >
                    {t(Strings.enter_official_website)}
                  </LinkButton>
                </ButtonGroup>
              }
            </div>
            <div className={styles.homeContent}>
              <div className={styles.loginContainer} id={AutoTestID.LOGIN}>
                {isWecom || isWechatFunc() || isDingtalkFunc() || isQQFunc() || isLarkFunc() || isMobileApp() || isPrivateDeployment()
                  ? <Login />
                  : <LoginToggle />
                }
              </div>
              <div className={styles.templateBtn} onClick={() => navigationTo({ path: Navigation.TEMPLATE, method: Method.NewTab })}>
                <TemplateIcon />{t(Strings.massive_template)}
              </div>
            </div>
            {
              !isRenderServer() && <div className={styles.icp}>
                <LinkButton className={styles.icpBtn} href={Settings['icp1'].value} underline={false} color={lightColors.black[500]} target="_blank">
                  {t(Strings.icp1)}
                </LinkButton>
                <div className={styles.line} />
                <LinkButton className={styles.icpBtn} href={Settings['icp2'].value} underline={false} color={lightColors.black[500]} target="_blank">
                  {t(Strings.icp2)}
                </LinkButton>
              </div>
            }
          </div>
        </>
      }
    </>

  );
};

export default PcHome;
