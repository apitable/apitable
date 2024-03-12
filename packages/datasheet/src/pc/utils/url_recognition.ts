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

import { Api, Strings, t } from '@apitable/core';
import { Message } from 'pc/components/common/message/message';

interface ISetURLRecogProps {
  url: string;
  callback: (meta: IURLMeta) => unknown;
}

export interface IURLMeta {
  isAware: boolean;
  favicon: string | null;
  title: string | null;
}

export const recognizeURLAndSetTitle = async ({ url, callback }: ISetURLRecogProps) => {
  const res = await Api.getURLMetaBatch([url]);

  if (res?.data?.success) {
    const meta: IURLMeta = res.data.data.contents[url];

    if (meta?.isAware) {
      callback(meta);
    } else {
      Message.warning({
        content: t(Strings.url_recog_failure_message),
      });
    }
  } else {
    Message.error({
      content: res.data.message,
    });
  }
};
