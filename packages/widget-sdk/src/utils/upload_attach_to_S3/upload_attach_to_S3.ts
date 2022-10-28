import { Api, IApiWrapper } from '@apitable/core';
import { IGetUploadCertificateResponse } from '@apitable/core/dist/api/api.interface';
import axios, { AxiosRequestConfig, Method } from 'axios';

import { IUploadCertificate, IUploadFileForSaaS, UploadType } from 'utils/upload_attach_to_S3/upload.interface';

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
    uploadCertificates[0],
    file,
    {
      ...axiosConfig,
      headers: { 'Content-Type': _fileType },
    }
  );
  return notify(uploadCertificates[0], fileType);
}
