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

import { Form } from 'antd';
import { FC, useState } from 'react';
import * as React from 'react';
import { shallowEqual } from 'react-redux';
import { Button } from '@apitable/components';
import { Api, ConfigConstant, IReduxState, Strings, t } from '@apitable/core';
import { IdentifyingCodeInput, WithTipWrapper } from 'pc/components/common/input';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { getVerifyData, IDelSpaceConfig, VerifyTypes } from 'pc/components/navigation/account_center_modal/utils';
import { useRequest, useSetState } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import styles from './style.module.less';

export interface IDelSpaceModalProps {
  setIsDelSpaceModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDelSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DelSpaceModal: FC<React.PropsWithChildren<IDelSpaceModalProps>> = (props) => {
  const [identifyingCode, setIdentifyingCode] = useState('');
  const { setIsDelSpaceModal, setIsDelSuccessModal } = props;
  const { user, spaceId } = useAppSelector(
    (state: IReduxState) => ({
      spaceId: state.space.activeId || '',
      user: state.user.info,
    }),
    shallowEqual,
  );
  const { run: del, loading } = useRequest((spaceId, code, type) => Api.deleteSpace(spaceId, code, type), {
    manual: true,
    onSuccess: (res) => {
      const { success, message } = res.data;
      if (success) {
        setIsDelSuccessModal(true);
        handleCancel();
        return;
      }
      setErrMsg({ identifyingCodeErrMsg: message });
    },
  });

  const [errMsg, setErrMsg] = useSetState<{
    accountErrMsg: string;
    identifyingCodeErrMsg: string;
  }>({
    accountErrMsg: '',
    identifyingCodeErrMsg: '',
  });
  const handleCancel = () => {
    setIsDelSpaceModal(false);
  };

  const handleSubmit = () => {
    if (!user || !spaceId) {
      return;
    }
    const type = user.mobile ? ConfigConstant.CodeTypes.SMS_CODE : ConfigConstant.CodeTypes.EMAIL_CODE;
    del(spaceId, identifyingCode, type);
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

    const { codeMode, title, smsType, emailType, areaCode, verifyAccount } = getVerifyData({ key: VerifyTypes.DEL_SPACE }) as IDelSpaceConfig;
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

  return (
    <Modal
      title={user?.mobile ? t(Strings.modal_verify_admin_phone) : t(Strings.modal_verify_admin_email)}
      visible
      className={styles.delSpaceModal}
      footer={null}
      width={390}
      maskClosable
      onCancel={handleCancel}
      centered
    >
      <div>
        <Form>
          {CodeContent}
          <Button className={styles.delBtn} disabled={!identifyingCode} variant="fill" color="danger" loading={loading} onClick={handleSubmit}>
            {t(Strings.confirm_delete)}
          </Button>
        </Form>
      </div>
    </Modal>
  );
};
