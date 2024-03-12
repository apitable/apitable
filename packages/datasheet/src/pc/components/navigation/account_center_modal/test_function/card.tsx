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

import classNames from 'classnames';
import Image from 'next/image';
import * as React from 'react';
import { useMemo, useState } from 'react';
import { Button, Typography } from '@apitable/components';
import { ApiInterface, integrateCdnHost, Strings, SystemConfig, t } from '@apitable/core';
import { useAppSelector } from 'pc/store/react-redux';
import { getStorage, StorageName } from 'pc/utils/storage';
import { FunctionType } from './interface';
import { Modal } from './modal';
import style from './style.module.less';

export const Card: React.FC<React.PropsWithChildren<{ feature: ApiInterface.ILabsFeature; isUser?: boolean }>> = (props) => {
  const { feature, isUser } = props;
  const config = SystemConfig.test_function[feature.key];
  const [showModal, setShowModal] = useState<boolean>(false);
  const labs = useAppSelector((state) => state.labs);
  const status = useMemo(() => {
    const isNormal = feature.type === FunctionType.NORMAL;
    if (isNormal) {
      return Boolean(getStorage(StorageName.TestFunctions)?.[feature.key]);
    }
    return labs.includes(feature.key);
  }, [feature, labs]);

  return (
    <>
      {config && (
        <div className={classNames(style.card, isUser && style.cardBorder)}>
          <div className={style.icon}>
            <Image src={integrateCdnHost(config.logo)} width={46} height={46} alt="" />
          </div>
          <Typography variant="h6" style={{ paddingBottom: 16 }}>
            {t(Strings[config.feature_name])}
          </Typography>

          <div className={style.middle}>
            <p>{t(Strings[config.card.info])}</p>
          </div>

          <div className={style.bottom}>
            {/* Application Card Button */}
            <Button
              style={{
                fontSize: 12,
              }}
              color={config.card.btn_type}
              variant={status ? 'jelly' : undefined}
              block
              size="small"
              onClick={() => setShowModal(true)}
            >
              {status ? t(Strings.check_detail) : t(Strings[config.card.btn_text])}
            </Button>
          </div>
        </div>
      )}
      {showModal && <Modal onClose={() => setShowModal(false)} status={status} feature={feature} />}
    </>
  );
};
