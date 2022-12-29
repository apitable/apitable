import axios from 'axios';
import * as Url from './url.data';
import Qs from 'qs';
import { IApiWrapper, IServerMirror } from '../../../exports/store';
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

