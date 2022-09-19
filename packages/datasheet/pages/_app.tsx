// import App from 'next/app'
import { Navigation, StatusCode, StoreActions, Strings, t } from '@vikadata/core';
import 'antd/es/date-picker/style/index';
import classNames from 'classnames';
import elementClosest from 'element-closest';
import type { AppProps } from 'next/app';
import getConfig from 'next/config';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Script from 'next/script';
import 'normalize.css';
import 'pc/common/guide/style/breath.less';
import 'pc/common/guide/style/contact_us.less';
import 'pc/common/guide/style/guide_button.less';
import 'pc/common/guide/style/hotspot.less';
import 'pc/common/guide/style/mask.less';
import 'pc/common/guide/style/modal.less';
import 'pc/common/guide/style/notice.less';
import 'pc/common/guide/style/popover.less';
import 'pc/common/guide/style/slideout.less';
import 'pc/common/guide/style/task_list.less';
import 'pc/common/guide/ui/questionnaire/questionnaire.less';
import { initializer } from 'pc/common/initializer';
import { Modal } from 'pc/components/common';
import 'pc/components/common/button_base/button.less';
import 'pc/components/common/button_plus/button_plus.less';
import 'pc/components/common/emoji/emoji.less';
import 'pc/components/economy/components/paying_modal/style.less';
import 'pc/components/editors/date_time_editor/date_picker/date_picker.less';
import 'pc/components/editors/date_time_editor/time_picker_only/time_picker.less';
import 'pc/components/home/social_platform/components/common.less';
import 'pc/components/invite/invite.common.less';
import { useNavigation } from 'pc/components/route_manager/use_navigation';
import { initEventListen } from 'pc/events';
import { getRegResult, LOGIN_SUCCESS, shareIdReg } from 'pc/hooks';
import { init as initPlayer } from 'pc/player/init';
import { initResourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import 'pc/styles/global.less';
import 'pc/styles/global_components/index.less';
import { getReleaseVersion } from 'pc/utils/env';
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
import { IClientInfo } from '../utils/interface';

const RouterProvider = dynamic(() => import('pc/components/route_manager/router_provider'), { ssr: true });
const ThemeWrapper = dynamic(() => import('theme_wrapper'), { ssr: false });
const { publicRuntimeConfig } = getConfig();

declare const window: any;

interface IMyAppProps {
  clientInfo: IClientInfo;
  pathUrl: string;
}

const initWorker = async() => {
  const comlinkStore = await initWorkerStore();
  // 初始化函数
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

function MyApp({ Component, pageProps, clientInfo, pathUrl }: AppProps & IMyAppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(() => {
    if (router.asPath.includes('widget-stage')) {
      return LoadingStatus.Complete;
    }
    return LoadingStatus.None;
  });
  const navigationTo = useNavigation();

  useEffect(() => {
    // 初始化用户系统
    initPlayer();
    console.log('当前版本号: ' + getReleaseVersion());
  }, []);

  useEffect(() => {
    const handleStart = (url) => {
      if (loading !== LoadingStatus.None) {
        return;
      }
      setLoading(LoadingStatus.Start);
    };

    const endLoading = () => {
      const ele = document.querySelector('.script-loading-wrap');
      // 删除 loading 动画: scale logo -> 出vika -> wait 1000ms -> disappear
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
      // 兼容之前的loading动画，私有云保留
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    if (!clientInfo || !clientInfo.userInfo || clientInfo.userInfo === 'null') {
      return;
    }

    if (clientInfo.userInfoError) {
      if (clientInfo.userInfoError.code === StatusCode.INVALID_SPACE) {
        Modal.error({
          title: t(Strings.get_verification_code_err_title),
          content: t(Strings.enter_unactive_space_err_message),
          okText: t(Strings.submit),
          onOk: () => {
            navigationTo({ path: Navigation.HOME });
          }
        });
        return;
      }
      store.dispatch(
        StoreActions.updateUserInfoErr({
          code: clientInfo.userInfoError.code,
          msg: clientInfo.userInfoError.message
        })
      );
      return;
    }
    const userInfo = JSON.parse(clientInfo.userInfo);

    const _batchActions: any[] = [
      StoreActions.setIsLogin(true),
      StoreActions.setUserMe(userInfo),
      StoreActions.setLoading(false),
      StoreActions.updateUserInfoErr(null)
    ];
    if (!getRegResult(pathUrl, shareIdReg)) {
      // 这里是为了避免在 share 路由下多初始化一次 space resource
      _batchActions.push(StoreActions.setActiveSpaceId(userInfo.spaceId));
    }

    store.dispatch(
      batchActions(
        _batchActions,
        LOGIN_SUCCESS
      )
    );
  }, [clientInfo, clientInfo?.userInfo, pathUrl, navigationTo]);

  useEffect(() => {
    import('../src/preIndex');
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
            type: 'text/javascript'
          });
          return new _Worker(URL.createObjectURL(blob), opts);
        } as any;
      }
    })();
  }, []);

  const userInfo = clientInfo && clientInfo.userInfo ? JSON.parse(clientInfo.userInfo) : undefined;
  return <>
    <Head>
      <title>{t(Strings.vikadata)}</title>
      <meta name="description" content="维格表, 积木式多媒体数据表格, 维格表技术首创者, 数据整理神器, 让人人都是数据设计师" />
      <meta
        name='keywords'
        content='维格表,vika,vikadata,维格智数,大数据,数字化,数字化转型,数据中台,业务中台,数据资产,
        数字化智能办公,远程办公,数据工作台,区块链,人工智能,多维表格,aPaaS,hpaPaaS,RAD,数据库应用,快速开发工具'
      />
      <meta property='og:image' content='/logo.png' />
      <meta name='renderer' content='webkit' />
      <meta
        name='viewport'
        content='width=device-width,viewport-fit=cover, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no'
      />
      <meta name='theme-color' content='#000000' />
      {/* 钉钉浏览器中，加入监控中心 */}
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
    {/*百度统计*/}
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
    {/* script loading 动画相关js */}
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
    <div className={classNames({ 'script-loading-wrap': loading !== LoadingStatus.Complete }, '__next_main')}>
      <div style={{ display: loading !== LoadingStatus.Complete ? 'none' : 'block' }} onScroll={onScroll}>
        <Provider store={store}>
          <RouterProvider>
            <ThemeWrapper>
              <Component {...pageProps} userInfo={userInfo} />
            </ThemeWrapper>
          </RouterProvider>
        </Provider>
      </div>
      {
        loading !== LoadingStatus.Complete && <div className='main-img-wrap' style={{ height: 'auto' }}>
          <span className='script-loading-logo-img'>
            <Image src={`${publicRuntimeConfig.staticFolder}/logo.svg`} alt='logo' layout={'fill'} />
          </span>
          <span className='script-loading-vika-img'>
            <Image src={`${publicRuntimeConfig.staticFolder}/vika.svg`} alt='vika' layout={'fill'} object-fit={'contain'} />
          </span>
        </div>
      }

    </div>
  </>;
}

/**
 * 在 Safari 上编辑一个单元格，元素失焦之后，main 会向上偏移 7 像素。当发现偏移发生，需要手动重置。
 * 这里不用 onBlur 事件监听的原因在于编辑元素失焦后，会有其他的元素被聚焦，聚焦的元素是 main 的子元素，所以 onBlur 不会如期触发。
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
