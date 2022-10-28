import { Button, Message } from '@vikadata/components';
import { Tooltip } from 'pc/components/common';
import { useEffect, useState } from 'react';
import * as React from 'react';
import classNames from 'classnames';
import { CopyOutlined } from '@vikadata/icons';
import { Strings, t, Api } from '@apitable/core';
import { copy2clipBoard } from 'pc/utils';
import { FormItem, IFormItem } from '../../wecom_integration/components/form_item';
import { IFeishuConfigParams } from '../interface';
import styles from './styles.module.less';

export interface IConfigForm {
  appId: string;
  appSecret: string;
}

interface ICreateApplicationProps {
  nextStep: () => void;
  onSetConfig: (result: any) => void;
  appInstanceId: string;
  config: IFeishuConfigParams;
}

export const copyButton = (value, colors) => (
  <Tooltip title={t(Strings.copy_link)} placement="top">
    <Button
      className={styles.iconButton}
      color={colors.fc6}
      onClick={() => {
        copy2clipBoard(value);
      }}
    >
      <CopyOutlined className={styles.buttonIcon} color={colors.secondLevelText} />
    </Button>
  </Tooltip>
);

export const CreateApplication: React.FC<ICreateApplicationProps> = props => {
  const { nextStep, onSetConfig, appInstanceId, config } = props;
  const [isValidForm, setIsValidForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<IConfigForm>({
    appId: config.appId,
    appSecret: config.appSecret,
  });
  const [formError, setFormError] = useState({
    appId: '',
    appSecret: '',
  });

  const handleChange = (e, item: IFormItem) => {
    const value = e.target.value;
    if (value.length > 0) {
      setFormError({ ...formError, [item.key]: '' });
    }
    const form = {
      ...formData,
      [item.key]: e.target.value,
    };
    setFormData(form);
  };

  useEffect(() => {
    setIsValidForm(Object.keys(formData).every(key => formData[key]));
  }, [formData]);

  const schema1 = {
    appId: {
      label: t(Strings.lark_integration_step2_appid),
      required: true,
    },
    appSecret: {
      label: t(Strings.lark_integration_step2_appsecret),
      required: true,
    },
  };

  const setError = () => {
    const error = {};
    Object.keys(schema1).forEach(key => {
      error[key] = `${t(Strings.please_check)} ${schema1[key].label}`;
    });
    setFormError({ ...formError, ...error });
  };

  const validator = properties => {
    return Object.keys(properties).every(key => {
      const property = properties[key];
      const value = formData[key];
      if (property.required && !value) {
        setError();
        return false;
      }
      return true;
    });
  };

  const setLarkConfig = async(formData: IConfigForm) => {
    setLoading(true);
    const {
      data: { success, message, data },
    } = await Api.updateLarkBaseConfig(appInstanceId, formData.appId.trim(), formData.appSecret.trim());
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
    setFormError({ ...formError, ...error });
    Message.error({ content: message });
  };

  const onClick = () => {
    if (!validator({ ...schema1 })) {
      return;
    }
    setLarkConfig(formData);
  };

  return (
    <div className={classNames(styles.createApplication, styles.formPage)}>
      <div className={styles.formWrap}>
        <div className={styles.form}>
          <div className={styles.formTitle}>{t(Strings.lark_integration_step2_title)}</div>
          <div className={styles.formDesc} dangerouslySetInnerHTML={{ __html: t(Strings.lark_integration_step2_content) }} />
          <div className={styles.formContent}>
            {Object.keys(schema1).map(key => (
              <FormItem key={key} formData={formData} formItem={{ ...schema1[key], key }} error={formError[key]} onChange={handleChange} />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.buttonWrap}>
        <Button color="primary" onClick={onClick} disabled={!isValidForm} block loading={loading}>
          {t(Strings.lark_integration_step2_next)}
        </Button>
      </div>
    </div>
  );
};
