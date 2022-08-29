import { RecordVision, StoreActions, Strings, t } from '@vikadata/core';
import { ConfigProvider, message } from 'antd';
import axios from 'axios';
import { releaseProxy } from 'comlink';
import Image from 'next/image';
import { Method, navigationToUrl } from 'pc/components/route_manager/use_navigation';
import VersionUpdater from 'pc/components/version_updater';
import { IScrollOffset, ScrollContext } from 'pc/context';
import { useNavigatorName } from 'pc/hooks';
import { useViewTypeTrack } from 'pc/hooks/use_view_type_track';
import { ResourceContext, resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { getCookie } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import { getStorage, StorageName } from 'pc/utils/storage';
import { comlinkStore } from 'pc/worker';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch } from 'react-redux';
import NoDataImg from 'static/icon/workbench/workbench_account_nodata.png';

message.config({
  maxCount: 1,
});

const customizeRenderEmpty = () => (
  <div className="emptyPlaceholder">
    <Image alt="no data" src={NoDataImg} className="img" width={160} height={120} />
    <div className="title">{t(Strings.no_data)}</div>
  </div>
);

const antdConfig = {
  autoInsertSpaceInButton: false,
  renderEmpty: customizeRenderEmpty,
};

const RouterProvider = ({ children }) => {
  const cacheScrollMap = useRef({});
  const dispatch = useDispatch();

  // 记录面板展示模式 - 从 localStorage 中初始化 redux
  useEffect(() => {
    dispatch(StoreActions.setRecordVision(getStorage(StorageName.RecordVision) || RecordVision.Center));
  }, [dispatch]);

  // 解决在飞书中路由跳转需要带上一个飞书标识，所以把 a 标签的行为代理到 navigationToUrl 中一起处理
  useEffect(() => {
    const isFeishu = navigator.userAgent.toLowerCase().indexOf('lark') > -1;
    const clickHandler = (e) => {
      // 由于配置表中有写死的url(vika.cn开头)，为了多环境测试，需要开放vika.cn
      const reg = new RegExp(`^(${window.location.origin}|(http|https)://vika.cn)`);
      const paths = ['/user', '/login', '/org', '/workbench', '/notify', '/management', '/invite', '/template', '/share'];
      let element = e.target;
      while (element && element.tagName !== 'A') {
        element = element.parentNode;
      }
      const url: string = element?.href;
      if (!url || !isFeishu || (element.tagName !== 'A') || !reg.test(url)) {
        return;
      }
      const isIgnore = paths.some(item => url.includes(item));
      if (isIgnore) {
        return;
      }
      e.preventDefault();
      navigationToUrl(url, { method: (e.target.target || '_self') === '_self' ? Method.Push : Method.NewTab });
    };
    window.addEventListener('click', clickHandler);
    return () => {
      window.removeEventListener('click', clickHandler);
      comlinkStore.proxy?.[releaseProxy]();
      comlinkStore.worker?.terminate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 打开 http 协议的链接自动重定向到 https
  useEffect(() => {
    if (!getEnvVariables()?.FORCE_HTTPS) {
      return;
    }

    const targetProtocol = 'https:';
    const urlObj = new URL(window.location.href);
    if (urlObj.protocol !== targetProtocol) {
      urlObj.protocol = targetProtocol;
      window.location.href = urlObj.href;
    }
  }, []);

  useNavigatorName();
  useViewTypeTrack(); // 视图类型埋点

  useEffect(() => {
    // 添加请求拦截器
    axios.interceptors.request.use(config => {
      // console.log(config);
      // 在发送请求之前做些什么
      config.headers['X-XSRF-TOKEN'] = getCookie('XSRF-TOKEN');
      return config;
    }, error => {
      // 对请求错误做些什么
      return Promise.reject(error);
    });
  }, [dispatch]);

  useEffect(
    () => {
      const onResize = () => {
        dispatch(StoreActions.setScreenWidth(window.innerWidth));
      };
      dispatch(StoreActions.setScreenWidth(window.innerWidth));
      window.addEventListener('resize', onResize);
      return () => {
        window.removeEventListener('resize', onResize);
      };
    },
    [dispatch],
  );

  const changeCacheScroll = (value: IScrollOffset, dsId?: string, vId?: string) => {
    if (!store) {
      return;
    }
    const state = store.getState();
    const { datasheetId, viewId } = state.pageParams;
    const key = `${dsId || datasheetId},${vId || viewId}`;

    const oldCacheValue = cacheScrollMap.current[key] || {};
    const next = {
      ...cacheScrollMap.current,
      [key]: {
        ...oldCacheValue,
        ...value
      }
    };

    cacheScrollMap.current = next;
  };

  return <ConfigProvider {...antdConfig}>
    <ResourceContext.Provider value={resourceService.instance}>
      <DndProvider backend={HTML5Backend}>
        <ScrollContext.Provider value={{
          cacheScrollMap,
          changeCacheScroll
        }}>
          {children}
        </ScrollContext.Provider>
      </DndProvider>
      <VersionUpdater />
    </ResourceContext.Provider>
  </ConfigProvider>;
};
export default RouterProvider;
