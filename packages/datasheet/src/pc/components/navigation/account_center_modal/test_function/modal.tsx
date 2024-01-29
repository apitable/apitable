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

import { pickBy } from 'lodash';
import Image from 'next/image';
import * as React from 'react';
import { useMemo, useRef } from 'react';
import { Button, Typography } from '@apitable/components';
import { Api, ApiInterface, integrateCdnHost, Strings, SystemConfig, t } from '@apitable/core';
import { Message } from 'pc/components/common';
import { ModalOutsideOperate } from 'pc/components/common/modal_outside_operate';
import { useAppSelector } from 'pc/store/react-redux';
import { WECOM_ROBOT_URL } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import { getStorage, setStorage, StorageMethod, StorageName } from 'pc/utils/storage';
import { useApplyOpenFunction } from './hooks';
import { FunctionType } from './interface';
// @ts-ignore
import { isWecomFunc } from 'enterprise/home/social_platform/utils';
import style from './style.module.less';

interface IModalProps {
  onClose: () => void;
  status: boolean;
  feature: ApiInterface.ILabsFeature;
}

export const Modal: React.FC<React.PropsWithChildren<IModalProps>> = (props) => {
  const { onClose, feature, status } = props;
  const config = SystemConfig.test_function[feature.key];
  const loadingMessage = useRef<boolean>(false);
  const spaceId = useAppSelector((state) => state.space.activeId);
  const applyOpenFunction = useApplyOpenFunction();

  const btnClick = useMemo(() => {
    return {
      [FunctionType.NORMAL]: () => {
        if (loadingMessage.current) {
          return;
        }
        const testFunctionsStorage = getStorage(StorageName.TestFunctions);
        const isToOpen = !testFunctionsStorage?.[feature.key];
        if (isToOpen) {
          setStorage(StorageName.TestFunctions, { ...testFunctionsStorage, [feature.key]: t(Strings[config.feature_name]) });
        } else {
          setStorage(
            StorageName.TestFunctions,
            pickBy(testFunctionsStorage, (_value, key) => key !== feature.key),
            StorageMethod.Set,
          );
        }
        Message.success({ content: isToOpen ? t(Strings.marketplace_app_enable_succeed) : t(Strings.marketplace_app_disable_succeed) });
        loadingMessage.current = true;
        setTimeout(() => {
          window.location.reload();
          loadingMessage.current = false;
        }, 1500);
      },
      [FunctionType.REVIEW]: () => {
        const url = feature.key === 'robot' && isWecomFunc?.() ? WECOM_ROBOT_URL : feature.url;
        url && applyOpenFunction(url);
      },
      [FunctionType.NORMAL_PERSIST]: async () => {
        const res = await Api.updateLabsFeatureList('view_manual_save', !status, spaceId!);
        const { message, success } = res.data;
        if (success) {
          Message.success({ content: status ? t(Strings.marketplace_app_disable_succeed) : t(Strings.marketplace_app_enable_succeed) });

          setTimeout(() => {
            window.location.reload();
          }, 1500);
          return;
        }
        Message.error({ content: message });
      },
    };
  }, [config.feature_name, feature.key, feature.url, spaceId, status, applyOpenFunction]);
  const Title = (
    <div className={style.modalHeader}>
      <img width={40} height={40} src={integrateCdnHost(config.logo)} style={{ marginRight: 8 }} alt={''} />
      <Typography variant="h4">{t(Strings[config.feature_name])}</Typography>
    </div>
  );
  const Footer = (
    <div className={style.modalFooter}>
      <div className={style.notes}>{t(Strings[config.note])}</div>
      <div style={{ width: 216, alignSelf: 'center', paddingTop: 16 }}>
        <Button
          color={status ? 'danger' : 'primary'}
          block
          onClick={() => btnClick[feature.type]()}
          disabled={status && feature.type === FunctionType.REVIEW}
        >
          {status ? t(Strings.disable) : t(Strings[config.modal.btn_text])}
        </Button>
      </div>
    </div>
  );
  return (
    <ModalOutsideOperate modalClassName={style.modalWrapper} modalWidth={640} showOutsideOperate onModalClose={onClose}>
      <>
        {Title}
        <div className={style.modalContent}>
          <div className={style.description}>
            <div dangerouslySetInnerHTML={{ __html: t(Strings[config.modal.info]) }} />
          </div>
          {config.modal?.info_image && (
            <div className={style.modalImg}>
              <Image src={integrateCdnHost(getEnvVariables()[config.modal?.info_image])} width="100%" layout={'fill'} alt="" />
            </div>
          )}
        </div>
        {Footer}
      </>
    </ModalOutsideOperate>
  );
};
