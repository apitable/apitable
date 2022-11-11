import getConfig from 'next/config';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';
import React from 'react';
import { getInitialProps } from '../utils/get_initial_props';
import '../utils/init_private';
import { IClientInfo } from '../utils/interface';

const { publicRuntimeConfig } = getConfig();

class MyDocument extends Document<{ clientInfo: IClientInfo }> {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const initData = await getInitialProps({ ctx }) as any;
    return {
      ...initialProps,
      clientInfo: initData.clientInfo,
    };
  }
  render() {
    const clientInfo = this.props.clientInfo;
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
            clientInfo && <Script id='__initialization_data__' strategy={'beforeInteractive'}>
              {`
          window.__initialization_data__ = {  
              env:'${clientInfo.env}',
              version:'${clientInfo.version}',
              envVars: ${clientInfo.envVars},
              locale:'${clientInfo.locale}',
              userInfo: ${clientInfo.userInfo},
              wizards: ${clientInfo.wizards},
              headers:${clientInfo.headers},
            };
          `}
            </Script>
          }
          {/* injection of custom configs of editions, e.g. APITable */}
          <script src="/custom/custom_config.js" defer />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

