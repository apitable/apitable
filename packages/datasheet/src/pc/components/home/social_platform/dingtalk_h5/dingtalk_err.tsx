import { ConfigConstant, Settings, Strings, t } from '@apitable/core';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { ErrPromptBase } from '../components/err_prompt_base';
import { SocialPlatformMap } from '../config';

const DingtalkUnboundErr = () => {
  return (
    <ErrPromptBase
      headerLogo={SocialPlatformMap[ConfigConstant.SocialType.DINGTALK].logoWithVika as string}
      desc={t(Strings.feishu_configure_err_of_configuring)}
      btnText={t(Strings.know_more)}
      onClick={() => {
        navigationToUrl(window.location.origin + Settings.integration_dingtalk_help_url.value, { clearQuery: true });
      }}
    />
  );
};

export default DingtalkUnboundErr;
