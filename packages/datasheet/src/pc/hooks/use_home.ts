import { StatusCode, Strings, t } from '@vikadata/core';
import { useRouter } from 'next/router';
import { Modal } from 'pc/components/common';
import { IQuery } from 'pc/components/route_manager/use_navigation';
import { useEffect, useState } from 'react';

// 人机验证
export const useNVC = (skip) => {
  useEffect(() => {
    if (skip) {
      return;
    }
    window['NVC_Opt'] = {
      appkey: 'FFFF0N00000000008B7D',
      scene: 'nvc_login',
      isH5: false,
      popUp: false,
      renderTo: '#captcha',
      language: 'cn',
      customWidth: '100%',
      upLang: {
        cn: {
          _startTEXT: t(Strings.nvc_start_text),
          _yesTEXT: t(Strings.nvc_yes_text),
          _error300: t(Strings.nvc_err_300),
          _errorNetwork: t(Strings.nvc_err_network),
        },
      },
    };
    // ! 用于加载脚本失败时，统计重载脚本的次数
    let reloadCount = 0;
    const createScriptTag = () => {
      const scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'text/javascript');
      scriptTag.setAttribute('src', '//g.alicdn.com/sd/nvc/1.1.112/guide.js');
      document.body.appendChild(scriptTag);
      scriptTag.onerror = () => {
        if (reloadCount >= 3) {
          Modal.error({
            title: t(Strings.error),
            content: t(Strings.resource_load_failed),
            onOk: () => window.location.reload(),
          });
          return;
        }
        document.body.removeChild(scriptTag);
        createScriptTag();
        reloadCount++;
      };

      return scriptTag;
    };
    const scriptTag = createScriptTag();

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, [skip]);
  // 重置验证
  const resetNVC = () => {
    if (window['_nvc_nc']) {
      window['_nvc_nc'].reset();
    }
  };
  // 进行二次验证
  const sencondNVC = () => {
    (window as any).getNC && (window as any).getNC();
  };

  return { resetNVC, sencondNVC };
};

// 人机验证情况处理
export const useOperateNVC = () => {
  const nvcResOperate = (nvcCode: number) => {
    switch (nvcCode) {
      case StatusCode.SECONDARY_VALIDATION: {
        (window as any).getNC();
        break;
      }
      case StatusCode.PHONE_VALIDATION: {
        Modal.confirm({
          title: t(Strings.warning),
          content: t(Strings.status_code_phone_validation),
          onOk: () => { window['_nvc_nc'].reset(); },
          type: 'warning',
          okText: t(Strings.got_it),
          cancelButtonProps: {
            style: { display: 'none' },
          },
        });
        break;
      }
      case StatusCode.NVC_FAIL: {
        Modal.confirm({
          title: t(Strings.warning),
          content: t(Strings.status_code_nvc_fail),
          type: 'warning',
          okText: t(Strings.got_it),
          cancelButtonProps: {
            style: { display: 'none' },
          },
        });
        break;
      }
    }
  };
  return { nvcResOperate };
};

export function useQuery() {
  if (process.env.SSR) {
    return new Map();
  }
  return new URLSearchParams(window.location.search);
}

/**
 * URLSearchParams类型转换成对象
 * @param urlSearchParams 
 * @returns 
 */
const urlSearchParamsToObject = (urlSearchParams: URLSearchParams) => {
  const queryObj = {};
  urlSearchParams.forEach((value, key) => {
    queryObj[key] = value;
  });
  return queryObj; 
};

export function useUrlQuery(): IQuery {
  const router = useRouter();
  const [query, setQuery] = useState<IQuery>(router.query);
  useEffect(() => {
    const routeChangeCompleteFn = (url) => {
      const queryStr = url?.split('?')?.[1];
      const urlSearchParams = new URLSearchParams(queryStr);
      setQuery(urlSearchParamsToObject(urlSearchParams));
    };
    router.events.on('routeChangeComplete', routeChangeCompleteFn);
    return () => router.events.off('routeChangeComplete', routeChangeCompleteFn);
  }, [router.events, setQuery]);
  return query;
}
