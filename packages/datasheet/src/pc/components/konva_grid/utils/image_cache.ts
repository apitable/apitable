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

import { getEnvVariables } from 'pc/utils/env';

interface IImageOption {
  crossOrigin?: boolean;
}

export const imageCache = (() => {
  const imageMap: {
    [name: string]: {
      img: HTMLImageElement;
      success: boolean;
    };
  } = {};
  const imgPromises: any = [];

  function loadImage(name: string, src: string, option?: IImageOption) {
    imgPromises.push(
      new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.referrerPolicy = 'no-referrer';

        if (!option?.crossOrigin && getEnvVariables().IS_CANVAS_IMAGE_CROSS_ORIGIN) {
          img.crossOrigin = 'Anonymous';
        }

        imageMap[name] = {
          img,
          success: false,
        };

        try {
          img.onload = () => {
            imageMap[name] = {
              img,
              success: true,
            };

            resolve({
              name,
              img,
            });
          };
        } catch (err) {
          // code never reach
          imageMap[name] = {
            img,
            success: false,
          };
          reject(err);
        }
      }),
    );
  }

  function loadImageMap(urlMap: { [x: string]: string }) {
    Object.keys(urlMap).forEach((key) => {
      loadImage(key, urlMap[key]);
    });
  }

  function imageMapOnload(callback: any) {
    Promise.all(imgPromises).then(callback);
  }

  function getImage(name: string) {
    const imgInfo = imageMap[name];

    if (imgInfo == null) {
      return null;
    }

    const { img, success } = imgInfo;

    if (!success) return false;
    return img;
  }

  return {
    loadImage,
    loadImageMap,
    getImage,
    imageMapOnload,
    imageMap,
  };
})();
