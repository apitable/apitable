/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// import App from 'next/app'
import { Api, integrateCdnHost, Navigation, StatusCode, StoreActions, Strings, t } from '@apitable/core';
import { Scope } from '@sentry/browser';
import * as Sentry from '@sentry/nextjs';
import 'antd/es/date-picker/style/index';
import axios from 'axios';
import classNames from 'classnames';
import elementClosest from 'element-closest';
import 'enterprise/style.less';
import ErrorPage from 'error_page';
import { init as initPlayer } from 'modules/shared/player/init';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import 'normalize.css';
import { initializer } from 'pc/common/initializer';
import { Modal } from 'pc/components/common';
import 'pc/components/common/button_base/button.less';
import 'pc/components/common/button_plus/button_plus.less';
import 'pc/components/common/emoji/emoji.less';
import 'pc/components/editors/date_time_editor/date_picker/date_picker.less';
import 'pc/components/editors/date_time_editor/time_picker_only/time_picker.less';
import 'pc/components/invite/invite.common.less';
import { Router } from 'pc/components/route_manager/router';
import { initEventListen } from 'pc/events';
import { getPageParams, getRegResult, LOGIN_SUCCESS, shareIdReg, spaceIdReg } from 'pc/hooks';
import { initResourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import 'pc/styles/global.less';
import 'pc/styles/global_components/index.less';
import { getEnvVariables, getReleaseVersion } from 'pc/utils/env';
import { initWorkerStore } from 'pc/worker';
import 'prismjs/themes/prism.css';
import 'rc-swipeout/assets/index.css';
import 'rc-trigger/assets/index.css';
import React, { useEffect, useState } from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-image-crop/dist/ReactCrop.css';
import { Provider } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import reportWebVitals from 'reportWebVitals';
import '../public/file/js/sensors';
import '../src/global.less';
import '../src/index.less';
import '../src/main.less';
import '../src/widget-stage/index.less';
import '../src/widget-stage/main/main.less';
import { getInitialProps } from '../utils/get_initial_props';

const RouterProvider = dynamic(() => import('pc/components/route_manager/router_provider'), { ssr: true });
const ThemeWrapper = dynamic(() => import('theme_wrapper'), { ssr: false });

declare const window: any;

export interface IUserInfoError {
  code: number;
  message: string;
}

const initWorker = async() => {
  const comlinkStore = await initWorkerStore();
  // Initialization functions
  initializer(comlinkStore);
  const resourceService = initResourceService(comlinkStore.store);
  initEventListen(resourceService);
};

(() => {
  if (!process.env.SSR) {
    console.log('start init web');
    // import('../public/file/js/sensors');
    initWorker();
  }
})();

enum LoadingStatus {
  None,
  Start,
  Complete
}

function MyApp(props: AppProps & { envVars: string }) {
  const router = useRouter();
  const isWidget = router.asPath.includes('widget-stage');
  if (isWidget) {
    return <props.Component {...props.pageProps} />;
  }
  return MyAppMain(props);
}

function MyAppMain({ Component, pageProps, envVars }: AppProps & { envVars: string }) {
  const router = useRouter();
  const env = JSON.parse(envVars);
  const [loading, setLoading] = useState(() => {
    if (router.asPath.includes('widget-stage')) {
      return LoadingStatus.Complete;
    }
    return LoadingStatus.None;
  });
  const [userData, setUserData] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const handleStart = (url) => {
      if (loading !== LoadingStatus.None) {
        return;
      }
      setLoading(LoadingStatus.Start);
    };

    const endLoading = () => {
      const ele = document.querySelector('.script-loading-wrap');
      // delete loading : scale logo -> vika -> wait 1000ms -> disappear
      const logoImg = document.querySelector('.script-loading-logo-img');
      logoImg?.classList.remove('loading-static-animation');
      setTimeout(() => ele?.classList.add('script-loading-wrap-finished'), 0);

      ele?.addEventListener('transitionend', (e) => {
        if (e.target === logoImg && ele?.classList.contains('script-loading-wrap-finished')) {
          ele?.classList.add('script-loading-wrap-finished');
          setTimeout(() => setLoading(LoadingStatus.Complete), 500);
        } else if (e.target === ele) {
          ele?.parentNode?.removeChild(ele);
        }
        // setLoading(LoadingStatus.Complete);
      });
      // Compatible with previous loading animation, private cloud retention
      // const ldsEle = document.querySelector('.lds-ripple');
      // ldsEle?.parentNode?.removeChild(ldsEle);

    };
    const handleComplete = (url) => {
      if (loading !== LoadingStatus.Start) {
        return;
      }
      endLoading();
    };

    setTimeout(() => {
      if (loading !== LoadingStatus.None) {
        return;
      }
      endLoading();
    }, 0);
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
    };
    // eslint-disable-next-line
  }, [loading]);

  useEffect(() => {
    const getUser = async() => {
      const res = await axios.get('/client/info');
      let userInfo = JSON.parse(res.data.userInfo);
      setUserData(userInfo);

      const pathUrl = window.location.pathname;
      const { nodeId } = getPageParams(pathUrl || '');
      const query = new URLSearchParams(window.location.search);
      const spaceId = query.get('spaceId') || '';
      let userInfoError: IUserInfoError | undefined;

      /**
       * If there is no nodeId or spaceId in the pathUrl, the userInfo returned by user/me and client/info is actually the same, so there is no need to repeat the request.
       */
      if (
        pathUrl &&
        (
          pathUrl.startsWith('/workbench') ||
          pathUrl.startsWith('/org') ||
          pathUrl.startsWith('/notification') ||
          pathUrl.startsWith('/management') ||
          pathUrl.includes('/tpl') ||
          pathUrl.includes('/space') ||
          pathUrl.includes('/login')
        ) &&
        (nodeId || spaceId)
      ) {
        const spaceId = getRegResult(pathUrl, spaceIdReg);
        const res = await Api.getUserMe({ nodeId, spaceId }, false);
        const { data, success, message, code } = res.data;

        if (success) {
          userInfo = data;
        } else {
          userInfoError = {
            code,
            message
          };
        }
      }

      setUserLoading(false);

      if (!userInfo) return;

      if (userInfoError) {
        if (userInfoError.code === StatusCode.INVALID_SPACE) {
          Modal.error({
            title: t(Strings.get_verification_code_err_title),
            content: t(Strings.enter_unactive_space_err_message),
            okText: t(Strings.submit),
            onOk: () => {
              Router.push(Navigation.HOME);
            },
          });
          return;
        }
        store.dispatch(
          StoreActions.updateUserInfoErr({
            code: userInfoError.code,
            msg: userInfoError.message,
          }),
        );
        return;
      }

      const _batchActions: any[] = [
        StoreActions.setIsLogin(true),
        StoreActions.setUserMe(userInfo),
        StoreActions.setLoading(false),
        StoreActions.updateUserInfoErr(null),
      ];
      if (!getRegResult(pathUrl, shareIdReg)) {
        // This is to avoid initializing the space resource more than once under the share route
        _batchActions.push(StoreActions.setActiveSpaceId(userInfo.spaceId));
      }

      store.dispatch(
        batchActions(
          _batchActions,
          LOGIN_SUCCESS,
        ),
      );

      window.__initialization_data__.userInfo = userInfo;
      window.__initialization_data__.wizards = JSON.parse(res.data.wizards);

    };
    getUser().then(() => {
      import('../src/preIndex');
      // Initialize the user system
      initPlayer();
      console.log('Current version number: ' + getReleaseVersion());
    });
  }, []);

  useEffect(() => {
    import('element-scroll-polyfill');
    import('polyfill-object.fromentries');
    elementClosest(window);
  }, []);

  useEffect(() => {
    (function() {
      const _Worker = window.Worker;
      if (typeof _Worker === 'function') {
        window.Worker = function(url: string, opts: any) {
          if (url.startsWith('//')) {
            url = `${window.location.protocol}${url}`;
          } else if (url.startsWith('/')) {
            url = `${window.location.origin}${url}`;
          }
          const blob = new Blob(['importScripts(' + JSON.stringify(url) + ')'], {
            type: 'text/javascript',
          });
          return new _Worker(URL.createObjectURL(blob), opts);
        } as any;
      }
    })();
  }, []);

  return <>
    <Head>
      <title>{t(Strings.system_configuration_product_name)}</title>
      <meta name='description' content={t(Strings.client_meta_label_desc)} />
      <meta
        name='keywords'
        content='APITable,datasheet,Airtable,nocode,low-code,aPaaS,hpaPaaS,RAD,web3,维格表,大数据,数字化,数字化转型,vika,vikadata,数据中台,业务中台,数据资产,
        数字化智能办公,远程办公,数据工作台,区块链,人工智能,多维表格,数据库应用,快速开发工具'
      />
      <meta property='og:image' content='/logo.png' />
      <meta name='renderer' content='webkit' />
      <meta
        name='viewport'
        content='width=device-width,viewport-fit=cover, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no'
      />
      <meta name='theme-color' content='#000000' />
      {/* In the pinning browser, join the monitoring center */}
      <meta name='wpk-bid' content='dta_2_83919' />
    </Head>

    <Script strategy='lazyOnload' id={'error'}>
      {`
            window.addEventListener('error', function(event) {
            if (
              event.message.includes('ResizeObserver') ||
              navigator.userAgent.toLowerCase().includes('dingtalk')
            ) {
              event.stopImmediatePropagation();
            }
          })
        `}
    </Script>
    {/*Baidu Statistics*/}
    <Script id={'baiduAnalyse'}>
      {`
          var _hmt = _hmt || [];
          (function() {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?39ab4bbbb01e48bee90b6b17a067b9f1";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
          })();
        `}
    </Script>
    <Script id={'userAgent'}>
      {`
          if (navigator.userAgent.toLowerCase().includes('dingtalk')) {
            !(function(c,i,e,b){var h=i.createElement("script");
            var f=i.getElementsByTagName("script")[0];
            h.type="text/javascript";
            h.crossorigin=true;
            h.onload=function(){c[b]||(c[b]=new c.wpkReporter({bid:"dta_2_83919"}));
            c[b].installAll()};
            f.parentNode.insertBefore(h,f);
            h.src=e})(window,document,"https://g.alicdn.com/woodpeckerx/jssdk??wpkReporter.js","__wpk");
          }
        `}
    </Script>
    {/* script loading js */}
    <Script id={'loadingAnimation'} strategy='lazyOnload'>
      {`
          window._loading = new Date().getTime();
          const logoImg = document.querySelector('.script-loading-logo-img');
          window.requestAnimationFrame(() => {
            setTimeout(() => logoImg && logoImg.classList.add('loading-static-animation'), 0)
          })
          logoImg && logoImg.addEventListener("transitionend", function() {
            const classLs = logoImg.classList
            if (classLs.contains('script-loading-wrap-finished')) {
              return
            }
            if (classLs.contains('loading-static-animation')) {
              logoImg.classList.remove('loading-static-animation')
            } else {
              logoImg.classList.add('loading-static-animation')
            }
          })
        `}
    </Script>
    <Script src='https://res.wx.qq.com/open/js/jweixin-1.2.0.js' referrerPolicy='origin' />
    <Script src='https://open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js' referrerPolicy='origin' />
    <Script src='https://g.alicdn.com/dingding/dinglogin/0.0.5/ddLogin.js' />
    {<Sentry.ErrorBoundary fallback={ErrorPage} beforeCapture={beforeCapture}>
      <div className={classNames({ 'script-loading-wrap': ((loading !== LoadingStatus.Complete) || userLoading) }, '__next_main')}>
        {!userLoading && <div style={{ display: loading !== LoadingStatus.Complete ? 'none' : 'block' }} onScroll={onScroll}>
          <Provider store={store}>
            <RouterProvider>
              <ThemeWrapper>
                <Component {...pageProps} userInfo={userData} />
              </ThemeWrapper>
            </RouterProvider>
          </Provider>
        </div>}
        {
          ((loading !== LoadingStatus.Complete) || userLoading) && <div className='main-img-wrap' style={{ height: 'auto' }}>
            <img src={integrateCdnHost(getEnvVariables().LOGO!)} className='script-loading-logo-img' alt='logo'/>
            <img src={integrateCdnHost(getEnvVariables().LOGO_TEXT_DARK!)} className='script-loading-logo-text-img' alt='logo_text_dark'/>
          </div>
        }
      </div>
    </Sentry.ErrorBoundary>}
    {
      env.GOOGLE_ANALYTICS_ID &&
      <>
        <Script async src={`https://www.googletagmanager.com/gtag/js?id=${env.GOOGLE_ANALYTICS_ID}`} />
        <Script id={'googleTag'}>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', ${env.GOOGLE_ANALYTICS_ID});
          `}
        </Script>
      </>
    }
  </>;
}

/**
 * When editing a cell in Safari, main will be shifted up by 7 pixels after the element is out of focus. When an offset is detected, it needs to be reset manually.
 * The reason why the onBlur event is not used here is that after the editing element is out of focus, other elements will be focused, and the focused element is a child of main, so onBlur will not be triggered as expected.
 * @param e
 */
const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
  const currentTarget = e.currentTarget;
  if (currentTarget && currentTarget.scrollTop) {
    currentTarget.scrollTop = 0;
  }
};

export default MyApp;
reportWebVitals();

MyApp.getInitialProps = getInitialProps;

const beforeCapture = (scope: Scope) => {
  scope.setTag('PageCrash', true);
};
