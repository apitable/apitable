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
import QRCode from 'qrcode';
import { FC } from 'react';

import { Message } from 'pc/components/common';

export interface IGenerateQrCodeProps {
  url: string;
  color: string;
  width: number;
  id: string;
}

export const GenerateQrCode: FC<React.PropsWithChildren<IGenerateQrCodeProps>> = ({ url, color, width = 128, id }) => {
  useMount(() => {
    QRCode.toCanvas(
      url,
      {
        errorCorrectionLevel: 'H',
        margin: 0,
        width,
        color: {
          dark: color,
        },
      },
      (err, canvas) => {
        if (err) {
          Message.error({ content: 'generation QrCode failed' });
          return;
        }
        const container = document.getElementById(id);
        container?.appendChild(canvas);
      },
    );
  });

  return <div id={id} style={{ width, height: width }} />;
};
