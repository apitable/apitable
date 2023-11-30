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

import axios from 'axios';
import * as Url from './url.data';
import Qs from 'qs';
import { IApiWrapper, IServerMirror } from '../../../exports/store/interfaces';
import urlcat from 'urlcat';

const baseURL = process.env.NEXT_PUBLIC_NEXT_API;

export const fetchMirrorInfo = (mirrorId: string) => {
  return axios.get<IApiWrapper & { data: IServerMirror }>(urlcat(Url.READ_MIRROR_INFO, { mirrorId }), { baseURL });
};

export const fetchMirrorDataPack = (mirrorId: string, recordIds?: string[]) => {
  return axios.get<IApiWrapper & { data: IServerMirror }>(urlcat(Url.READ_MIRROR_DATA_PACK, { mirrorId }), {
    baseURL,
    params: {
      recordIds
    },
    paramsSerializer: params => {
      return Qs.stringify(params, { arrayFormat: 'repeat' });
    }
  });
};

export const fetchShareMirrorInfo = (shareId: string, mirrorId: string) => {
  return axios.get<IApiWrapper & { data: IServerMirror }>(urlcat(Url.READ_SHARE_MIRROR_INFO, { shareId, mirrorId }), { baseURL });
};

export const fetchShareMirrorDataPack = (shareId: string, mirrorId: string) => {
  return axios.get<IApiWrapper & { data: IServerMirror }>(urlcat(Url.READ_SHARE_MIRROR_DATA_PACK, { shareId, mirrorId }), { baseURL });
};

