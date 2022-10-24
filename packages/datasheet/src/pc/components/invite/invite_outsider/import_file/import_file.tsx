import { Api, StatusCode, Strings, t } from '@apitable/core';
import { Message } from 'pc/components/common';
import { secondStepVerify } from 'pc/hooks/utils';
import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { BeforeUpload, Fail, FileSelected, Processing, Success } from '../components';
import { IErrorInfo, IKidType, IUploadFileResponse, KidType } from '../interface';
import styles from './style.module.less';

let reqToken: () => void;

interface IImportFileProps {
  closeModal: () => void;
  setMemberInvited: React.Dispatch<React.SetStateAction<boolean>>;
  secondVerify?: string | null;
  setSecondVerify: React.Dispatch<React.SetStateAction<string | null>>;
}

// 上传文件后返回的token
export const ImportFile: FC<IImportFileProps> = ({ setMemberInvited, closeModal, secondVerify, setSecondVerify }) => {
  // 当前挂载的子组件
  const [kid, setKid] = useState<IKidType>(KidType.BeforeUpload);
  // 选择文件之后的回调信息
  const [file, setFile] = useState<File | undefined>();
  // 上传文件进度
  const [percent, setPercent] = useState(0);
  // 上传结果
  const [responseInfo, setResponseInfo] = useState<IUploadFileResponse | null>(null);
  const [previewList, setPreviewList] = useState<IErrorInfo[]>([]);
  const [err, setErr] = useState('');
  // 初始化上传文件状态值 | 继续邀请
  const init = () => {
    setFile(undefined);
    setKid(KidType.BeforeUpload);
  };
  const setReqToken = (c) => {
    reqToken = c;
  };
  // 取消上传
  const cancelImport = () => {
    if (!reqToken) return;
    reqToken();
    Message.success({ content: t(Strings.upload_canceled) });
    init();
  };

  // 上传文件成功后，刷新组织架构及员工列表
  const updateSpaceMember = () => {
    setMemberInvited(true);
  };

  const onUploadProgress = progressEvent => {
    const value = Math.floor(progressEvent.loaded / progressEvent.total * 100);
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
    Api.uploadMemberFile(formData, onUploadProgress, c => {
      setReqToken(c);
    }).then(res => {
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
    });
  };

  useEffect(() => {
    if (!secondVerify) {
      return;
    }
    file && confirmImport(secondVerify);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondVerify]);

  const kidNode = (type: IKidType) => {
    switch (type) {
      case KidType.BeforeUpload:
        return (
          <BeforeUpload
            setFile={(file) => setFile(file)}
            setKid={setKid}
            setPreviewList={setPreviewList}
            setErr={setErr}
          />
        );
      case KidType.FileSelected:
        return (
          <FileSelected
            init={init}
            file={file}
            previewList={previewList}
            confirmImport={confirmImport}
          />
        );
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

  return (
    <div className={styles.importFile}>
      {kidNode(kid)}
    </div>
  );
};
