import { Strings, t } from '@apitable/core';
import parser from 'html-react-parser';
import Image from 'next/image';
import { Wrapper } from 'pc/components/common';
import WelcomePng from 'static/icon/space/space_img_nickname.png';
import styles from './style.module.less';

const ContactSyncing = (props) => {
  return (
    <Wrapper>
      <div className={styles.container}>
        <Image
          className={styles.img}
          src={WelcomePng}
          alt="welcome vika"
        />
        <div className={styles.desc}>
          {parser(t(Strings.dingtalk_member_contact_syncing_tips))}
        </div>
      </div>
    </Wrapper>
  );
};

export default ContactSyncing;
