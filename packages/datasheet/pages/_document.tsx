import getConfig from 'next/config';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';
import React from 'react';
import { getEnvVars } from 'get_env';
import '../utils/init_private';

const { publicRuntimeConfig } = getConfig();

class MyDocument extends Document {
  render() {
    const envVars = getEnvVars();
    return (
      <Html>
        <Head>
          <link rel='apple-touch-icon' href='/logo.png' />
          <link rel='shortcut icon' href={`${publicRuntimeConfig.staticFolder}/favicon.ico`} />
          <link rel='manifest' href={`${publicRuntimeConfig.staticFolder}/manifest.json`} />
          <script src={`${publicRuntimeConfig.staticFolder}/file/js/browser_check.2.js`} async/>
        </Head>
        <body>
          <Main />
          <NextScript />
          <Script src='https://g.alicdn.com/AWSC/AWSC/awsc.js' strategy={'beforeInteractive'} />
          {
            <Script id='__initialization_data__' strategy={'beforeInteractive'}>
              {`
          window.__initialization_data__ = {
              env: '${process.env.ENV}',
              version: '${process.env.WEB_CLIENT_VERSION}',
              envVars: ${JSON.stringify(envVars)},
              locale:'zh-CN',
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

