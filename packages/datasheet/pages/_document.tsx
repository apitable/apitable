import getConfig from 'next/config';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';
import React from 'react';
import '../utils/init_private';
import { getEnvVars } from '../src/get_env';

const { publicRuntimeConfig } = getConfig();

interface IClientInfo {
  env: string;
  version: string;
  envVars: string;
  locale: string;
}

class MyDocument extends Document<IClientInfo> {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const envVars = getEnvVars();

    return {
      ...initialProps,
      env: process.env.ENV,
      version: process.env.WEB_CLIENT_VERSION,
      envVars: JSON.stringify(envVars),

    };
  }

  render() {
    const { env, version, envVars } = this.props;
    return (
      <Html>
        <Head>
          <link rel='apple-touch-icon' href='/logo.png' />
          <link rel='shortcut icon' href={`${publicRuntimeConfig.staticFolder}/favicon.ico`} />
          <link rel='manifest' href={`${publicRuntimeConfig.staticFolder}/manifest.json`} />
          <script src={`${publicRuntimeConfig.staticFolder}/file/js/browser_check.2.js`} async />
          {/* injection of custom configs of editions, e.g. APITable */}
          <script src='/custom/custom_config.js' defer />
        </Head>
        <body>
          <Main />
          <NextScript />
          <Script src={`${publicRuntimeConfig.staticFolder}/file/js/cookie-locale.js`} strategy={'beforeInteractive'} />
          {
            !JSON.parse(envVars).DISABLE_AWSC  && <Script src='https://g.alicdn.com/AWSC/AWSC/awsc.js' strategy={'beforeInteractive'} />
          }
          {
            <Script id='__initialization_data__' strategy={'beforeInteractive'}>
              {`
          window.__initialization_data__ = {
              env: '${env}',
              version: '${version}',
              envVars: ${envVars},
              userInfo: null,
              wizards: null,
            };
          `}
            </Script>
          }
        </body>
      </Html>
    );
  }
}

export default MyDocument;

