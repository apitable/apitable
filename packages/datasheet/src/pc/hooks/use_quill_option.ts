import { getImageThumbSrc, Settings, Strings, t } from '@vikadata/core';
import { uploadAttachToS3, UploadType } from '@vikadata/widget-sdk';
import { Message } from 'pc/components/common';
import Quill, { StringMap } from 'quill';
import QuillImageDropAndPaste from 'quill-image-drop-and-paste';
import MarkdownShortcuts from 'quill-markdown-shortcuts';
import { useCallback, useMemo } from 'react';
import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';
import { UploadManager } from '../utils/upload_manager';

Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste);
Quill.register('modules/markdownShortcuts', MarkdownShortcuts);

function base64ToFile(base64: string) {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];

  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], '', { type: mime });
}

type IUseQuillOption = (
  quillRef: React.MutableRefObject<ReactQuill | null>,
) => StringMap;

export const useQuillOption: IUseQuillOption = quillRef => {
  const { folderId, datasheetId, nodeId } = useSelector(state => state.pageParams);

  function uploadImage(fd: FormData) {
    return uploadAttachToS3({
      file: fd.get('file'),
      nodeId,
      fileType: UploadType.NodeDesc
    });
  }

  const uploadAndUpdateEdit = useCallback(async(file: File) => {
    const fd = UploadManager.generateFormData(file, folderId || datasheetId!, '4');
    const { data: { data: imgData, success, message }} = await uploadImage(fd);
    if (!success) {
      Message.warning({ content: message });
      return;
    }
    const { bucket, token } = imgData;
    const range = quillRef.current!.getEditor().getSelection()!;
    quillRef.current!.getEditor().insertEmbed(
      range.index,
      'image',
      getImageThumbSrc(Settings[bucket].value + token, { format: 'jpg', quality: 100 }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId, datasheetId, quillRef]);

  const pasteImageHandler = useCallback(value => {
    const file = base64ToFile(value);
    uploadAndUpdateEdit(file);
  }, [uploadAndUpdateEdit]);

  const toolbarOptions = useMemo(() => {
    return {
      container: [
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['image'],
        ['clean'],
      ],
      handlers: {
        image() {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();
          input.onchange = function() {
            const file = input.files![0];
            if (UploadManager.checkFileSize(file)) {
              Message.warning({ content: t(Strings.message_file_size_out_of_upperbound) });
              return;
            }
            uploadAndUpdateEdit(file);
          };
        },
      },
    };
  }, [uploadAndUpdateEdit]);

  return {
    markdownShortcuts: {},
    imageDropAndPaste: {
      handler: pasteImageHandler,
    },
    toolbar: toolbarOptions,
  };
};
