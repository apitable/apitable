import { Strings, t } from '@vikadata/core';
import Image from 'next/image';
import { useRouter } from 'next/router';
import * as React from 'react';
import NotDataImg from 'static/icon/common/common_img_search_default.png';
import { Logo } from '../common';
import styles from './style.module.less';

export const NoSupport: React.FC = () => {
  const router = useRouter();
  const { type } = router.query;

  function renderPc() {
    return (
      <div className={styles.pc}>
        <div style={{ position: 'absolute', top: '57px', left: '49px' }}>
          <Logo size="large" />
        </div>
        <span className={styles.img}>
          <Image src={NotDataImg} width={300} height={226} alt="" />
        </span>
        <p className={styles.desc}>{t(Strings.no_support_pc_desc)}</p>
        <p className={styles.subDesc}>{t(Strings.no_support_pc_sub_desc)}</p>
      </div>
    );
  }

  function renderMobile() {
    return (
      <div className={styles.mobile}>
        {/* <h1>维格表</h1> */}
        <span className={styles.img}>
          <Image src={NotDataImg} width={240} height={180} alt="" />
        </span>
        <p className={styles.desc}>{t(Strings.no_support_mobile_desc)}</p>
      </div>
    );
  }

  return (
    <>

      {type ? renderMobile() : renderPc()}
    </>
  );
};
