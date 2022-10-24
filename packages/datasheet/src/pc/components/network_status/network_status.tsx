import { FC } from 'react';
import styles from './style.module.less';
import LoadingAnimationJson from 'static/json/datasheet_icon_loading.json';
import SyncAnimationJson from 'static/json/datasheet_icon_sync.json';
import OfflineAnimationJson from 'static/json/datasheet_icon_offline.json';
import OnlineAnimationJson from 'static/json/datasheet_icon_online.json';
import { useMount } from 'ahooks';
import { t, Strings } from '@apitable/core';
import { Tooltip } from '../common';

export enum Network {
  Online = 'online', // 正常网络情况
  Offline = 'offline',
  Sync = 'sync', // 数据协同中
  Loading = 'loading',
}

export const NetworkTip = {
  online: t(Strings.network_icon_hover_connected),
  offline: t(Strings.network_icon_hover_disconnected),
  sync: t(Strings.network_icon_hover_data_synchronization),
  loading: t(Strings.network_icon_hover_reconnection),
};

export interface INetworkStatusProps {
  // 暂时可选属性
  currentStatus?: Network;
}

const ID = {
  NETWORK_ONLINE: 'network_online',
  NETWORK_OFFLINE: 'network_offline',
  NETWORK_SYNC: 'network_sync',
  NETWORK_LOADING: 'network_loading',
};

export const NetworkStatus: FC<INetworkStatusProps> = props => {
  const { currentStatus = Network.Online } = props;

  useMount(() => {
    import('lottie-web/build/player/lottie_svg').then(module => {
      const lottie = module.default;

      [
        document.querySelector(`#${ID.NETWORK_ONLINE}`),
        document.querySelector(`#${ID.NETWORK_OFFLINE}`),
        document.querySelector(`#${ID.NETWORK_SYNC}`),
        document.querySelector(`#${ID.NETWORK_LOADING}`),
      ].forEach(el => {
        if(el) el.innerHTML = '';
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
      <Tooltip
        title={NetworkTip[currentStatus]}
        placement="bottomRight"
      >
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
