import { Button } from '@vikadata/components';
import { Navigation, Settings, Strings, t } from '@vikadata/core';
import classNames from 'classnames';
import Image from 'next/image';
import { Wrapper } from 'pc/components/common';
import { navigationToUrl, useNavigation } from 'pc/components/route_manager/use_navigation';
import { useQuery } from 'pc/hooks';
import * as React from 'react';
import { FC, useMemo } from 'react';
import BoundImage from 'static/icon/common/common_img_feishu_binding.png';
import FailureImage from 'static/icon/common/common_img_share_linkfailure.png';
import BothImg from 'static/icon/signin/signin_img_vika_feishu.png';
import styles from './style.module.less';

interface IFeishuDefaultErrProps {
  img: React.ReactNode;
  desc: string;
  btnText: string;
  onClick: () => void;
}

export enum FeishuErrType {
  BOUND = 'bound',
  IDENTITY = 'identity',
  SELECT_VALID = 'select_valid',
  CONFIGURING = 'configuring',
}

const FeishuDefaultErr = (data: IFeishuDefaultErrProps) => {
  const { img, desc, btnText, onClick } = data;

  return (
    <Wrapper hiddenLogo className={styles.center}>
      <div
        className={classNames(
          styles.commonWrapper,
          styles.center,
          styles.feishuErr
        )}
      >
        <div className={styles.commonImgWrapper}>
          <Image src={BothImg} />
        </div>
        <span className={styles.mainImg}>
          <Image src={img as string} />
        </span>
        <div className={styles.desc}>{desc}</div>
        <Button color="primary" onClick={onClick}>
          {btnText}
        </Button>
      </div>
    </Wrapper>
  );
};

const FeishuErr: FC<{
  // type: 'bound' | 'identity' | 'select_valid' | 'configuring';
}> = () => {
  const query = useQuery();
  const key = query.get('key');
  const msg = query.get('msg');
  const appId = query.get('appId') || query.get('app_id');
  const navigationTo = useNavigation();
  const info: { [key: string]: IFeishuDefaultErrProps } = React.useMemo(() => {
    return {
      bound: {
        img: BoundImage,
        desc: t(Strings.feishu_configure_err_of_bound),
        btnText: t(Strings.entry_space),
        onClick: () => {
          if (!appId) {
            navigationTo({ path: Navigation.LOGIN });
            return;
          }

          const url = new URL('https://applink.feishu.cn/client/web_app/open');
          url.searchParams.append('appId', appId);
          url.searchParams.append(
            'path',
            '/api/v1/social/feishu/workbench/callback?url=/'
          );
          navigationToUrl(url.href, { clearQuery: true });
        },
      },
      identity: {
        img: FailureImage,
        desc: t(Strings.feishu_configure_err_of_identity),
        btnText: t(Strings.know_more),
        onClick: () => {
          navigationToUrl(Settings.feishu_bind_help.value);
        },
      },
      select_valid: {
        img: BoundImage,
        desc: t(Strings.feishu_configure_err_of_select_valid),
        btnText: t(Strings.know_more),
        onClick: () => {
          navigationToUrl(Settings.feishu_bind_help.value);
        },
      },
      configuring: {
        img: BoundImage,
        desc: t(Strings.feishu_configure_err_of_configuring),
        btnText: t(Strings.know_more),
        onClick: () => {
          navigationToUrl(Settings.feishu_bind_help.value);
        },
      },
    };
  }, [navigationTo, appId]);

  const data = useMemo(() => {
    if (key && info[key]) {
      return info[key];
    }
    return {
      img: FailureImage,
      desc: msg || t(Strings.something_went_wrong),
      btnText: t(Strings.know_more),
      onClick: () => {
        navigationToUrl(Settings.feishu_bind_help.value);
      },
    };
  }, [key, msg, info]);

  return <FeishuDefaultErr {...data} />;
};

export default FeishuErr;
