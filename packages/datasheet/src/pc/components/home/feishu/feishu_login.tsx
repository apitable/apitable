import { ConfigConstant, Strings, t } from '@vikadata/core';
import classNames from 'classnames';
import parser from 'html-react-parser';
import Image from 'next/image';
import { LoginCard, Wrapper } from 'pc/components/common';
import { IdentifyingCodeLogin, IIdentifyingCodeLoginProps } from 'pc/components/home/login/identifying_code_login';
import BothImg from 'static/icon/signin/signin_img_vika_feishu.png';
import styles from './style.module.less';

export const FeiShuLogin = (data: IIdentifyingCodeLoginProps) => {
  const {
    submitText = t(Strings.feishu_admin_login_btn),
    hiddenProtocol = true,
    mode = ConfigConstant.LoginMode.PHONE,
    mobileCodeType,
    footer = parser(t(Strings.new_user_turn_to_home)),
    ...rest
  } = data;

  return (
    <Wrapper hiddenLogo className={styles.center}>
      <div className={classNames(styles.commonWrapper, styles.center)}>
        <div className={styles.commonImgWrapper}>
          <Image src={BothImg} />
        </div>
        <LoginCard className={styles.commonLoginCardWrapper}>
          <div className={styles.commonCardTitle}>
            {t(Strings.feishu_admin_login_title)}
          </div>
          <div className={styles.commonCardSubTitle}>
            {t(Strings.lark_admin_login_and_config_sub_title)}
          </div>
          <IdentifyingCodeLogin
            submitText={submitText}
            hiddenProtocol={hiddenProtocol}
            mode={mode}
            smsType={mobileCodeType}
            footer={footer}
            {...rest}
          />
        </LoginCard>
      </div>
    </Wrapper>
  );
};
