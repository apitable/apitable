import { getEnvVariables, isHiddenQRCode } from 'pc/utils/env';
import { IntercomProvider } from 'react-use-intercom';

export const IntercomWrapper: React.FC = (props) => {
  const env = getEnvVariables();
  const INTERCOM_APP_ID = env.INTERCOM_APPID as string;
  return(
    <IntercomProvider autoBoot={isHiddenQRCode()} autoBootProps={{ hideDefaultLauncher: true }} appId={INTERCOM_APP_ID}>
      {props.children}
    </IntercomProvider>
  );
};
