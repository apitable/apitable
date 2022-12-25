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

import { useRef, useEffect } from 'react';
import SyncJson from 'static/json/sync.json';
import lottie from 'lottie-web/build/player/lottie_svg';

const MANUAL_SAVE_SVG_ID = 'MANUAL_SAVE_SVG_ID';
export const ManualSaveLottie = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    lottie.loadAnimation({
      container: ref.current,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: SyncJson
    });
  }, [ref]);

  return <div ref={ref} id={MANUAL_SAVE_SVG_ID} style={{ display: 'flex' }} />;
};
