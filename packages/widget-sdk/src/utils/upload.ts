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

import { uploadAttachToS3, UploadType } from './private/upload_attach_to_S3';
import { cellValueToImageSrc } from 'core';
import { IAttachmentValue, IUploadProgress } from 'interface';
import { identity, pickBy } from 'lodash';

/**
 * An upload file method that can be used to upload a file and go through the attachment field writing.
 *
 * @param params.file Files to be uploaded.
 * @param params.datasheetId Upload files to datasheet.
 * @param params.onProgress File upload progress callback method.
 * @returns
 *
 * ### Example
 * ``` ts
 * import React, { useState } from 'react';
 * import { upload, useDatasheet } from '@apitable/widget-sdk';
 *
 * function UploadFile() {
 *   const datasheet = useDatasheet();
 *   const [progress, setProgress] = useState(0);
 *   const [error, setError] = useState();
 *   function uploadFile(file) {
 *     datasheet && upload({
 *       file,
 *       datasheetId: datasheet?.datasheetId,
 *       onProgress: ({ loaded, total }) => {
 *         setProgress(loaded / total);
 *       }
 *     }).then(response => {
 *     const valuesMap = { fldGi8tYQfXcc: [response] };
 *     const permission = datasheet.checkPermissionsForAddRecord(valuesMap);
 *       if (permission.acceptable) {
 *         datasheet.addRecord(valuesMap);
 *       } else {
 *         setError(permission.message);
 *       }
 *     });
 *   }
 *   return (
 *     <div>
 *       <input type="file" onChange={(e) => {
 *         e.target.files?.[0] && uploadFile(e.target.files[0])
 *       }}/>
 *       <p>progress: {progress}</p>
 *       { error && <p>error: {error}</p>}
 *     </div>
 *   )
 * }
 * ```
 */
export function upload(params: {
  file: File,
  datasheetId: string;
  /** */
  onProgress?: (response: IUploadProgress) => void;
}): Promise<IAttachmentValue> {
  const { file, datasheetId, onProgress } = params;
  return new Promise(async(resolve, reject) => {
    if (!file || !datasheetId) {
      reject({ message: 'file or datasheetId is required' });
    }

    const res = await uploadAttachToS3({
      file,
      fileType: UploadType.DstAttachment,
      nodeId: datasheetId,
      axiosConfig: {
        onUploadProgress: ({ loaded, total }) => {
          return onProgress && onProgress({ loaded, total });
        },
      },
    });

    const { success, data, message } = res.data;
    if (!success) {
      reject({
        message
      });
      return;
    }

    resolve(pickBy({
      id: data.token,
      name: data.name || file.name,
      mimeType: data.mimeType,
      token: data.token,
      bucket: data.bucket,
      size: data.size,
      width: data.width,
      height: data.height,
      preview: data.preview,
      previewUrl: data.preview ? cellValueToImageSrc(data, { isPreview: true }) : undefined,
      url: cellValueToImageSrc(data),
    }, identity) as IAttachmentValue);
  });
}
