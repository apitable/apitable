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

import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import styles from './styles.module.less';

export const useShowTip = (container: HTMLElement, tipWidth: number) => {
  const [info, setInfo] = useState({
    top: 0,
    title: '',
    desc: '',
  });

  const { left } = useMemo(() => {
    if (!container) return { left: 0 };
    const rect = container.getBoundingClientRect();
    const clientWidth = window.innerWidth;
    const containerRight = rect.right;
    const containerLeft = rect.left;
    if (containerRight + tipWidth > clientWidth) {
      return {
        left: containerLeft - tipWidth,
      };
    }
    return {
      left: containerRight,
    };
    // eslint-disable-next-line
  }, [container]);

  useEffect(() => {
    let root: any;

    function unMountDiv() {
      root?.unmount();
      const dom = document.querySelector('.vika-type-select-tip');
      dom && document.body.removeChild(dom);
    }

    unMountDiv();

    if (info.top) {
      const div = document.createElement('div');
      div.setAttribute('class', 'vika-type-select-tip');
      div.setAttribute('style', `top:${info.top}px;left:${left}px;position:fixed;z-index:1100;`);
      document.body.appendChild(div);
      root = createRoot(div);
      root.render(
        <div className={styles.tip}>
          <h3>{info.title}</h3>
          <p>{info.desc}</p>
        </div>,
      );
    }
    return () => {
      unMountDiv();
    };
    // eslint-disable-next-line
  }, [info, left]);

  return {
    setInfo,
  };
};
