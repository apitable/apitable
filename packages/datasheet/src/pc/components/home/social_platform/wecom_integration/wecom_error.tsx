import { ConfigConstant, Settings, StatusCode, Strings, t } from '@apitable/core';
import { Method } from 'pc/components/route_manager/const';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { useQuery } from 'pc/hooks';
import * as React from 'react';
import FailureImage from 'static/icon/common/common_img_share_linkfailure.png';
import { SocialPlatformMap } from '..';
import { ErrPromptBase } from '../components/err_prompt_base';

const otherLoginPage = window.location.origin + '/login?quickLogin=off';

const ErrorConfig = {
  [StatusCode.WECOM_HAS_BIND]: {
    title: t(Strings.error_get_wecom_identity),
    desc: t(Strings.error_get_wecom_identity_tips_bound),
    btnText: t(Strings.help_center),
    btnUrl: window.location.origin + Settings.link_to_wecom_cms.value
  },
  [StatusCode.WECOM_NO_EXIST]: {
    title: t(Strings.wecom_login_fail_tips_title),
    desc: t(Strings.wecom_login_tenant_not_exsist),
    btnText: t(Strings.wecom_login_fail_button),
    btnUrl: otherLoginPage,
    btnNavigationOption: {
      method: Method.Redirect
    }
  },
  [StatusCode.WECOM_NO_INSTALL]: {
    title: t(Strings.wecom_login_fail_tips_title),
    desc: t(Strings.wecom_login_application_uninstall),
    btnText: t(Strings.wecom_login_fail_button),
    btnUrl: otherLoginPage,
    btnNavigationOption: {
      method: Method.Redirect
    }
  },
  [StatusCode.WECOM_OUT_OF_RANGE]: {
    title: t(Strings.wecom_login_fail_tips_title),
    desc: t(Strings.wecom_login_out_of_range),
    btnText: t(Strings.wecom_login_fail_button),
    btnUrl: otherLoginPage,
    btnNavigationOption: {
      method: Method.Redirect
    }
  },
  [StatusCode.WECOM_SHOP_USER_NOT_EXIST]: {
    title: t(Strings.wecom_login_fail_tips_title),
    desc: t(Strings.wecom_login_Internet_error),
    btnText: t(Strings.wecom_login_fail_button),
    btnUrl: otherLoginPage,
    btnNavigationOption: {
      method: Method.Redirect
    }
  },
  [StatusCode.WECOM_NOT_ADMIN]: {
    title: t(Strings.wecom_login_fail_tips_title),
    desc: t(Strings.error_get_wecom_identity_tips),
    btnText: t(Strings.wecom_login_fail_button),
    btnUrl: window.location.origin
  },
  default: {
    title: t(Strings.error_get_wecom_identity),
    desc: t(Strings.error_get_wecom_identity_tips),
    btnText: t(Strings.help_center),
    btnUrl: window.location.origin + Settings.link_to_wecom_cms.value
  }
};

const WecomError: React.FC = () => {
  const query = useQuery();
  const errorCode = query.get('errorCode');
  const {
    title,
    desc,
    btnText,
    btnUrl,
    btnNavigationOption
  } = errorCode && ErrorConfig[errorCode] || ErrorConfig['default'];
  return (
    <ErrPromptBase
      headerLogo={SocialPlatformMap[ConfigConstant.SocialType.WECOM].logoWithVika as string}
      img={FailureImage}
      title={title}
      desc={desc}
      btnText={btnText}
      onClick={() => navigationToUrl(btnUrl, {
        clearQuery: true,
        ...btnNavigationOption
      })}
    />
  );
};

export default WecomError;
