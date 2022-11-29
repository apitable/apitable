import { getEnvVars } from 'get_env';
import { NextPageContext } from 'next';

export const getInitialProps = async(context: { ctx: NextPageContext }) => {
  const envVars = getEnvVars();
  return {
    env: process.env.ENV,
    version: process.env.WEB_CLIENT_VERSION,
    envVars: JSON.stringify(envVars),
  }
}