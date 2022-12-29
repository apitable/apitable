import { Button, Typography } from '@apitable/components';
import { ApiInterface, integrateCdnHost, Strings, SystemConfig, t } from '@apitable/core';
import classNames from 'classnames';
import Image from 'next/image';
import { getStorage, StorageName } from 'pc/utils/storage';
import * as React from 'react';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { FunctionType } from './interface';
import { Modal } from './modal';
import style from './style.module.less';

export const Card: React.FC<{ feature: ApiInterface.ILabsFeature; isUser?: boolean; }> = props => {
  const { feature, isUser } = props;
  const config = SystemConfig.test_function[feature.key];
  const [showModal, setShowModal] = useState<boolean>(false);
  const labs = useSelector(state => state.labs);
  const status = useMemo(() => {
    const isNormal = feature.type === FunctionType.NORMAL;
    if (isNormal) {
      return Boolean(getStorage(StorageName.TestFunctions)?.[feature.key]);
    }
    return labs.includes(feature.key);
  }, [feature, labs]);

  return (
    <>
      {config && <div className={classNames(style.card, isUser && style.cardBorder)}>
        <div className={style.icon}>
          <Image
            src={integrateCdnHost(config.logo)}
            width={46}
            height={46}
          />
        </div>
        <Typography
          variant='h6'
          style={{ paddingBottom: 16 }}
        >
          {t(Strings[config.feature_name])}
        </Typography>

        <div className={style.middle}>
          <p>{t(Strings[config.card.info])}</p>
        </div>

        <div className={style.bottom}>
          {/* Application Card Button */}
          <Button
            style={{
              fontSize: 12
            }}
            color={config.card.btn_type}
            variant={status ? 'jelly' : undefined}
            block
            size='small'
            onClick={() => setShowModal(true)}
          >
            {status
              ? t(Strings.check_detail)
              : t(Strings[config.card.btn_text])
            }
          </Button>
        </div>
      </div>}
      {showModal && <Modal onClose={() => setShowModal(false)} status={status} feature={feature} />}
    </>
  );
};
