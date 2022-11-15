import { Button, Message } from '@apitable/components';
import { useCallback, useEffect, useState } from 'react';
import * as React from 'react';
import styles from './styles.module.less';
import { Strings, t, Api } from '@apitable/core';
import { FormItem, IFormItem } from '../../wecom_integration/components/form_item';
import classNames from 'classnames';
import { IFeishuConfigParams } from '../interface';

export interface IConfigForm {
  encryptKey: string;
  verificationToken: string;
}

interface ICreateEvent {
  nextStep: () => void;
  appInstanceId: string;
  onSetConfig: (result) => void;
  config: IFeishuConfigParams;
}

const schema1 = {
  encryptKey: {
    label: t(Strings.lark_integration_step4_encryptkey),
  },
  verificationToken: {
    label: t(Strings.lark_integration_step4_verificationtoken),
    required: true,
  },
};

export const CreateEvent: React.FC<ICreateEvent> = props => {
  const { nextStep, onSetConfig, appInstanceId, config } = props;
  const [isValidForm, setIsValidForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<IConfigForm>({
    encryptKey: config.encryptKey,
    verificationToken: config.verificationToken,
  });
  const [formError, setFormError] = useState({
    encryptKey: '',
    verificationToken: '',
  });

  const setError = () => {
    const error = {};
    Object.keys(schema1).forEach(key => {
      if (schema1[key].required) {
        error[key] = `${t(Strings.please_check)} ${schema1[key].label}`;
      }
    });
    setFormError(val => ({ ...val, ...error }));
  };

  const validator = useCallback(properties => {
    return Object.keys(schema1).every(key => {
      const property = schema1[key];
      const value = properties[key];
      if (property.required && !value) {
        setError();
        return false;
      }
      return true;
    });
  }, []);

  const handleChange = useCallback(
    (e, item: IFormItem) => {
      const value = e.target.value;
      if (value.length > 0) {
        setFormError(val => ({ ...val, [item.key]: '' }));
      }
      const form = { ...formData, [item.key]: e.target.value };
      setFormData(form);
      setIsValidForm(validator(form));
    },
    [formData, validator],
  );

  const setLarkConfig = useCallback(
    async(formData: IConfigForm) => {
      setLoading(true);
      const { data: result } = await Api.updateLarkEventConfig(
        appInstanceId,
        formData.encryptKey ? formData.encryptKey.trim() : '',
        formData.verificationToken.trim(),
      );
      const { data, success, message } = result;
      setLoading(false);
      if (success) {
        nextStep();
        onSetConfig(data.config.profile);
        return;
      }
      const error = {};
      Object.keys(schema1).forEach(key => {
        error[key] = `${t(Strings.please_check)} ${schema1[key].label}`;
      });
      setFormError(val => ({ ...val, ...error }));
      Message.error({ content: message });
    },
    [setFormError, appInstanceId, nextStep, onSetConfig],
  );

  const onClick = useCallback(() => {
    if (!validator(formData)) {
      return;
    }
    setLarkConfig(formData);
  }, [formData, setLarkConfig, validator]);

  useEffect(() => {
    if (config.verificationToken) {
      setIsValidForm(validator(config));
    }
  }, [config, validator]);

  return (
    <div className={classNames(styles.createApplication, styles.formPage)}>
      <div className={styles.formWrap}>
        <div className={styles.form}>
          <div className={styles.formTitle}>{t(Strings.lark_integration_step4_title)}</div>
          <div className={styles.formDesc} dangerouslySetInnerHTML={{ __html: t(Strings.lark_integration_step4_content) }} />
          <div className={styles.formContent}>
            {Object.keys(schema1).map(key => (
              <FormItem key={key} formData={formData} formItem={{ ...schema1[key], key }} error={formError[key]} onChange={handleChange} />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.buttonWrap}>
        <Button color="primary" onClick={onClick} disabled={!isValidForm} block loading={loading}>
          {t(Strings.lark_integration_step4_next)}
        </Button>
      </div>
    </div>
  );
};
