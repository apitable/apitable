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
import { FC } from 'react';
import { t, Strings } from '@apitable/core';
import LoadingAnimationJson from 'static/json/datasheet_icon_loading.json';
import OfflineAnimationJson from 'static/json/datasheet_icon_offline.json';
import OnlineAnimationJson from 'static/json/datasheet_icon_online.json';
import SyncAnimationJson from 'static/json/datasheet_icon_sync.json';
import { Tooltip } from '../common';
import styles from './style.module.less';

export enum Network {
  Online = 'online',
  Offline = 'offline',
  Sync = 'sync',
  Loading = 'loading',
}

export const NetworkTip = {
  online: t(Strings.network_icon_hover_connected),
  offline: t(Strings.network_icon_hover_disconnected),
  sync: t(Strings.network_icon_hover_data_synchronization),
  loading: t(Strings.network_icon_hover_reconnection),
};

export interface INetworkStatusProps {
  currentStatus?: Network;
}

const ID = {
  NETWORK_ONLINE: 'network_online',
  NETWORK_OFFLINE: 'network_offline',
  NETWORK_SYNC: 'network_sync',
  NETWORK_LOADING: 'network_loading',
};

export const NetworkStatus: FC<React.PropsWithChildren<INetworkStatusProps>> = (props) => {
  const { currentStatus = Network.Online } = props;

  useMount(() => {
    import('lottie-web/build/player/lottie_svg').then((module) => {
      const lottie = module.default;

      [
        document.querySelector(`#${ID.NETWORK_ONLINE}`),
        document.querySelector(`#${ID.NETWORK_OFFLINE}`),
        document.querySelector(`#${ID.NETWORK_SYNC}`),
        document.querySelector(`#${ID.NETWORK_LOADING}`),
      ].forEach((el) => {
        if (el) el.innerHTML = '';
      });

      lottie.loadAnimation({
        container: document.querySelector(`#${ID.NETWORK_ONLINE}`)!,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: OnlineAnimationJson,
      });
      lottie.loadAnimation({
        container: document.querySelector(`#${ID.NETWORK_OFFLINE}`)!,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: OfflineAnimationJson,
      });
      lottie.loadAnimation({
        container: document.querySelector(`#${ID.NETWORK_SYNC}`)!,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: SyncAnimationJson,
      });
      lottie.loadAnimation({
        container: document.querySelector(`#${ID.NETWORK_LOADING}`)!,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: LoadingAnimationJson,
      });
    });
  });

  return (
    <div className={styles.networkStatus}>
      <Tooltip title={NetworkTip[currentStatus]} placement="bottomRight">
        <div className={styles.network}>
          <div id={ID.NETWORK_ONLINE} style={{ display: currentStatus === Network.Online ? 'flex' : 'none' }} />
          <div id={ID.NETWORK_OFFLINE} style={{ display: currentStatus === Network.Offline ? 'flex' : 'none' }} />
          <div id={ID.NETWORK_SYNC} style={{ display: currentStatus === Network.Sync ? 'flex' : 'none' }} />
          <div id={ID.NETWORK_LOADING} style={{ display: currentStatus === Network.Loading ? 'flex' : 'none' }} />
        </div>
      </Tooltip>
    </div>
  );
};
