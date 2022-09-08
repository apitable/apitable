import {
  Api,
  ConfigConstant,
  IReduxState,
  Strings,
  t
} from '@vikadata/core';
import { useSetState } from 'pc/hooks';
import { Form } from 'antd';
import { IdentifyingCodeInput, WithTipWrapper } from 'pc/components/common/input';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { FC, useState } from 'react';
import * as React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import styles from './style.module.less';
import { useRequest } from 'pc/hooks';
import { Button } from '@vikadata/components';
import { getVerifyData, IDelSpaceConfig, VerifyTypes } from 'pc/components/navigation/account_center_modal/utils';

export interface IDelSpaceModalProps {
  setIsDelSpaceModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDelSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DelSpaceModal: FC<IDelSpaceModalProps> = (props) => {
  const [identifyingCode, setIdentifyingCode] = useState('');
  const { setIsDelSpaceModal, setIsDelSuccessModal } = props;
  const { user, spaceId } = useSelector((state: IReduxState) => ({
    spaceId: state.space.activeId || '',
    user: state.user.info
  }), shallowEqual);
  const { run: del, loading } = useRequest(
    (spaceId, code, type) => Api.deleteSpace(spaceId, code, type),
    {
      manual: true,
      onSuccess: (res) => {
        const { success, message } = res.data;
        if (success) {
          setIsDelSuccessModal(true);
          handleCancel();
          return;
        }
        setErrMsg({ identifyingCodeErrMsg: message });
      }
    }
  );

  const [errMsg, setErrMsg] = useSetState<{
    accountErrMsg: string;
    identifyingCodeErrMsg: string;
  }>({
    accountErrMsg: '',
    identifyingCodeErrMsg: ''
  });
  const handleCancel = () => {
    setIsDelSpaceModal(false);
  };

  const handleSubmit = () => {
    if (!user || !spaceId) {
      return;
    }
    const type = user.mobile ? ConfigConstant.CodeTypes.SMS_CODE :
      ConfigConstant.CodeTypes.EMAIL_CODE;
    del(spaceId, identifyingCode, type);
  };

  const handleIdentifyingCodeChange = React.useCallback((
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (errMsg.identifyingCodeErrMsg) {
      setErrMsg({ identifyingCodeErrMsg: '' });
    }

    const value = e.target.value.trim();
    setIdentifyingCode(value);
  }, [setErrMsg, errMsg.identifyingCodeErrMsg]);

  const CodeContent = React.useMemo(() => {
    if (!user || !(user?.email || user?.mobile)) return null;

    const { codeMode, title, smsType, emailType, areaCode, verifyAccount } =
      getVerifyData({ key: VerifyTypes.DEL_SPACE }) as IDelSpaceConfig;
    return (
      <>
        <div className={styles.tip}>
          {title}
        </div>
        <WithTipWrapper tip={errMsg.identifyingCodeErrMsg} captchaVisible>
          <IdentifyingCodeInput
            data={{ areaCode, account: verifyAccount }}
            smsType={smsType}
            emailType={emailType}
            mode={codeMode}
            onChange={handleIdentifyingCodeChange}
            setErrMsg={setErrMsg}
            error={Boolean(errMsg.identifyingCodeErrMsg)}
            disabled={Boolean(
              errMsg.accountErrMsg ||
              errMsg.identifyingCodeErrMsg
            )}
          />
        </WithTipWrapper>
      </>
    );
  }, [user, setErrMsg, errMsg.identifyingCodeErrMsg, errMsg.accountErrMsg, handleIdentifyingCodeChange]);

  return (
    <Modal
      title={(user?.mobile) ? t(Strings.modal_verify_admin_phone) : t(Strings.modal_verify_admin_email)}
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
          <Button
            className={styles.delBtn}
            disabled={!identifyingCode}
            variant='fill'
            color='danger'
            loading={loading}
            onClick={handleSubmit}
          >
            {t(Strings.confirm_delete)}
          </Button>
        </Form>
      </div>
    </Modal>
  );
};
