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

import { Input } from 'antd';
import * as React from 'react';
import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, ButtonGroup, useThemeColors } from '@apitable/components';
import { ConfigConstant, IReduxState, StoreActions, Strings, t } from '@apitable/core';
import { AddOutlined, CopyOutlined, ReloadOutlined } from '@apitable/icons';
import { IdentifyingCodeInput } from 'pc/components/common/input/identifying_code_input/identifying_code_input';
import { WithTipWrapper } from 'pc/components/common/input/with_tip_wrapper/with_tip_wrapper';
import { Message } from 'pc/components/common/message';
import { BaseModal } from 'pc/components/common/modal/base_modal';
import { Modal } from 'pc/components/common/modal/modal/modal';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common/tooltip';
import { useRequest } from 'pc/hooks/use_request';
import { useSetState } from 'pc/hooks/use_set_state';
import { useUserRequest } from 'pc/hooks/use_user_request';
import { useAppSelector } from 'pc/store/react-redux';
import { copy2clipBoard } from 'pc/utils/dom';
import { getEnvVariables } from 'pc/utils/env';
import { getMaskToken, getVerifyData, IRefreshConfigConfig, VerifyTypes } from '../utils';
import styles from './style.module.less';

export interface IDeveloperConfigProps {
  setActiveItem: React.Dispatch<React.SetStateAction<number>>;
}

export const DeveloperConfiguration: FC<React.PropsWithChildren<IDeveloperConfigProps>> = ({ setActiveItem }) => {
  const user = useAppSelector((state: IReduxState) => state.user.info);
  const colors = useThemeColors();
  const [identifyingCode, setIdentifyingCode] = useState('');
  const [inputValue, setInputValue] = useState(user!.apiKey);
  const [openCheckModal, setOpenCheckModal] = useState<boolean>();
  const dispatch = useDispatch();
  const [errMsg, setErrMsg] = useSetState<{
    accountErrMsg: string;
    identifyingCodeErrMsg: string;
  }>({
    accountErrMsg: '',
    identifyingCodeErrMsg: '',
  });
  const { createApiKeyReq, refreshApiKeyReq } = useUserRequest();
  const { run: createApiKey, loading: createKeyLoading } = useRequest(createApiKeyReq, { manual: true });
  const { run: refreshApiKey, loading } = useRequest(refreshApiKeyReq, { manual: true });

  const rebuildToken = () => {
    setOpenCheckModal(true);
  };

  const createToken = async () => {
    if (!user!.email) {
      Modal.confirm({
        title: t(Strings.please_note),
        content: t(Strings.create_token_tip),
        cancelText: t(Strings.cancel),
        okText: t(Strings.go_to),
        type: 'warning',
        onOk: () => {
          setActiveItem(0);
        },
      });
      return;
    }
    const result = await createApiKey();
    if (!result) {
      return;
    }
    dispatch(StoreActions.updateUserInfo({ apiKey: result }));
    setInputValue(result);
  };

  const copyToken = () => {
    if (!inputValue) {
      return;
    }
    copy2clipBoard(inputValue, () => Message.success({ content: t(Strings.copy_token_toast) }));
  };

  const onOk = async () => {
    if (!identifyingCode || !user) {
      return;
    }
    const type = user.mobile ? ConfigConstant.CodeTypes.SMS_CODE : ConfigConstant.CodeTypes.EMAIL_CODE;
    const result = await refreshApiKey(identifyingCode, type);
    if (!result.success) {
      setErrMsg({ identifyingCodeErrMsg: result.message });
      return;
    }
    setInputValue(result.data.apiKey);
    setOpenCheckModal(false);
  };

  const handleIdentifyingCodeChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (errMsg.identifyingCodeErrMsg) {
        setErrMsg({ identifyingCodeErrMsg: '' });
      }

      const value = e.target.value.trim();
      setIdentifyingCode(value);
    },
    [setErrMsg, errMsg.identifyingCodeErrMsg],
  );

  const CodeContent = React.useMemo(() => {
    if (!user || !(user?.email || user?.mobile)) return null;
    const { codeMode, title, smsType, emailType, areaCode, verifyAccount } = getVerifyData({
      key: VerifyTypes.REFRESH_TOKEN,
    }) as IRefreshConfigConfig;
    return (
      <>
        <div className={styles.tip}>{title}</div>
        <WithTipWrapper tip={errMsg.identifyingCodeErrMsg} captchaVisible>
          <IdentifyingCodeInput
            data={{ areaCode, account: verifyAccount }}
            smsType={smsType}
            emailType={emailType}
            mode={codeMode}
            onChange={handleIdentifyingCodeChange}
            setErrMsg={setErrMsg}
            error={Boolean(errMsg.identifyingCodeErrMsg)}
            disabled={Boolean(errMsg.accountErrMsg || errMsg.identifyingCodeErrMsg)}
          />
        </WithTipWrapper>
      </>
    );
  }, [user, setErrMsg, errMsg.identifyingCodeErrMsg, errMsg.accountErrMsg, handleIdentifyingCodeChange]);

  const maskAPIToken = getMaskToken(inputValue);

  const env = getEnvVariables();

  return (
    <div className={styles.developerConfiguration}>
      <div className={styles.title}>{t(Strings.developer_configuration)}</div>
      <div className={styles.label}>{t(Strings.token_value)}</div>
      <div className={styles.tokenWrapper}>
        <Input className={styles.token} placeholder={t(Strings.developer_token_placeholder)} id="developerToken" value={maskAPIToken} disabled />
        <ButtonGroup withSeparate>
          {(env.REGENERATE_API_TOKEN_VISIBLE || !user!.apiKey) && (
            <Tooltip title={!user!.apiKey ? t(Strings.generating_token_value) : t(Strings.rebuild_token_value)} placement="top">
              <Button disabled={createKeyLoading} onClick={!user!.apiKey ? createToken : rebuildToken}>
                {!user!.apiKey ? <AddOutlined color={colors.thirdLevelText} size={15} /> : <ReloadOutlined color={colors.thirdLevelText} size={15} />}
              </Button>
            </Tooltip>
          )}
          <Tooltip title={t(Strings.copy_token)} placement="top">
            <Button onClick={copyToken}>
              <CopyOutlined color={colors.thirdLevelText} size={15} />
            </Button>
          </Tooltip>
        </ButtonGroup>
      </div>
      {openCheckModal && (
        <BaseModal
          width={400}
          className={styles.checkModal}
          title={user?.mobile ? t(Strings.modal_title_check_original_phone) : t(Strings.modal_title_check_mail)}
          onOk={onOk}
          onCancel={() => setOpenCheckModal(false)}
          okButtonProps={{
            loading,
            disabled: !identifyingCode,
          }}
        >
          <div className={styles.content}>{CodeContent}</div>
        </BaseModal>
      )}
    </div>
  );
};
