
import { IntercomProvider } from 'react-use-intercom';
import { getEnvVariables } from 'pc/utils/env';

export const IntercomWrapper: React.FC = (props) => {
  const env = getEnvVariables();
  const INTERCOM_APP_ID = env.INTERCOM_APPID as string;
  return(
    <IntercomProvider autoBoot={env.HIDDEN_QRCODE} autoBootProps={{ hideDefaultLauncher: true }} appId={INTERCOM_APP_ID}>
      {props.children}
    </IntercomProvider>
  );
};
