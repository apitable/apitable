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

import { Editor } from 'slate';

export type TApi = (...params: Array<any>) => Promise<unknown>;

export interface IImageResponse {
  imgUrl: string;
}

const Api = new WeakMap();

export enum ApiKeys {
  ImageUpload = 'imageUpload',
}

export const setApi = (editor: Editor, name: ApiKeys, api?: TApi) => {
  const space = Api.get(editor);
  if (!space) {
    Api.set(editor, { [name]: api });
  } else {
    Api.set(editor, { ...space, [name]: api });
  }
};

export const getApi = (editor: Editor, name: ApiKeys) => {
  const space = Api.get(editor);
  if (!space) {
    return null;
  }
  return space[name];
};
