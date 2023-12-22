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

import { useEffect } from 'react';
import { Strings, t } from '@apitable/core';
import { showBannerAlert } from 'pc/components/notification/banner_alert';
import { useAppSelector } from 'pc/store/react-redux';
// @ts-ignore
import { goToUpgrade } from 'enterprise/subscribe_system/upgrade_method';

const BLACK_SPACE_BANNER_ALERT = 'BLACK_SPACE_BANNER_ALERT';

const _showBannerAlert = (destroyPrev = false) => {
  showBannerAlert({
    content: t(Strings.black_space_alert),
    upgrade: true,
    destroyPrev,
    onBtnClick: goToUpgrade,
    id: BLACK_SPACE_BANNER_ALERT,
  });
};

export const useBlackSpace = () => {
  const isBlackSpace = useAppSelector((state) => state.billing?.subscription?.blackSpace);

  useEffect(() => {
    if (!isBlackSpace || location.href.includes('upgrade')) {
      return;
    }

    _showBannerAlert();
    const MutationObserver = window.MutationObserver || (window as any).WebKitMutationObserver || (window as any).MozMutationObserver;
    const mutationObserver = new MutationObserver((list) => {
      list.forEach((item) => {
        if (item.target === document.body) {
          const result = [...item.removedNodes.values()].some((node) => {
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
      subtree: true,
    });

    const dom = document.getElementById(BLACK_SPACE_BANNER_ALERT);

    if (!dom) {
      return;
    }

    mutationObserver.observe(dom, {
      childList: true,
      subtree: true,
    });
  }, [isBlackSpace]);
};
