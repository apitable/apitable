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

import { Button, TextButton, TextInput } from '@apitable/components';
import { ConfigConstant, IInviteMemberList, IReduxState, isEmail, Strings, t } from '@apitable/core';
// eslint-disable-next-line no-restricted-imports
import { forwardRef, useEffect, useState } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { AddOutlined, CheckOutlined, DeleteOutlined, WarnOutlined } from '@apitable/icons';
// @ts-ignore
import { SubscribeUsageTipType, triggerUsageAlert } from 'enterprise';
import { getEnvVariables } from 'pc/utils/env';
import { useEmailInviteInModal } from 'pc/hooks';
import { Tooltip } from 'pc/components/common';
import { InviteAlert } from '../components/invite-alert';
import styles from './style.module.less';

interface IInputEmailProps {
  cancel: () => void;
  setMemberInvited: React.Dispatch<React.SetStateAction<boolean>>;
  shareId?: string;
  secondVerify?: string | null;
  setSecondVerify: React.Dispatch<React.SetStateAction<string | null>>;
}

interface IInputData {
  text: string;
  err: string;
}

const InitialInputData = {
  text: '',
  err: '',
};
const ResIcon = {
  Success: <CheckOutlined />,
  Warning: <WarnOutlined />,
};
export const InputEmail = forwardRef(({
  cancel, setMemberInvited, shareId,
  secondVerify, setSecondVerify
}: IInputEmailProps, ref: React.Ref<HTMLDivElement>) => {
  const [inputArr, setInputArr] = useState<{ [key: number]: IInputData }>({ 0: InitialInputData });
  const [inputKeyArr, setInputKeyArr] = useState<number[]>([0]);
  const spaceId = useSelector((state: IReduxState) => state.space.activeId || '');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteList, setInviteList] = useState<IInviteMemberList[]>([]);
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);
  const { isInvited, invitedCount, err } = useEmailInviteInModal(spaceId, inviteList, shareId, secondVerify);

  useEffect(() => {
    !err && secondVerify && setSecondVerify(null);
  }, [err, secondVerify, setSecondVerify]);

  const inputChange = (value: string, key: number) => {
    setInputArr({ ...inputArr, [key]: { err: '', text: value.replace(/\s/g, '') }});
  };

  const renderInputItems = () => {
    return inputKeyArr.map(key => {
      const value = inputArr[key].text;
      const err = inputArr[key].err;
      return (
        <div key={key} className={styles.inputItem} ref={ref}>
          <div className={styles.inputItemLeft}>
            <TextInput
              type="text"
              placeholder={t(Strings.placeholder_input_member_email)}
              key={key}
              value={value}
              autoComplete="off"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => inputChange(e.target.value, key)}
              block
            />
            <div className={styles.err}>{err}</div>
          </div>
          {
            inputKeyArr.length > 1 &&
            (
              <Tooltip title={t(Strings.delete)} placement="top">
                <div className={styles.removeIcon} onClick={() => removeMemberItem(key)}>
                  <DeleteOutlined />
                </div>
              </Tooltip>
            )
          }
        </div>
      );
    });
  };

  const handleCheckEmail = () => {
    const textValidArr: string[] = [];
    const tempInputArr = { ...inputArr };
    inputKeyArr.forEach(key => {
      const inputValue = inputArr[key].text;
      if (!inputValue) {
        tempInputArr[key] = { text: inputValue, err: t(Strings.content_is_empty) };
      } else if (!isEmail(inputValue)) {
        tempInputArr[key] = { text: inputValue, err: t(Strings.email_err) };
      } else if (textValidArr.includes(inputValue)) {
        tempInputArr[key] = { text: inputValue, err: t(Strings.re_typing_email_err) };
      } else {
        tempInputArr[key] = { text: inputValue, err: '' };
        textValidArr.push(inputValue);
      }
    });
    setInputArr(tempInputArr);
    return textValidArr.length === inputKeyArr.length;
  };
  const addMemberItem = () => {
    const keyArr = [...inputKeyArr];
    const newKey = [...inputKeyArr][0] + 1;
    keyArr.unshift(inputKeyArr[0] + 1);
    const arr = { ...inputArr };
    arr[newKey] = InitialInputData;
    setInputKeyArr(keyArr);
    setInputArr(arr);
  };

  useEffect(() => {
    if (isInvited) {
      setMemberInvited(true);
      setInviteLoading(false);
    }
  }, [isInvited, setMemberInvited]);
  const removeMemberItem = (k: number) => {
    setInputKeyArr(inputKeyArr.filter(key => key !== k));
    const inputObject = { ...inputArr };
    delete inputObject[k];
    setInputArr(inputObject);
  };
  const continueInvite = () => {
    setInviteList([]);
    setInputArr({ 0: InitialInputData });
    setInputKeyArr([0]);
  };

  const inviteBtnValid = inputKeyArr.some(key => inputArr[key].text !== '');
  const inviteBtnClick = () => {
    const result1 = triggerUsageAlert?.('maxSeats', { usage: spaceInfo!.seats + 1, alwaysAlert: true }, SubscribeUsageTipType.Alert);

    if (result1) {
      return;
    }

    setInviteLoading(true);
    const allValid = handleCheckEmail();
    if (!allValid) {
      setInviteLoading(false);
      return;
    }
    const emailList: IInviteMemberList[] = inputKeyArr.map(key => {
      return {
        email: inputArr[key].text,
        teamId: ConfigConstant.ROOT_TEAM_ID,
      };
    });
    setInviteList(emailList);
  };
  return (
    <div className={styles.inputEmail}>
      {
        !(getEnvVariables().IS_SELFHOST || getEnvVariables().IS_APITABLE) &&
        <div className={styles.inviteAlertWrapper}>
          <InviteAlert />
        </div>
      }
      {
        isInvited ?
          (
            <div className={styles.invitedRes}>
              <div className={styles.invitedContent}>
                <span className={styles.successIcon}>
                  {err ? ResIcon.Warning : ResIcon.Success}
                </span>
                <div className={styles.text}>
                  <span>{!err && t(Strings.message_send_invitation_email_to_member, { invitedCount })}</span>
                  <span>{err || t(Strings.message_invite_member_to_validate)}</span>
                </div>
              </div>
              <div className={styles.btnWrapper}>
                <TextButton
                  onClick={continueInvite}
                  size="small"
                >
                  {t(Strings.invite_outsider_keep_on)}
                </TextButton>
                <Button onClick={cancel} size="small" color="primary">{t(Strings.finish)}</Button>
              </div>
            </div>
          ) :
          (
            <>
              <div className={styles.itemWrapper}>
                <div>
                  <Button
                    onClick={addMemberItem}
                    prefixIcon={<AddOutlined size={16} color="currentColor" />}
                    className={styles.add}
                  >
                    {t(Strings.button_add)}
                  </Button>
                </div>
                <div className={styles.itemContent}>
                  {renderInputItems()}
                </div>
              </div>
              <div className={styles.inviteBtn}>
                <div className={styles.tipText} style={{ flex: 1 }}>{t(Strings.invite_outsider_invite_btn_tip)}</div>
                <Button
                  onClick={inviteBtnClick}
                  loading={inviteLoading}
                  disabled={!inviteBtnValid || inviteLoading}
                  color="primary"
                  size="small"
                >
                  {t(Strings.invite_outsider_send_invitation)}
                </Button>
              </div>
            </>
          )
      }
    </div>
  );
});
