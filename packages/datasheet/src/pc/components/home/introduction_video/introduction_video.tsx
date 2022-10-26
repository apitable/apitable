import { integrateCdnHost, Strings, t } from '@apitable/core';
import { Space } from 'antd';
import Image from 'next/image';
import { getEnvVariables } from 'pc/utils/env';
import { FC } from 'react';
import ApiImg from 'static/icon/signin/signin_img_api.png';
import FormImg from 'static/icon/signin/signin_img_form.png';
import styles from './style.module.less';

export const IntroductionVideo: FC = () => {
  const env = getEnvVariables();
  const videoSrc = integrateCdnHost(env.INTRODUCTION_VIDEO || '');

  return (
    <div className={styles.introductionVideo}>
      <div className={styles.titleBar}>
        <Space className={styles.dots} size={10} align='center'>
          <div className={styles.whiteDot} />
          <div className={styles.transparentDot} />
          <div className={styles.whiteDot} />
        </Space>
      </div>
      <div className={styles.videoWrapper}>
        {
          videoSrc && <video controls>
            <source src={videoSrc} type='video/mp4' />
            {t(Strings.nonsupport_video)}
          </video>
        }
      </div>
      <span className={styles.apiImg}>
        <Image width={40} height={40} src={ApiImg} alt='api' />
      </span>
      <span className={styles.formImg}>
        <Image width={40} height={40} src={FormImg} alt='form' />
      </span>
    </div>
  );
};
