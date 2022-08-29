import { Button } from '@vikadata/components';
import { Navigation, Strings, t } from '@vikadata/core';
import Image from 'next/image';
import { Logo } from 'pc/components/common';
import { Method, useNavigation } from 'pc/components/route_manager/use_navigation';
import * as React from 'react';
import IconFail from 'static/icon/common/common_img_invite_linkfailure.png';
import styles from './style.module.less';
import Head from 'next/head';
export const ShareFail: React.FC = () => {
  const navigationTo = useNavigation();

  const backToSpace = () => {
    navigationTo({ path: Navigation.HOME, method: Method.Replace });
  };

  return (
    <div className={styles.container}>
      <Head>
        <meta property="og:title" content="暂时无法访问" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content="https://s1.vika.cn/space/2021/12/01/992611616a744743a75c4b916e982dd6" />
        <meta property="og:site_name" content="维格表" />
        <meta property="og:description" content="该分享的公开链接已被关闭，暂时无法访问" />
      </Head>
      <div className={styles.logo}>
        <Logo size="large" />
      </div>
      <div className={styles.main}>
        <Image src={IconFail} width={240} height={180} alt="" />
        <p className={styles.desc}>{t(Strings.link_failed)}</p>
        <Button
          color={'primary'}
          size={'large'}
          block
          onClick={backToSpace}
        >
          {t(Strings.back_to_space)}
        </Button>
      </div>
    </div>
  );
};
