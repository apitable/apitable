import { getImageThumbSrc, Settings, Strings, t } from '@vikadata/core';
import { Message } from 'pc/components/common';
import { shallowEqual, useSelector } from 'react-redux';
import { UploadManager } from '../utils/upload_manager';
import { uploadAttachToS3, UploadType } from '@vikadata/widget-sdk';

export const useImageUpload = () => {
  const { folderId, datasheetId } = useSelector(state => {
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
      fileType: UploadType.NodeDesc
    }).then((res) => {
      const { data: { data: imgData, success, message }} = res;
      if (!success) {
        Message.warning({ content: message });
        return Promise.reject(message);
      }
      const { bucket, token } = imgData;
      return Promise.resolve({
        imgUrl: getImageThumbSrc(Settings[bucket].value + token, isSvgOrGif ? undefined : { format: 'jpg', quality: 100 })
      });
    });
  };

  return { uploadImage };
};
