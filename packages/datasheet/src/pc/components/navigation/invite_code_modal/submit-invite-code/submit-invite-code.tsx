import { Button, Message, TextInput, Typography } from '@apitable/components';
import { ConfigConstant, Strings, t } from '@apitable/core';
import { StoreActions } from '@apitable/core';
import Image from 'next/image';
import { TriggerCommands } from 'modules/shared/apphook/trigger_commands';
import { WithTipWrapper } from 'pc/components/common';
import { useRequest, useUserRequest } from 'pc/hooks';
import { dispatch } from 'pc/worker/store';
import { FC, useState } from 'react';
import imgUrl from 'static/icon/space/space_img_nickname.png';
import styles from './style.module.less';

interface ISubmitInviteCode {
  submitAndSuccess: () => void
  myInviteCode: string
}

export const SubmitInviteCode: FC<ISubmitInviteCode> = ({ submitAndSuccess, myInviteCode }) => {
  const [val, setVal] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const { submitInviteCodeReq } = useUserRequest();
  const { run: submitInviteCode, loading } = useRequest(submitInviteCodeReq, { manual: true });

  const submit = () => {
    if (val === myInviteCode) {
      setErrMsg(t(Strings.invite_code_cannot_use_mine));
      return;
    }
    submitInviteCode(val)
      .then(res => {
        if (!res.success) {
          setErrMsg(res.message);
        } else {
          Message.success({ content: t(Strings.got_v_coins) });
          submitAndSuccess();
          dispatch(StoreActions.setUsedInviteReward(true));
        }
      });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let s = e.target.value;
    s = s.replace(/[^\d]/g, '');
    if (!loading && s.length < 8) {
      setErrMsg('');
    }
    setVal(s);
  };

  const checkValid = () => {
    return val.length === 8;
  };

  return (
    <div className={styles.submitInviteCode}>
      <div className={styles.topImgBox}>
        <Image src={imgUrl} width={120} height={90}/>
      </div>
      <Typography variant='h7' className={styles.desc}>{t(Strings.invite_code_tab_sumbit_get_v_coin_both)}</Typography>
      <div className={styles.form}>
        <WithTipWrapper tip={errMsg}>
          <TextInput
            error={Boolean(errMsg)}
            placeholder={t(Strings.invite_code_tab_submit_input_placeholder)}
            maxLength={8}
            value={val}
            onChange={onChange}
            block
          />
        </WithTipWrapper>
        <Button
          color='primary'
          block
          className={styles.submitBtn}
          onClick={submit}
          disabled={!checkValid()}
          loading={loading}
        >
          {t(Strings.submit)}
        </Button>
      </div>
      <div className={styles.bottomTip}>
        {t(Strings.invite_code_no)}
        <span className={styles.btn} onClick={() => {
          TriggerCommands.open_guide_wizard(ConfigConstant.WizardIdConstant.CONTACT_US_GUIDE);
        }}>{t(Strings.invite_code_add_official)}</span>
      </div>
    </div>
  );
};
