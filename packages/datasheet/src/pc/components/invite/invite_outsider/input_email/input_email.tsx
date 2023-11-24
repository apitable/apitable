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

import { Input, InputRef } from 'antd';
import * as React from 'react';
import { forwardRef, useEffect, useState, useRef } from 'react';
import { Button, colors } from '@apitable/components';
import { ConfigConstant, IInviteMemberList, IReduxState, isEmail, Strings, t } from '@apitable/core';
import { CheckOutlined, CloseOutlined, WarnOutlined } from '@apitable/icons';
import { useEmailInviteInModal } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
import { InviteAlert } from '../components/invite-alert';
import styles from './style.module.less';

interface IInputEmailProps {
  cancel: () => void;
  setMemberInvited: React.Dispatch<React.SetStateAction<boolean>>;
  shareId?: string;
  secondVerify?: string | null;
  setSecondVerify: React.Dispatch<React.SetStateAction<string | null>>;
}

const ResIcon = {
  Success: <CheckOutlined />,
  Warning: <WarnOutlined />,
};

enum InviteInputStatus {
  Normal = 'normal',
  // Success = 'success',
  Error = 'error',
  Warning = 'warning',
}

export const InputEmail = forwardRef(
  ({ cancel, setMemberInvited, shareId, secondVerify, setSecondVerify }: IInputEmailProps, ref: React.Ref<HTMLDivElement>) => {
    const spaceId = useAppSelector((state: IReduxState) => state.space.activeId || '');
    const [inviteLoading, setInviteLoading] = useState(false);
    const [inviteList, setInviteList] = useState<IInviteMemberList[]>([]);
    const { isInvited, invitedCount, err } = useEmailInviteInModal(spaceId, inviteList, shareId, secondVerify);

    const [currentInput, setCurrentInput] = useState<string>('');
    const [memberArr, setMemberArr] = useState<string[]>([]);

    const [isFocused, setIsFocused] = useState<boolean>(false);

    const [errorStatus, setErrorStatus] = useState<InviteInputStatus>(InviteInputStatus.Normal);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
      !err && secondVerify && setSecondVerify(null);
    }, [err, secondVerify, setSecondVerify]);

    useEffect(() => {
      if (isInvited) {
        setMemberInvited(true);
        setInviteLoading(false);
      }
    }, [isInvited, setMemberInvited]);

    const inviteBtnValid = memberArr.length > 0;

    const inviteBtnClick = () => {
      setInviteLoading(true);

      if (!inviteBtnValid) {
        setInviteLoading(false);
        return;
      }

      const emailList: IInviteMemberList[] = memberArr.map((key) => {
        return {
          email: key,
          teamId: ConfigConstant.ROOT_TEAM_ID,
        };
      });

      setInviteList(emailList);
    };

    const checkIfAlreadyExist = (value: string) => {
      return memberArr.includes(value);
    };

    const handleInputAction = () => {
      const inputValue = currentInput.trim();

      if (!inputValue || inputValue.length === 0) {
        return;
      }

      if (inputValue.length > 0 && (!inputValue || !isEmail(inputValue))) {
        setErrorStatus(InviteInputStatus.Error);
        setErrorMessage(t(Strings.invite_outsider_invite_input_invalid));
        return;
      }

      if (checkIfAlreadyExist(inputValue)) {
        setErrorStatus(InviteInputStatus.Warning);
        setErrorMessage(t(Strings.invite_outsider_invite_input_already_exist));
        return;
      }

      setMemberArr([...memberArr, inputValue]);
      setCurrentInput('');
    };

    const handleKeyDown = (e: any) => {
      if (e.key === 'Enter') {
        handleInputAction();
      }
    };

    const handleInputFocus = () => {
      setIsFocused(true);
      setErrorStatus(InviteInputStatus.Normal);
    };

    const handleInputBlur = () => {
      handleInputAction();
      setIsFocused(false);
    };

    const inputRef = useRef<InputRef>(null);

    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    const removeMemberItem = (item: string) => {
      const newMemberArr = memberArr.filter((email) => email !== item);
      setMemberArr(newMemberArr);
    };

    return (
      <div className={styles.inputEmail}>
        {!(getEnvVariables().IS_SELFHOST || getEnvVariables().IS_APITABLE) && (
          <div className={styles.inviteAlertWrapper}>
            <InviteAlert />
          </div>
        )}
        {isInvited ? (
          <div className={styles.invitedRes}>
            <div className={styles.invitedContent}>
              <span className={styles.successIcon}>{err ? ResIcon.Warning : ResIcon.Success}</span>
              <div className={styles.text}>
                <span>{!err && t(Strings.message_send_invitation_email_to_member, { invitedCount })}</span>
                <span>{err || t(Strings.message_invite_member_to_validate)}</span>
              </div>
            </div>
            <div className={styles.btnWrapper}>
              <Button onClick={cancel} size="small" color="primary">
                {t(Strings.finish)}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.itemWrapper}>
              <div
                style={{
                  fontSize: '13px',
                }}
              >
                {t(Strings.invite_outsider_invite_btn_tip)}
              </div>
              <div className={styles.inputItem} onClick={focusInput}>
                <div
                  className={isFocused ? styles.inputItemBoxFocused : styles.inputItemBox}
                  style={{
                    borderColor:
                      errorStatus !== InviteInputStatus.Normal
                        ? errorStatus === InviteInputStatus.Error
                          ? colors.textDangerDefault
                          : colors.textWarnDefault
                        : colors.borderBrandDefault,
                  }}
                >
                  {memberArr.length > 0 && (
                    <div className={styles.emailEnterBox}>
                      {memberArr.map((email) => (
                        <div key={email} className={styles.emailEnteredItem}>
                          <div className={styles.emailEnterBoxText}>{email}</div>
                          <CloseOutlined
                            className={styles.emailEnterBoxDeleteIcon}
                            onClick={() => {
                              removeMemberItem(email);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <Input
                    ref={inputRef}
                    value={currentInput}
                    type="email"
                    placeholder={t(Strings.invite_outsider_invite_input_placeholder)}
                    onChange={(e) => {
                      setCurrentInput(e.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                    onBlur={handleInputBlur}
                    onFocus={handleInputFocus}
                    autoComplete="off"
                    style={{
                      border: 'none',
                      height: '40px',
                    }}
                  />
                </div>
                {errorStatus !== InviteInputStatus.Normal && (
                  <div
                    style={{
                      color: errorStatus === InviteInputStatus.Error ? colors.textDangerDefault : colors.textWarnDefault,
                    }}
                  >
                    {errorMessage}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.inviteBtn}>
              <Button
                onClick={() => {
                  cancel();
                  setMemberInvited(false);
                }}
                size="small"
              >
                {t(Strings.cancel)}
              </Button>
              <Button onClick={inviteBtnClick} loading={inviteLoading} disabled={!inviteBtnValid || inviteLoading} color="primary" size="small">
                {t(Strings.invite_outsider_send_invitation)}
              </Button>
            </div>
          </>
        )}
      </div>
    );
  },
);
