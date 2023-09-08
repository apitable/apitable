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

import { FC } from 'react';
import * as React from 'react';
import { TextButton } from '@apitable/components';
import { IMemberInfoInSpace, Strings, t, Api, ISpaceBasicInfo } from '@apitable/core';
import { InfoCircleOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Message, Popconfirm, Tooltip } from 'pc/components/common';
import { Identity } from '../../identity';
import styles from './style.module.less';
// @ts-ignore
import { getSocialWecomUnitName } from 'enterprise';

export const Reinvite: FC<React.PropsWithChildren<{ record: IMemberInfoInSpace }>> = ({ record }) => {
  const reSendEmail = (record: IMemberInfoInSpace) => {
    Api.reSendInvite(record.email).then((res) => {
      const { success, message } = res.data;
      if (success) {
        Message.success({ content: t(Strings.operate_success) });
      } else {
        Message.error({ content: message });
      }
    });
  };

  if (record.isActive) {
    return null;
  }
  return (
    <Popconfirm type="warning" content={t(Strings.send_again_toast)} onOk={() => reSendEmail(record)} trigger="click">
      <InfoCircleOutlined />
    </Popconfirm>
  );
};

export const nameColRender = (value: string, record: IMemberInfoInSpace, spaceInfo: ISpaceBasicInfo | null) => {
  const { isPrimary, isSubAdmin, isActive, isMemberNameModified } = record;
  const name =
    getSocialWecomUnitName?.({
      name: value,
      isModified: isMemberNameModified,
      spaceInfo,
    }) || value;
  if (!isActive) {
    return (
      <span>
        {name || t(Strings.record_unnamed)}
        <Reinvite record={record} />
      </span>
    );
  }

  const hasIdentity = isPrimary || isSubAdmin;

  return (
    <span className={styles.nameColRender}>
      <Tooltip title={name} textEllipsis>
        <div className={styles.tipText}>{name}</div>
      </Tooltip>
      {hasIdentity && <Identity type={isPrimary ? 'mainAdmin' : 'subAdmin'} className={styles.identity} />}
    </span>
  );
};

export const OperateCol: FC<
  React.PropsWithChildren<{
    prevBtnClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    prevBtnText?: string;
    nextBtnClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    nextBtnText?: string;
    disabledNextBtn?: boolean;
    hideNextBtn?: boolean;
  }>
> = ({ prevBtnClick, prevBtnText = t(Strings.edit), nextBtnClick, nextBtnText = t(Strings.remove_from_the_team), disabledNextBtn, hideNextBtn }) => {
  return (
    <div className={styles.operateCol}>
      <TextButton size="x-small" color="primary" onClick={prevBtnClick}>
        {prevBtnText}
      </TextButton>
      {!hideNextBtn && (
        <>
          <span className={styles.line}>|</span>
          <TextButton size="x-small" color="danger" onClick={nextBtnClick} disabled={disabledNextBtn}>
            {nextBtnText}
          </TextButton>
        </>
      )}
    </div>
  );
};
