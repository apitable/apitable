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

import { shallowEqual } from 'react-redux';
import { getImageThumbSrc, Strings, t } from '@apitable/core';
import { uploadAttachToS3, UploadType } from '@apitable/widget-sdk';
import { Message } from 'pc/components/common/message/message';
import { joinPath } from 'pc/components/route_manager/helper';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
import { UploadManager } from '../utils/upload_manager';

export const useImageUpload = () => {
  const { folderId, datasheetId } = useAppSelector((state) => {
    const { folderId, datasheetId } = state.pageParams;
    return { folderId, datasheetId };
  }, shallowEqual);

  const uploadImage = (file: File) => {
    if (UploadManager.checkFileSize(file)) {
      Message.warning({ content: t(Strings.message_file_size_out_of_upperbound) });
      return Promise.reject('size error');
    }
    const fd = UploadManager.generateFormData(file, folderId || datasheetId!, '4');
    const type = file.type || '';
    const isSvgOrGif = /(svg|gif)/i.test(type);
    return uploadAttachToS3({
      file: fd.get('file')! as File,
      nodeId: folderId || datasheetId!,
      fileType: UploadType.NodeDesc,
    }).then((res) => {
      const {
        data: { data: imgData, success, message },
      } = res;
      if (!success) {
        Message.warning({ content: message });
        return Promise.reject(message);
      }
      const { bucket, token } = imgData;
      const host = getEnvVariables()[bucket];
      return Promise.resolve({
        imgUrl: getImageThumbSrc(joinPath([host, token]), isSvgOrGif ? undefined : { format: 'jpg', quality: 100 }),
      });
    });
  };

  return { uploadImage };
};
