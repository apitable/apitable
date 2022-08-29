import { FC } from 'react';
import * as React from 'react';
import { Message, Popconfirm, Tooltip } from 'pc/components/common';
import { IMemberInfoInSpace, Strings, t, Api } from '@vikadata/core';
import { TextButton } from '@vikadata/components';
import DescribeIcon from 'static/icon/datasheet/rightclick/datasheet_icon_edit_describe.svg';
import styles from './style.module.less';
import { Identity } from '../../identity';
import { getSocialWecomUnitName } from 'pc/components/home/social_platform';

export const Reinvite: FC<{record: IMemberInfoInSpace}> = ({ record }) => {
  // 操作-再次发送邀请
  const reSendEmail = (record: IMemberInfoInSpace) => {
    Api.reSendInvite(record.email).then(res => {
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
    <Popconfirm
      type="warning"
      content={t(Strings.send_again_toast)}
      onOk={() => reSendEmail(record)}
      trigger="click"
    >
      <DescribeIcon />
    </Popconfirm>
  );
};

export const nameColRender = (value, record, spaceInfo) => {
  const { isPrimary, isSubAdmin, isActive, isMemberNameModified } = record;
  const name = getSocialWecomUnitName({
    name: value,
    isModified: isMemberNameModified,
    spaceInfo
  });
  if (!isActive) { 
    return (
      <span>{name || t(Strings.record_unnamed)}<Reinvite record={record}/></span>
    );
  }

  const hasIdentity = isPrimary || isSubAdmin;

  return (
    <span className={styles.nameColRender}>
      <Tooltip title={name} textEllipsis>
        <div className={styles.tipText}>
          {name}
        </div>
      </Tooltip>
      {
        hasIdentity &&
        <Identity type={isPrimary ? 'mainAdmin' : 'subAdmin'} className={styles.identity} />
      }
    </span>
  );
};

export const OperateCol: FC<{
  prevBtnClick?: ((event: React.MouseEvent<HTMLElement, MouseEvent>) => void),
  prevBtnText?: string,
  nextBtnClick?: ((event: React.MouseEvent<HTMLElement, MouseEvent>) => void),
  nextBtnText?: string,
  disabledNextBtn?: boolean,
  hideNextBtn?: boolean,
}> = ({
  prevBtnClick,
  prevBtnText = t(Strings.edit),
  nextBtnClick,
  nextBtnText = t(Strings.remove_from_the_team),
  disabledNextBtn,
  hideNextBtn
}) => {
  return (
    <div className={styles.operateCol}>
      <TextButton
        size="x-small"
        color="primary"
        onClick={prevBtnClick}
      >
        {prevBtnText}
      </TextButton>
      {
        !hideNextBtn &&
        (
          <>
            <span className={styles.line}>|</span>
            <TextButton
              size="x-small"
              color="danger"
              onClick={nextBtnClick}
              disabled={disabledNextBtn}
            >
              {nextBtnText}
            </TextButton>
          </>
        )
      }
    </div>
  );
};