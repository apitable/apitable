import { Button, Checkbox, colorVars } from '@apitable/components';
import { Tooltip } from 'pc/components/common';
import { useEffect, useState } from 'react';
import * as React from 'react';
import styles from './styles.module.less';
import { CopyOutlined } from '@apitable/icons';
import { Strings, t } from '@apitable/core';
import { copy2clipBoard } from 'pc/utils';
import classNames from 'classnames';
import { IFeishuConfigParams } from '../interface';
// @ts-ignore
import { WecomFormItem } from 'enterprise';

interface ICreateRouter {
  nextStep: () => void;
  onSetConfig?: (checked: boolean) => void;
  config: IFeishuConfigParams;
}

export const copyButton = value => (
  <Tooltip title={t(Strings.copy_link)} placement="top">
    <Button
      className={styles.iconButton}
      color={colorVars.fc6}
      onClick={() => {
        copy2clipBoard(value);
      }}
    >
      <CopyOutlined className={styles.buttonIcon} color={colorVars.secondLevelText} />
    </Button>
  </Tooltip>
);

export const CreateRouter: React.FC<ICreateRouter> = props => {
  const { nextStep, config } = props;
  const [checked, setChecked] = useState(false);
  const [formData, setFormData] = useState({
    pcUrl: config.pcUrl,
    mobileUrl: config.mobileUrl,
    redirectUrl: config.redirectUrl,
  });

  useEffect(() => {
    setFormData({
      pcUrl: config.pcUrl,
      mobileUrl: config.mobileUrl,
      redirectUrl: config.redirectUrl,
    });
  }, [config]);

  const schema = {
    pcUrl: {
      label: t(Strings.lark_integration_step3_desktop),
      readonly: true,
      suffix: copyButton(formData.pcUrl),
    },
    mobileUrl: {
      label: t(Strings.lark_integration_step3_mobile),
      readonly: true,
      suffix: copyButton(formData.mobileUrl),
    },
    redirectUrl: {
      label: t(Strings.lark_integration_step3_redirect),
      readonly: true,
      suffix: copyButton(formData.redirectUrl),
    },
  };

  const onClick = () => {
    if (!checked) {
      return;
    }
    nextStep();
  };

  return (
    <div className={classNames(styles.createApplication, styles.formPage)}>
      <div className={styles.formWrap}>
        <div className={styles.form}>
          <div className={styles.formTitle}>{t(Strings.lark_integration_step3_title)}</div>
          <div className={styles.formDesc} dangerouslySetInnerHTML={{ __html: t(Strings.lark_integration_step3_content) }} />
          <div className={styles.formContent}>
            {Object.keys(schema).map(key => (
              <WecomFormItem key={key} formData={formData} formItem={{ ...schema[key], key }} />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.checkboxWrap}>
        <Checkbox checked={checked} onChange={() => setChecked(!checked)}>
          <span className={styles.checkboxText}>{t(Strings.lark_integration_step3_checkbox)}</span>
        </Checkbox>
      </div>
      <div className={styles.buttonWrap}>
        <Button color="primary" onClick={onClick} disabled={!checked} block>
          {t(Strings.next_step)}
        </Button>
      </div>
    </div>
  );
};
