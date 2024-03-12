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

import { useMount } from 'ahooks';
import { ConfigProvider, message } from 'antd';
import { Locale } from 'antd/lib/locale-provider';
import axios from 'axios';
import { releaseProxy } from 'comlink';
import Image from 'next/image';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { getLanguage, RecordVision, StoreActions, Strings, t, ThemeName } from '@apitable/core';
import { Method } from 'pc/components/route_manager/const';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import VersionUpdater from 'pc/components/version_updater';
import { IScrollOffset, ScrollContext } from 'pc/context';
import { useNavigatorName } from 'pc/hooks';
import { useBlackSpace } from 'pc/hooks/use_black_space';
import { ResourceContext, resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { getCookie } from 'pc/utils';
import { dndH5Manager, dndTouchManager } from 'pc/utils/dnd_manager';
import { getEnvVariables } from 'pc/utils/env';
import { browserIsDesktop } from 'pc/utils/os';
import { getStorage, StorageName } from 'pc/utils/storage';
import { comlinkStore } from 'pc/worker';
import EmptyPngDark from 'static/icon/datasheet/empty_state_dark.png';
import EmptyPngLight from 'static/icon/datasheet/empty_state_light.png';

message.config({
  maxCount: 1,
});

const RenderEmpty = () => {
  const theme = useAppSelector((state) => state.theme);
  const NoDataImg = theme === ThemeName.Light ? EmptyPngLight : EmptyPngDark;
  return (
    <div className="emptyPlaceholder">
      <Image alt="no data" src={NoDataImg} className="img" width={200} height={150} />
      <div className="title">{t(Strings.no_data)}</div>
    </div>
  );
};

export const antdConfig = {
  autoInsertSpaceInButton: false,
  renderEmpty: () => <RenderEmpty />,
};

const RouterProvider = ({ children }: any) => {
  const cacheScrollMap = useRef({});
  const dispatch = useDispatch();
  const [isDesktopDevice, setIsDesktopDevice] = React.useState<boolean>();

  useMount(async () => {
    const isDesktop = await browserIsDesktop();
    setIsDesktopDevice(isDesktop);
  });

  // Logging panel presentation mode - initializing redux from localStorage
  useEffect(() => {
    dispatch(StoreActions.setRecordVision(getStorage(StorageName.RecordVision) || RecordVision.Center));
  }, [dispatch]);

  // To solve the problem of routing in Feishu needs to bring a Feishu logo,
  // so the behavior of the a tag is handled together with the proxy in navigationToUrl
  useEffect(() => {
    const isFeishu = navigator.userAgent.toLowerCase().indexOf('lark') > -1;
    const clickHandler = (e: any) => {
      const reg = new RegExp(`^(${window.location.origin}|(http|https)://vika.cn)`);
      const paths = ['/user', '/login', '/org', '/workbench', '/notify', '/management', '/invite', '/template', '/share'];
      let element = e.target;
      while (element && element.tagName !== 'A') {
        element = element.parentNode;
      }
      const url: string = element?.href;
      if (!url || !isFeishu || element.tagName !== 'A' || !reg.test(url)) {
        return;
      }
      const isIgnore = paths.some((item) => url.includes(item));
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
    // eslint-disable-next-line
  }, []);

  // Links for the http protocol are automatically redirected to https
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
  useBlackSpace();

  useEffect(() => {
    axios.interceptors.request.use(
      (config) => {
        config.headers['X-XSRF-TOKEN'] = getCookie('XSRF-TOKEN');
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }, [dispatch]);

  useEffect(() => {
    const onResize = () => {
      dispatch(StoreActions.setScreenWidth(window.innerWidth));
    };
    dispatch(StoreActions.setScreenWidth(window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [dispatch]);

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
        ...value,
      },
    };

    cacheScrollMap.current = next;
  };

  const dndManager = isDesktopDevice ? dndH5Manager : dndTouchManager;

  const lang = getLanguage().replace('-', '_');
  const [locale, setLocale] = React.useState<Locale>();

  const getLocale = async (_lang) => {
    const _locale = await import(`antd/es/locale/${_lang}`).then(module => module.default);
    setLocale(_locale);
  };

  useEffect(() => {
    getLocale(lang);
  }, [lang]);

  return (
    <ConfigProvider {...antdConfig} locale={locale}>
      <ResourceContext.Provider value={resourceService.instance}>
        <DndProvider manager={dndManager}>
          <ScrollContext.Provider
            value={{
              cacheScrollMap,
              changeCacheScroll,
            }}
          >
            {children}
          </ScrollContext.Provider>
        </DndProvider>
        <VersionUpdater />
      </ResourceContext.Provider>
    </ConfigProvider>
  );
};
export default RouterProvider;
