import { getCustomConfig, HomeId, Navigation, Strings, t } from '@apitable/core';
import { MobileDingdingFilled, MobileFeishuFilled, MobileQqFilled, MobileWechatFilled, MobileWecomFilled } from '@vikadata/icons';
import { Space } from 'antd';
import classnames from 'classnames';
import Image from 'next/image';
import { dingdingLogin, feishuLogin, qqLogin, wechatLogin, wecomLogin, wecomQuickLogin } from 'pc/components/home/other_login';
import { Router } from 'pc/components/route_manager/router';
import { useQuery } from 'pc/hooks';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import WelcomePng from 'static/icon/datasheet/datasheet_img_welcome.png';
import MobileIcon from 'static/icon/signin/signin_img_mobile_phone.svg';
import TemplateIcon from 'static/icon/workbench/catalogue/template.svg';
import { isDingtalkFunc, isLarkFunc, isQQFunc, isWechatFunc, isWecomFunc } from '../../../social_platform/utils';
import styles from './style.module.less';

export const QuickLogin: FC = () => {
  const query = useQuery();
  const isWecomDomain = useSelector(state => state.space.envs?.weComEnv?.enabled);
  const changeMobileMode = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const queryObj = {
      quickLogin: 'off',
    };
    for (const pair of searchParams.entries()) {
      queryObj[pair[0]] = pair[1];
    }
    Router.push(Navigation.LOGIN, { query: queryObj });
  };

  const renderQuickLoginBtn = () => {
    if (isWecomFunc()) {
      return (
        <div
          className={classnames(styles.btn, styles.wecom)}
          onClick={() => isWecomDomain ? wecomLogin() : wecomQuickLogin('snsapi_base', query.get('reference'))}
        >
          <MobileWecomFilled /><span className={styles.text}>{t(Strings.wecom_login)}</span>
        </div>
      );
    } else if (isWechatFunc()) {
      return (
        <div
          className={classnames(styles.btn, styles.wechat)}
          onClick={() => wechatLogin()}
          data-sensors-click
          id={HomeId.LOGIN_TYPE_WECHAT}
        >
          <MobileWechatFilled />
          <span className={styles.text}>{t(Strings.wechat_login)}</span>
        </div>
      );
    } else if (isDingtalkFunc()) {
      return (
        <div
          className={classnames(styles.btn, styles.dingding)}
          onClick={() => dingdingLogin()}
          data-sensors-click
          id={HomeId.LOGIN_TYPE_DINGDING}
        >
          <MobileDingdingFilled /><span className={styles.text}>{t(Strings.dingding_login)}</span>
        </div>
      );
    } else if (isQQFunc()) {
      return (
        <div
          className={classnames(styles.btn, styles.qq)}
          onClick={() => qqLogin()}
          data-sensors-click
          id={HomeId.LOGIN_TYPE_QQ}
        >
          <MobileQqFilled /><span className={styles.text}>{t(Strings.qq)}</span>
        </div>
      );
    } else if (isLarkFunc()) {
      return (
        <div
          className={classnames(styles.btn, styles.lark)}
          onClick={() => feishuLogin()}
          data-sensors-click
          id={HomeId.LOGIN_TYPE_LARK}
        >
          <MobileFeishuFilled /><span className={styles.text}>{t(Strings.lark_login)}</span>
        </div>
      );
    }
    return (
      <div
        className={classnames(styles.btn, styles.wechat)}
        onClick={() => wechatLogin()}
        data-sensors-click
        id={HomeId.LOGIN_TYPE_WECHAT}
      >
        <MobileWechatFilled /><span className={styles.text}>{t(Strings.wechat_login)}</span>
      </div>
    );
  };

  const { slogan } = getCustomConfig();

  return (
    <div className={styles.quickLogin}>
      <div className={styles.main}>
        <div className={styles.slogan}>{slogan || t(Strings.login_slogan)}</div>
        <div className={styles.subSlogan}>{t(Strings.login_sub_slogan)}</div>
        <div className={styles.welcomePng}>
          <Image src={WelcomePng} alt='Welcome' />
        </div>
        <Space className={styles.btnGroup} direction='vertical' size={16}>
          {renderQuickLoginBtn()}
          <div className={classnames(styles.btn, styles.mobileAndAccount)} onClick={changeMobileMode}>
            <MobileIcon /><span className={styles.text}>{t(Strings.more_login_mode)}</span>
          </div>
        </Space>
      </div>
      <span className={styles.templateBtn} onClick={() => Router.push(Navigation.TEMPLATE)}>
        <TemplateIcon />{t(Strings.massive_template)}
      </span>
    </div>
  );
};
