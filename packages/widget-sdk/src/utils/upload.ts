import { uploadAttachToS3, UploadType } from './upload_attach_to_S3';
import { cellValueToImageSrc } from 'core';
import { IAttachmentValue, IUploadProgress } from 'interface';
import { identity, pickBy } from 'lodash';

/**
 * 一个上传文件方法，可以使用此方法上传文件，去完成附件字段的写入
 *
 * @param params.file 文件
 * @param params.datasheetId 维格表ID
 * @param params.onProgress 文件上传进度回调方法
 * @returns
 *
 * ### 示例
 * ``` ts
 * import React, { useState } from 'react';
 * import { upload, useDatasheet } from '@vikadata/widget-sdk';
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
        onUploadProgress: ({ loaded, total }: IUploadProgress) => {
          onProgress && onProgress({ loaded, total });
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
      name: data.name,
      mimeType: data.mimeType,
      token: data.token,
      bucket: data.bucket,
      size: data.size,
      width: data.width,
      height: data.height,
      preview: data.preview,
      // 附加值
      previewUrl: data.preview ? cellValueToImageSrc(data, { isPreview: true }) : undefined,
      url: cellValueToImageSrc(data),
    }, identity) as IAttachmentValue);
  });
}
