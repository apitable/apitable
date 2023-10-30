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

import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { Api, StatusCode, Strings, t } from '@apitable/core';
import { Message } from 'pc/components/common';
import { secondStepVerify } from 'pc/hooks/utils';
import { BeforeUpload, Fail, FileSelected, Processing, Success } from '../components';
import { IErrorInfo, IKidType, IUploadFileResponse, KidType } from '../interface';
import styles from './style.module.less';
// @ts-ignore

let reqToken: () => void;

interface IImportFileProps {
  closeModal: () => void;
  setMemberInvited: React.Dispatch<React.SetStateAction<boolean>>;
  secondVerify?: string | null;
  setSecondVerify: React.Dispatch<React.SetStateAction<string | null>>;
}

// The token returned after uploading a file
export const ImportFile: FC<React.PropsWithChildren<IImportFileProps>> = ({ setMemberInvited, closeModal, secondVerify, setSecondVerify }) => {
  // Currently mounted subassemblies
  const [kid, setKid] = useState<IKidType>(KidType.BeforeUpload);
  // Callback message after selecting a file
  const [file, setFile] = useState<File | undefined>();
  // Upload file progress
  const [percent, setPercent] = useState(0);
  // Upload results
  const [responseInfo, setResponseInfo] = useState<IUploadFileResponse | null>(null);
  const [previewList, setPreviewList] = useState<IErrorInfo[]>([]);
  const [err, setErr] = useState('');
  // Initialize upload file status value | Continue Invitation
  const init = () => {
    setFile(undefined);
    setKid(KidType.BeforeUpload);
  };
  const setReqToken = (c: () => void) => {
    reqToken = c;
  };
  // Cancel Upload
  const cancelImport = () => {
    if (!reqToken) return;
    reqToken();
    Message.success({ content: t(Strings.upload_canceled) });
    init();
  };

  // Refresh the organisation structure and staff list after successful file upload
  const updateSpaceMember = () => {
    setMemberInvited(true);
  };

  const onUploadProgress = (progressEvent: { loaded: number; total: number }) => {
    const value = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
    setPercent(value);
  };

  const confirmImport = (nvcVal?: string) => {
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    setKid(KidType.Processing);
    nvcVal && formData.append('data', nvcVal);
    Api.uploadMemberFile(formData, onUploadProgress, (c: () => void) => {
      setReqToken(c);
    })
      .then((res) => {
        const { success, data, message, code } = res.data;
        setResponseInfo(data);
        if (success) {
          setKid(KidType.Success);
          updateSpaceMember && updateSpaceMember();
          setErr('');
          secondVerify && setSecondVerify(null);
          setFile(undefined);
        } else {
          setKid(KidType.Fail);
          setErr(message);
          if (secondStepVerify(code) || code === StatusCode.COMMON_ERR) {
            setFile(undefined);
          }
        }
      })
      .catch((e: any) => {
        setKid(KidType.Fail);
        setErr(e.message);
        setFile(undefined);
      });
  };

  useEffect(() => {
    if (!secondVerify) {
      return;
    }
    file && confirmImport(secondVerify);
    // eslint-disable-next-line
  }, [secondVerify]);

  const kidNode = (type: IKidType) => {
    switch (type) {
      case KidType.BeforeUpload:
        return <BeforeUpload setFile={(file) => setFile(file)} setKid={setKid} setPreviewList={setPreviewList} setErr={setErr} />;
      case KidType.FileSelected:
        return <FileSelected init={init} file={file} previewList={previewList} confirmImport={confirmImport} />;
      case KidType.Processing:
        return <Processing percent={percent} cancel={cancelImport} file={file} />;
      case KidType.Fail:
        return <Fail init={init} err={err} />;
      case KidType.Success:
        return <Success responseInfo={responseInfo} init={init} close={closeModal} />;
      default:
        return null;
    }
  };

  return <div className={styles.importFile}>{kidNode(kid)}</div>;
};
