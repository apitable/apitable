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
import { useEffect, useRef } from 'react';
import { Events, Player } from '@apitable/core';
import AutoSaveJson from 'static/json/autosave.json';

const AUTO_SAVE_SVG_ID = 'AUTO_SAVE_SVG_ID';
export const AutoSaveLottie = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    import('lottie-web/build/player/lottie_svg').then((module) => {
      const lottie = module.default;
      lottie.loadAnimation({
        // @ts-ignore
        container: ref.current,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: AutoSaveJson,
      });
      Player.doTrigger(Events.view_notice_auto_save_true);
    });
  }, [ref]);

  return <div ref={ref} id={AUTO_SAVE_SVG_ID} style={{ display: 'flex' }} />;
};
