import { FC, useState } from 'react';
import * as React from 'react';
import styles from './style.module.less';
import CheckBoxSelect from 'static/icon/account/account_icon_checkbox_select.svg';
import CheckBoxNormal from 'static/icon/account/account_icon_checkbox_normal.svg';
import { t, Strings } from '@apitable/core';
import { PasswordInput } from 'pc/components/common';
import { Form } from 'antd';
import { Button } from '@vikadata/components';

interface ISetPassword {
  apiCb(
    // e: React.FormEvent<HTMLFormElement>,
    password: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setPwdErr: React.Dispatch<React.SetStateAction<string>>,
  ): void;
}

export const SetPassword: FC<ISetPassword> = props => {
  const [form, setForm] = useState({
    password: '',
    firstPwd: '',
    isCheck: false,
  });
  const [isCheck, setIsCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setPwdErr] = useState('');

  const handleSubmit = () => {
    if (form.firstPwd !== form.password) {
      setPwdErr(t(Strings.password_not_identical_err));
      return;
    }
    props.apiCb(form.password, setLoading, setPwdErr);
    setLoading(true);
  };
  const handleChange = (e, property: 'firstPwd' | 'password') => {
    setForm({
      ...form,
      [property]: e.target.value,
    });
  };
  return (
    <div className={styles.setPasswordWrapper}>
      <h2>{t(Strings.label_set_password)}</h2>
      <Form>
        <PasswordInput
          value={form.firstPwd}
          onChange={e => { handleChange(e, 'firstPwd'); }}
          placeholder={t(Strings.placeholder_set_password)}
          autoComplete="Off"
        />
        <PasswordInput
          value={form.password}
          onChange={e => { handleChange(e, 'password'); }}
          placeholder={t(Strings.placeholder_input_password_again)}
          autoComplete="Off"
        // err={pwdErr}
        />
        <div className={styles.protocol}>
          <div
            className={styles.checkBox}
            onClick={e => setIsCheck(!isCheck)}
          >
            {isCheck ? <CheckBoxSelect className={styles.checkBoxSelect} /> : <CheckBoxNormal />}
          </div>
          <div className={styles.protocolText}>
            {t(Strings.read_agree_agreement, {
              Agreement1: <a href="/agreement/register">{t(Strings.registration_service_agreement)}</a>,
              Agreement2: <a href="/agreement/private">{t(Strings.privacy_protection)}</a>,
            })}
          </div>
        </div>
        <Button
          color="primary"
          htmlType="submit"
          disabled={!isCheck || form.firstPwd === '' || form.password === ''}
          loading={loading}
          onClick={() => {
            handleSubmit();
          }}
          block
        >
          确认加入
        </Button>
      </Form>
    </div>
  );
};
