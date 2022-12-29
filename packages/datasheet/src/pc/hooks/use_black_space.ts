import { Strings, t } from '@apitable/core';
// @ts-ignore
import { goToUpgrade } from 'enterprise';
import { showBannerAlert } from 'pc/components/notification/banner_alert';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const BLACK_SPACE_BANNER_ALERT = 'BLACK_SPACE_BANNER_ALERT';

const _showBannerAlert = (destroyPrev = false) => {
  showBannerAlert({
    content: t(Strings.black_space_alert),
    upgrade: true,
    destroyPrev,
    onBtnClick: goToUpgrade,
    id: BLACK_SPACE_BANNER_ALERT
  });
};

export const useBlackSpace = () => {
  const isBlackSpace = useSelector(state => state.billing.subscription?.blackSpace);

  useEffect(() => {
    if (!isBlackSpace || location.href.includes('upgrade')) {
      return;
    }

    _showBannerAlert();
    const MutationObserver = window.MutationObserver || (window as any).WebKitMutationObserver || (window as any).MozMutationObserver;
    const mutationObserver = new MutationObserver((list) => {
      list.forEach(item => {
        if (item.target === document.body) {
          const result = [...item.removedNodes.values()].some(node => {
            return node['id'] === BLACK_SPACE_BANNER_ALERT;
          });
          if (result) {
            _showBannerAlert();
          }
        }
        const dom = document.getElementById(BLACK_SPACE_BANNER_ALERT);
        if (dom && item.removedNodes.length && dom.contains(item.target)) {
          _showBannerAlert(true);
        }
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    const dom = document.getElementById(BLACK_SPACE_BANNER_ALERT);

    if (!dom) {
      return;
    }

    mutationObserver.observe(dom, {
      childList: true,
      subtree: true
    });

  }, [isBlackSpace]);

};
