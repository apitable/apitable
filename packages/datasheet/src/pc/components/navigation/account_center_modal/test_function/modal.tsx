import { Button, Typography } from '@vikadata/components';
import { Api, ApiInterface, integrateCdnHost, Strings, SystemConfig, t } from '@vikadata/core';
import { pickBy } from 'lodash';
import Image from 'next/image';
import { Message } from 'pc/components/common';
import { ModalOutsideOperate } from 'pc/components/common/modal_outside_operate';
import { isWecomFunc } from 'pc/components/home/social_platform';
import { WECOM_ROBOT_URL } from 'pc/utils';
import { getStorage, setStorage, StorageMethod, StorageName } from 'pc/utils/storage';
import * as React from 'react';
import { useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useApplyOpenFunction } from './hooks';
import { FunctionType } from './interface';
import style from './style.module.less';

interface IModalProps {
  onClose: () => void;
  status: boolean;
  feature: ApiInterface.ILabsFeature
}

export const Modal: React.FC<IModalProps> = props => {
  const { onClose, feature, status } = props;
  const config = SystemConfig.test_function[feature.key];
  const loadingMessage = useRef<boolean>(false);
  const spaceId = useSelector(state => state.space.activeId);
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
          setStorage(StorageName.TestFunctions, pickBy(testFunctionsStorage, (value, key) => key !== feature.key), StorageMethod.Set);
        }
        Message.success({ content: isToOpen ? t(Strings.marketplace_app_enable_succeed) : t(Strings.marketplace_app_disable_succeed) });
        loadingMessage.current = true;
        setTimeout(() => {
          window.location.reload();
          loadingMessage.current = false;
        }, 1500);
      },
      [FunctionType.REVIEW]: () => {
        const url = feature.key === 'robot' && isWecomFunc() ? WECOM_ROBOT_URL : feature.url;
        // 跳转去 对应的神奇表单
        url && applyOpenFunction(url);
      },
      [FunctionType.NORMAL_PERSIST]: async() => {
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
      }
    };
  }, [config.feature_name, feature.key, feature.url, spaceId, status, applyOpenFunction]);
  const Title = (
    <div className={style.modalHeader}>
      <img
        width={40}
        height={40}
        src={integrateCdnHost(config.logo)}
        style={{ marginRight: 8 }}
        alt={''}
      />
      <Typography variant='h4'>{t(Strings[config.feature_name])}</Typography>
    </div>
  );
  const Footer = (
    <div
      className={style.modalFooter}
    >
      <div className={style.notes}>
        {t(Strings[config.note])}
      </div>
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
    <ModalOutsideOperate
      modalClassName={style.modalWrapper}
      modalWidth={640}
      showOutsideOperate
      onModalClose={onClose}
    >
      <>
        {Title}
        <div className={style.modalContent}>
          <div className={style.description}>
            <div
              dangerouslySetInnerHTML={{ __html: t(Strings[config.modal.info]) }}
            />
          </div>
          {config.modal?.info_image && <div className={style.modalImg}>
            <Image
              src={integrateCdnHost(config.modal?.info_image)}
              width='100%'
              layout={'fill'}
            />
          </div>}
        </div>
        {Footer}
      </>
    </ModalOutsideOperate>
  );
};
