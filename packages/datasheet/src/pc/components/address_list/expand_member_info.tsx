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

import { Drawer } from 'antd';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Strings, t } from '@apitable/core';
import { ChevronLeftOutlined } from '@apitable/icons';
import { store } from 'pc/store';
import { MemberInfo } from './member_info';
import styles from './style.module.less';

export const expandMemberInfo = () => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = createRoot(div);

  function destroy() {
    root.unmount();
    if (div.parentNode) {
      div.parentNode.removeChild(div);
    }
  }

  function close() {
    setTimeout(() => {
      destroy();
    }, 0);
  }

  function render() {
    setTimeout(() => {
      root.render(
        <Provider store={store}>
          <div className={styles.memberInfoDrawer}>
            <Drawer placement="right" height={'100%'} width={'100%'} visible closable={false}>
              <div className={styles.mobileBack} onClick={close}>
                <ChevronLeftOutlined color="currentColor" />
                <span>{t(Strings.back)}</span>
              </div>
              <MemberInfo />
            </Drawer>
          </div>
        </Provider>,
      );
    });
  }

  render();
};
