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
import { IApiWrapper } from '../../../exports/store/interfaces';
import { IServerFormPack } from 'modules/database/store/interfaces/resource/form';
import urlcat from 'urlcat';

const baseURL = process.env.NEXT_PUBLIC_NEXT_API;

export function fetchFormPack(formId: string) {
  return axios.get<IApiWrapper & { data: IServerFormPack }>(urlcat(Url.FORMPACK, { formId }), { baseURL });
}

export function fetchShareFormPack(shareId: string, formId: string) {
  return axios.get<IApiWrapper & { data: IServerFormPack }>(urlcat(Url.READ_SHARE_FORMPACK, { shareId, formId }), { baseURL });
}

export function fetchTemplateFormPack(templateId: string, formId: string) {
  return axios.get<IApiWrapper & { data: IServerFormPack }>(urlcat(Url.READ_TEMPLATE_FORMPACK, { templateId, formId }), { baseURL });
}

export function addFormRecord(formId: string, recordData: any) {
  return axios.post<IApiWrapper & { data: any }>(urlcat(Url.FORM_ADD_RECORD, {
    formId,
  }), recordData, { baseURL });
}

export function addShareFormRecord(formId: string, shareId: string | undefined, recordData: any) {
  return axios.post<IApiWrapper & { data: any }>(urlcat(Url.SHARE_FORM_ADD_RECORD, {
    formId, shareId,
  }), recordData, { baseURL });
}

export function fetchFormProps(formId: string) {
  return axios.get<IApiWrapper & { data: any }>(urlcat(Url.READ_FORM_PROPS, { formId }), { baseURL });
}

export function updateFormProps(formId: string, formProps: any) {
  return axios.post<IApiWrapper & { data: any }>(urlcat(Url.UPDATE_FORM_PROPS, {
    formId,
  }), formProps, { baseURL });
}

export function fetchFormSubmitStatus(formId: string) {
  return axios.get<IApiWrapper & { data: any }>(urlcat(Url.READ_FORM_SUBMIT_STATUS, { formId }), { baseURL });
}
