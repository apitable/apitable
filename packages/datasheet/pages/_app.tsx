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
import '../utils/global_this_polyfill';
import { Scope } from '@sentry/browser';
import * as Sentry from '@sentry/nextjs';
import axios from 'axios';
import classNames from 'classnames';
import dayjs from 'dayjs';
import elementClosest from 'element-closest';
import ErrorPage from 'error_page';
import * as immer from 'immer';
import { enableMapSet } from 'immer';
import { init as initPlayer } from 'modules/shared/player/init';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import reportWebVitals from 'reportWebVitals';
import {
  Api,
  getTimeZone,
  getTimeZoneOffsetByUtc,
  integrateCdnHost,
  IUserInfo,
  Navigation,
  StatusCode,
  StoreActions,
  Strings,
  SystemConfig,
  t,
  WasmApi,
} from '@apitable/core';
import { getBrowserDatabusApiEnabled } from '@apitable/core/dist/modules/database/api/wasm';
import 'antd/es/date-picker/style/index';
import 'normalize.css';
import { initializer } from 'pc/common/initializer';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { Router } from 'pc/components/route_manager/router';
import { initEventListen } from 'pc/events/init_events_listener';
import { getPageParams, getRegResult, LOGIN_SUCCESS, shareIdReg, spaceIdReg } from 'pc/hooks';
import { initResourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { getEnvVariables, getReleaseVersion } from 'pc/utils/env';
import { initWorkerStore } from 'pc/worker';
import 'prismjs/themes/prism.css';
import 'rc-swipeout/assets/index.css';
import 'rc-trigger/assets/index.css';
import 'react-grid-layout/css/styles.css';
import 'react-image-crop/dist/ReactCrop.css';
import 'enterprise/style.less';
import 'pc/components/common/button_base/button.less';
import 'pc/components/common/button_plus/button_plus.less';
import 'pc/components/common/emoji/emoji.less';
import 'pc/components/editors/date_time_editor/date_picker/date_picker.less';
import 'pc/components/editors/date_time_editor/time_picker_only/time_picker.less';
import 'pc/components/invite/invite.common.less';
import 'pc/styles/global.less';
import '../src/global.less';
import '../src/index.less';
import '../src/main.less';
import '../src/widget-stage/index.less';
import '../src/widget-stage/main/main.less';
import { getInitialProps } from '../utils/get_initial_props';

enableMapSet();

const RouterProvider = dynamic(() => import('pc/components/route_manager/router_provider'), { ssr: true });
const ThemeWrapper = dynamic(() => import('theme_wrapper'), { ssr: false });

declare const window: any;

export interface IUserInfoError {
  code: number;
  message: string;
}

const initWorker = async () => {
  const comlinkStore = await initWorkerStore();
  // Initialization functions
  initializer(comlinkStore);
  const resourceService = initResourceService(comlinkStore.store!);
  initEventListen(resourceService);
  if (getBrowserDatabusApiEnabled()) {
    await WasmApi.initializeDatabusWasm();
  } else {
    console.log('web assembly is not supported');
  }
};
immer.setAutoFreeze(false);
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
  Complete,
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
  const [userData, setUserData] = useState<IUserInfo | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  useEffect(() => {
    const handleStart = () => {
      if (loading !== LoadingStatus.None) {
        return;
      }
      setLoading(LoadingStatus.Start);
    };

    const endLoading = () => {
      const ele = document.querySelector('.script-loading-wrap');
      // delete loading : scale logo -> aitable -> wait 1000ms -> disappear
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
    const handleComplete = () => {
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
    const getUser = async () => {
      const pathUrl = window.location.pathname;
      const query = new URLSearchParams(window.location.search);
      const spaceId = query.get('spaceId') || getRegResult(pathUrl, spaceIdReg) || '';
      const res = await axios.get('/client/info', {
        params: {
          spaceId,
        },
      });
      // console.log(res);
      let userInfo: IUserInfo | undefined;
      try {
        userInfo = JSON.parse(res.data.userInfo);
        if (userInfo?.timeZone) {
          dayjs.tz.setDefault(userInfo.timeZone);
          console.log('set default timezone', userInfo.timeZone);
        }
        userInfo && setUserData(userInfo);
      } catch (e) {
        console.error(e);
      }

      const { nodeId } = getPageParams(pathUrl || '');
      let userInfoError: IUserInfoError | undefined;

      /**
       * If there is no nodeId or spaceId in the pathUrl, the userInfo returned by user/me and client/info is actually the same,
       * so there is no need to repeat the request.
       */
      if (
        pathUrl &&
        (pathUrl.startsWith('/workbench') ||
          pathUrl.startsWith('/org') ||
          pathUrl.startsWith('/notification') ||
          pathUrl.startsWith('/management') ||
          pathUrl.includes('/tpl') ||
          pathUrl.includes('/space') ||
          pathUrl.includes('/login')) &&
        (nodeId || spaceId)
      ) {
        const res = await Api.getUserMe({ nodeId, spaceId }, false);
        const { data, success, message, code } = res.data;
        if (success) {
          userInfo = data;
        } else {
          userInfoError = {
            code,
            message,
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

      store.dispatch(batchActions(_batchActions, LOGIN_SUCCESS));
      window.__initialization_data__.userInfo = userInfo;
      if (userInfo?.locale) {
        window.__initialization_data__.lang = userInfo.locale;
        window.__initialization_data__.locale = userInfo.locale;
      }
      window.__initialization_data__.wizards = {
        guide: SystemConfig.guide,
        player: SystemConfig.player,
      };
    };
    getUser().then(() => {
      import('../src/preIndex');
      // Initialize the user system
      initPlayer();
      console.log('Current version number: ' + getReleaseVersion());
    });
  }, []);

  useEffect(() => {
    // @ts-ignore
    import('element-scroll-polyfill');
    // @ts-ignore
    import('polyfill-object.fromentries');
    elementClosest(window);
  }, []);

  useEffect(() => {
    (function () {
      const _Worker = window.Worker;
      if (typeof _Worker === 'function') {
        window.Worker = function (url: string, opts: any) {
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

  useEffect(() => {
    document.title = t(Strings.og_page_title);
    const descMeta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    descMeta.content = t(Strings.client_meta_label_desc);
  }, []);

  const curTimezone = userData?.timeZone;
  const updateUserTimeZone = (timeZone: string, cb?: () => void) => {
    Api.updateUser({ timeZone }).then((res: any) => {
      const { success } = res.data;
      if (success) {
        store.dispatch(StoreActions.setUserTimeZone(timeZone));
        setUserData({
          ...userData!,
          timeZone,
        });
        cb?.();
      }
    });
  };

  useEffect(() => {
    const checkTimeZoneChange = () => {
      const timeZone = getTimeZone();
      const offset = getTimeZoneOffsetByUtc(timeZone)!;
      if (!timeZone) return;
      // set default timeZone
      if (curTimezone === null) {
        updateUserTimeZone(timeZone);
      } else if (curTimezone && curTimezone !== timeZone) {
        const curOffset = getTimeZoneOffsetByUtc(curTimezone)!;
        Modal.warning({
          title: t(Strings.notify_time_zone_change_title),
          content: t(Strings.notify_time_zone_change_content, {
            client_time_zone: `UTC${offset > 0 ? '+' : ''}${offset}(${timeZone})`,
            user_time_zone: `UTC${curOffset > 0 ? '+' : ''}${curOffset}(${curTimezone})`,
          }),
          onOk: () => {
            // update timeZone while client timeZone change
            updateUserTimeZone(timeZone, () => {
              window.location.reload();
            });
          },
          closable: true,
          hiddenCancelBtn: false,
          onCancel: () => {
            localStorage.setItem('timeZoneCheck', 'close');
          },
        });
      }
    };
    const timeZoneCheck = localStorage.getItem('timeZoneCheck');
    if (timeZoneCheck === 'close') return;
    checkTimeZoneChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curTimezone]);

  return (
    <>
      <Head>
        <meta name="description" content="" />
        <meta
          name="keywords"
          content="APITable,datasheet,Airtable,nocode,low-code,aPaaS,hpaPaaS,RAD,web3,AITable.ai,AITable,多维表格,AI多维表格,维格表,维格云,大数据,数字化,数字化转型,vika,vikadata,数据中台,业务中台,数据资产,
        数字化智能办公,远程办公,数据工作台,区块链,人工智能,多维表格,数据库应用,快速开发工具"
        />
        <meta name="renderer" content="webkit" />
        <meta
          name="viewport"
          content="width=device-width,viewport-fit=cover, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="theme-color" content="#000000" />
        {/* In the pinning browser, join the monitoring center */}
        <meta name="wpk-bid" content="dta_2_83919" />
      </Head>
      {env.ENABLED_REWARDFUL && (
        <>
          <Script id={'rewardful'}>
            {`
        (function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');
        `}
          </Script>
          <Script async src="https://r.wdfl.co/rw.js" data-rewardful="3a9927" />
        </>
      )}

      {env.DINGTALK_MONITOR_PLATFORM_ID && (
        <Script strategy="lazyOnload" id={'error'}>
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
      )}
      {env.DINGTALK_MONITOR_PLATFORM_ID && (
        <Script id={'userAgent'}>
          {`
          if (navigator.userAgent.toLowerCase().includes('dingtalk')) {
            !(function(c,i,e,b){var h=i.createElement("script");
            var f=i.getElementsByTagName("script")[0];
            h.type="text/javascript";
            h.crossorigin=true;
            h.onload=function(){c[b]||(c[b]=new c.wpkReporter({bid:"${env.DINGTALK_MONITOR_PLATFORM_ID}"}));
            c[b].installAll()};
            f.parentNode.insertBefore(h,f);
            h.src=e})(window,document,"https://g.alicdn.com/woodpeckerx/jssdk??wpkReporter.js","__wpk");
          }
        `}
        </Script>
      )}
      {/* script loading js */}
      <Script id={'loadingAnimation'} strategy="lazyOnload">
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
      {!env.IS_SELFHOST && (
        <>
          <Script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js" referrerPolicy="origin" />
          <Script src="https://open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js" referrerPolicy="origin" />
        </>
      )}
      {env.DINGTALK_MONITOR_PLATFORM_ID && <Script src="https://g.alicdn.com/dingding/dinglogin/0.0.5/ddLogin.js" />}
      {env.GOOGLE_TAG_MANAGER_ID && (
        <>
          <Script id={'googleTag'}>
            {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer',window.__initialization_data__.envVars.GOOGLE_TAG_MANAGER_ID);
        `}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${env.GOOGLE_TAG_MANAGER_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        </>
      )}
      {
        <Sentry.ErrorBoundary fallback={ErrorPage} beforeCapture={beforeCapture as any}>
          <div className={'__next_main'}>
            {!userLoading && (
              <div style={{ opacity: loading !== LoadingStatus.Complete ? 0 : 1 }} onScroll={onScroll}>
                <PostHogProvider client={posthog}>
                  <Provider store={store}>
                    <RouterProvider>
                      <ThemeWrapper>
                        <Component {...pageProps} userInfo={userData} />
                      </ThemeWrapper>
                    </RouterProvider>
                  </Provider>
                </PostHogProvider>
              </div>
            )}
            {
              <div
                className={classNames('script-loading-wrap-default', { 'script-loading-wrap': loading !== LoadingStatus.Complete || userLoading })}
              >
                {(loading !== LoadingStatus.Complete || userLoading) && (
                  <div className="main-img-wrap" style={{ height: 'auto' }}>
                    <img src={integrateCdnHost(getEnvVariables().LOGO!)} className="script-loading-logo-img" alt="logo" />
                    <img src={integrateCdnHost(getEnvVariables().LOGO_TEXT_LIGHT!)} className="script-loading-logo-text-img" alt="logo_text_dark" />
                  </div>
                )}
              </div>
            }
          </div>
        </Sentry.ErrorBoundary>
      }
    </>
  );
}

/**
 * When editing a cell in Safari, main will be shifted up by 7 pixels after the element is out of focus.
 * When an offset is detected, it needs to be reset manually.
 * The reason why the onBlur event is not used here is that after the editing element is out of focus,
 * other elements will be focused, and the focused element is a child of main, so onBlur will not be triggered as expected.
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

if (!process.env.SSR && getEnvVariables().NEXT_PUBLIC_POSTHOG_KEY) {
  window.onload = () => {
    posthog.init(getEnvVariables().NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: getEnvVariables().NEXT_PUBLIC_POSTHOG_HOST,
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      // Disable in development
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.opt_out_capturing();
      },
    });
  };
}
