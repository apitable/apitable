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

import { Api, IApiWrapper } from '@apitable/core';
import { ApiInterface } from '@apitable/core';
import axios, { AxiosRequestConfig, Method } from 'axios';

import { IUploadCertificate, IUploadFileForSaaS, UploadType } from './upload.interface';

type IGetUploadCertificateResponse = ApiInterface.IGetUploadCertificateResponse;

async function getCertificate(
  params: IUploadCertificate
): Promise<(IApiWrapper & { data: IGetUploadCertificateResponse[] }) | IGetUploadCertificateResponse[]> {
  const res = await Api.getUploadCertificate(params);
  const { data, success } = res.data;
  if (!success) {
    return res.data;
  }
  return data;
}

async function uploadDirectOSS(
  uploadCertificate: IGetUploadCertificateResponse,
  file: File,
  axiosConfig?: AxiosRequestConfig | undefined
): Promise<void> {
  const requestMethod = String(uploadCertificate.uploadRequestMethod).toLowerCase();
  await axios({
    url: convertOrigin(uploadCertificate.uploadUrl),
    method: requestMethod as Method,
    data: file,
    ...axiosConfig,
  });
}

/**
 * Private deployments use minio and need to replace the data in origin according to the current environment.
 */
function convertOrigin(url: string) {
  const _url = new URL(url);
  if (/http:\/\/minio/.test(_url.origin)) {
    return `${location.origin}${_url.pathname}${_url.search}`;
  }
  return url;
}

async function notify(uploadCertificate: IGetUploadCertificateResponse, type: UploadType) {
  const res = await Api.getS3Callback({
    resourceKeys: [uploadCertificate.token],
    type
  });
  const { data } = res.data;
  return {
    data: {
      ...res.data,
      data: Array.isArray(data) ? data[0] : data
    }
  };
}

export async function uploadAttachToS3(optional: IUploadFileForSaaS): Promise<any> {
  const { nodeId, fileType, file, axiosConfig, data = '' } = optional;
  const _fileType = file.type;

  if (_fileType === 'text/html') {
    return;
  }

  const uploadCertificates = await getCertificate({ count: 1, type: fileType, data, nodeId });

  if (!Array.isArray(uploadCertificates)) {
    // If you get an error when getting a pre-signature, return the pre-signed error message directly.
    return uploadCertificates;
  }

  await uploadDirectOSS(
    uploadCertificates[0]!,
    file,
    {
      ...axiosConfig,
      headers: { 'Content-Type': _fileType },
    }
  );
  return notify(uploadCertificates[0]!, fileType);
}
