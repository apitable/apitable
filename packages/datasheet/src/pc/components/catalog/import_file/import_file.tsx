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

import { Progress, Upload } from 'antd';
import { FC, useState } from 'react';
import { TextButton, useThemeColors } from '@apitable/components';
import { Api, ConfigConstant, IReduxState, Navigation, StoreActions, Strings, t } from '@apitable/core';
import { CheckOutlined, ImportOutlined, WarnOutlined } from '@apitable/icons';
import { Message, Modal } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { usePercent } from 'pc/hooks/use_percent';
import { useAppSelector } from 'pc/store/react-redux';
import { byte2Mb } from 'pc/utils';
import styles from './style.module.less';

const { Dragger } = Upload;

export interface IImportFileProps {
  parentId: string;
  onCancel: () => void;
  isPrivate?: boolean;
}

let reqToken: () => void;

type ProgressType = 'normal' | 'active' | 'success' | 'exception' | undefined;

export const ImportFile: FC<React.PropsWithChildren<IImportFileProps>> = ({ parentId, onCancel, isPrivate }) => {
  const colors = useThemeColors();
  const spaceId = useAppSelector((state) => state.space.activeId);
  const userUnitId = useAppSelector((state) => state.user.info?.unitId);
  const expandedKeys = useAppSelector((state: IReduxState) => state.catalogTree.expandedKeys);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [file, setFile] = useState<File>();
  const [errMsg, setErrMsg] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isProcess, setProcessing] = useState(false);
  const dispatch = useAppDispatch();
  const { percent, stop: stopPercent, start: startPercent } = usePercent(60, 99, 1500);

  const [isFail, setIsFail] = useState<ProgressType>(ConfigConstant.PROGRESS_NORMAL);

  const onUploadProgress = (progressEvent: { loaded: number; total: number }) => {
    if (!isUploading) {
      setIsUploading(true);
    }
    if (progressEvent.loaded / progressEvent.total === 1) {
      startPercent();
    }
    const value = Math.floor((progressEvent.loaded / progressEvent.total) * 100 * 0.6);
    setUploadPercent(value);
  };

  const customRequest = (componentsData: any) => {
    setFile(componentsData.file);
    uploadFile(componentsData.file);
  };

  const uploadFile = (curFile: File) => {
    if (!spaceId) {
      return;
    }
    if (byte2Mb(curFile.size)! > 20) {
      Modal.danger({
        title: t(Strings.no_access_space_title),
        content: t(Strings.import_file_outside_limit),
      });
      return;
    }
    const formData = new FormData();
    formData.append('file', curFile);
    formData.append('parentId', parentId);
    formData.append('spaceId', spaceId);
    if (isPrivate && userUnitId) {
      formData.append('unitId', userUnitId);
    }
    setProcessing(true);
    Api.importFile(formData, onUploadProgress, (c: () => void) => {
      reqToken = c;
    })
      .then((res) => {
        stopPercent();
        setProcessing(false);
        const { success, data, message } = res.data;
        if (success) {
          dispatch(StoreActions.setExpandedKeys([...expandedKeys, parentId], isPrivate ? ConfigConstant.Modules.PRIVATE : undefined));
          dispatch(StoreActions.addNode(data, isPrivate ? ConfigConstant.Modules.PRIVATE : undefined));
          dispatch(StoreActions.getSpaceInfo(spaceId));
          Router.push(Navigation.WORKBENCH, {
            params: {
              spaceId,
              nodeId: data.nodeId,
            },
          });
          setTimeout(() => {
            onCancel();
          }, 3000);
        } else {
          setErrMsg(message);
          setIsFail(ConfigConstant.PROGRESS_EXCEPTION);
        }
        dispatch(StoreActions.clearNode());
      })
      .catch(() => {
        setProcessing(false);
        setIsFail(ConfigConstant.PROGRESS_EXCEPTION);
        stopPercent();
      });
  };

  const handleReSelect = () => {
    setIsUploading(false);
    setProcessing(false);
    setUploadPercent(0);
    setIsFail(ConfigConstant.PROGRESS_NORMAL);
  };

  const handleCancel = () => {
    if (!reqToken) {
      return;
    }
    reqToken();
    Message.success({ content: `${t(Strings.cancel)}${t(Strings.upload_success)}` });
    setUploadPercent(0);
    setFile(undefined);
    setIsUploading(false);
    stopPercent();
    setProcessing(false);
    setIsFail(ConfigConstant.PROGRESS_NORMAL);
  };

  const failPage = () => {
    return (
      <div className={styles.fail}>
        <div className={styles.failProgress}>
          <WarnOutlined size={40} color={colors.errorColor} />
        </div>
        <div className={styles.status}>{t(Strings.import_failed)}</div>
        <div className={styles.tip}>{errMsg}</div>
        <TextButton className={styles.selectBtn} onClick={handleReSelect}>
          {t(Strings.reselect)}
        </TextButton>
      </div>
    );
  };

  const successPage = () => {
    return (
      <div className={styles.success}>
        <div className={styles.successProgress}>
          <CheckOutlined size={40} color={colors.primaryColor} />
        </div>
        <div className={styles.fileName}>{file!.name}</div>
      </div>
    );
  };

  const processPage = () => {
    return (
      <div className={styles.process}>
        <Progress type="circle" percent={uploadPercent < 60 ? uploadPercent : percent} strokeColor={colors.primaryColor} width={80} />
        <div className={styles.fileName}>{file!.name}</div>
        {uploadPercent < 60 && (
          <div className={styles.cancelBtn} onClick={handleCancel}>
            {t(Strings.import_canceled)}
          </div>
        )}
      </div>
    );
  };

  const handleClose = () => {
    if (isProcess) {
      return;
    }
    onCancel();
  };

  return (
    <Modal
      title={t(Strings.import_file)}
      width={540}
      open
      footer={null}
      wrapClassName={styles.createSpaceWrapper}
      bodyStyle={{
        width: '100%',
        height: '410px',
        padding: '24px',
      }}
      maskClosable={false}
      onCancel={handleClose}
      centered
    >
      {isUploading ? (
        <div className={styles.upload}>{isProcess ? processPage() : isFail === ConfigConstant.PROGRESS_EXCEPTION ? failPage() : successPage()}</div>
      ) : (
        <Dragger customRequest={customRequest} showUploadList={false} accept=".xlsx,.xls,.csv">
          <div>
            <ImportOutlined size={50} color={colors.fourthLevelText} />
          </div>
          <div className={styles.tip}>{t(Strings.invite_ousider_import_file_tip1)}</div>
          <div className={styles.format}>{t(Strings.invite_ousider_import_file_tip3)}</div>
        </Dragger>
      )}
    </Modal>
  );
};
