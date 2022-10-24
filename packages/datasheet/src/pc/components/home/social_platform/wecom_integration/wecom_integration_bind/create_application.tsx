import { Button, Message, useThemeColors } from '@vikadata/components';
import { Tooltip } from 'pc/components/common';
import { useEffect, useState } from 'react';
import * as React from 'react';
import styles from './styles.module.less';
import { CopyOutlined } from '@vikadata/icons';
import { Strings, t, Api } from '@apitable/core';
import { copy2clipBoard } from 'pc/utils';
import { FormItem, IFormItem } from '../components/form_item';
import classNames from 'classnames';

export interface IConfigForm {
  corpId: string;
  agentId: string;
  agentSecret: string;
}

interface ICreateApplicationProps {
  nextStep: () => void;
  scrollToTop: () => void;
  setConfig: (corpId, agentId, configSha, domainName) => void
}

export const CopyButton = (value) => {
  const colors = useThemeColors();
  return (
    <Tooltip title={t(Strings.copy_link)} placement="top">
      <Button
        className={styles.iconButton}
        color={colors.fc6}
        onClick={() => {
          copy2clipBoard(value);
        }}
      ><CopyOutlined className={styles.buttonIcon} color={colors.secondLevelText} /></Button>
    </Tooltip>
  );
};

export const CreateApplication: React.FC<ICreateApplicationProps> = (props) => {
  const { nextStep, scrollToTop, setConfig } = props;
  const [isValidForm, setIsValidForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<IConfigForm>({
    corpId: '',
    agentId: '',
    agentSecret: '',
  });
  const [formError, setFormError] = useState({
    corpId: '',
    agentId: '',
    agentSecret: ''
  });

  const handleChange = (e, item: IFormItem) => {
    const value = e.target.value;
    if (value.length > 0) {
      setFormError({ ...formError, [item.key]: '' });
    }
    const form = {
      ...formData,
      [item.key]: e.target.value
    };
    setFormData(form);
  };

  useEffect(() => {
    setIsValidForm(Object.keys(formData).every(key => formData[key]));
  }, [formData]);

  const schema1 = {
    corpId: {
      label: t(Strings.integration_app_wecom_form1_item1_label),
      pattern: /^\S*$/,
      required: true
    },
    agentId: {
      label: t(Strings.integration_app_wecom_form1_item2_label),
      pattern: /^[0-9]*$/,
      required: true
    },
    agentSecret: {
      label: t(Strings.integration_app_wecom_form1_item3_label),
      pattern: /^\S*$/,
      required: true
    }
  };

  const setError = () => {
    const error = {};
    Object.keys(schema1).forEach(key => {
      error[key] = `${t(Strings.please_check)} ${schema1[key].label}`;
    });
    setFormError({ ...formError, ...error });
  };

  const validator = (properties) => {
    return Object.keys(properties).every(key => {
      const property = properties[key];
      const value = formData[key];
      if (property.required && !(value && property.pattern.test(value))) {
        setError();
        return false;
      }
      return true;
    });
  };

  const setWecomConfig = async(formData) => {
    setLoading(true);
    const { data: { data, success, message, code }} = await Api.socialWecomCheckConfig(formData);
    setLoading(false);
    if (success) {
      nextStep();
      setConfig(formData.corpId, formData.agentId, data?.configSha, data?.domainName);
      return;
    }
    // 判断企业微信返回的三种code， 当corpId、agentId、secret 不正确的情况
    if ([40001, 40013, 301002].includes(code)) {
      const error = {};
      Object.keys(schema1).forEach(key => {
        error[key] = `${t(Strings.please_check)} ${schema1[key].label}`;
      });
      setFormError({ ...formError, ...error });
      return;
    }
    Message.error({ content: message });
  };

  const onClick = () => {
    if (!validator({ ...schema1 })) {
      scrollToTop();
      return;
    }
    // 下一步，验证配置
    setWecomConfig(formData);
  };

  return (
    <div className={classNames(
      styles.createApplication,
      styles.formPage
    )}>
      <div className={styles.formWrap}>
        <div className={styles.form}>
          <div className={styles.formTitle}>{t(Strings.integration_app_wecom_form1_title)}</div>
          <div
            className={styles.formDesc}
            dangerouslySetInnerHTML={{ __html: t(Strings.integration_app_wecom_form1_desc) }}
          />
          <div className={styles.formContent}>
            {
              Object.keys(schema1).map(key => (
                <FormItem key={key} formData={formData} formItem={{ ...schema1[key], key }} error={formError[key]} onChange={handleChange} />
              ))
            }
          </div>
        </div>
      </div>
      <div className={styles.buttonWrap}>
        <Button color="primary" onClick={onClick} disabled={!isValidForm} block loading={loading}>{t(Strings.next_step)}</Button>
      </div>
    </div>
  );
};
