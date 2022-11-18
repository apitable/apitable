import { Button, Message, useThemeColors } from '@apitable/components';
import { Tooltip } from 'pc/components/common';
import { useEffect, useState } from 'react';
import * as React from 'react';
import styles from './styles.module.less';
import { CopyOutlined, CloseMiddleOutlined, SelectOutlined } from '@apitable/icons';
import { Api, Strings, t } from '@apitable/core';
import { copy2clipBoard } from 'pc/utils';
import classNames from 'classnames';
import { IFeishuConfigParams } from '../interface';
// @ts-ignore
import { WecomFormItem } from 'enterprise';


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

interface IEventVerification {
  config: IFeishuConfigParams;
  appInstanceId: string;
  nextStep: () => void;
}

enum ErrorStatus {
  Normal = 'normal',
  Error = 'danger',
  Success = 'primary',
}

const errorMap = {
  [ErrorStatus.Error]: <CloseMiddleOutlined />,
  [ErrorStatus.Success]: <SelectOutlined />,
};

export const EventVerification: React.FC<IEventVerification> = props => {
  const { config, appInstanceId, nextStep } = props;
  const [error, setError] = useState<ErrorStatus>(ErrorStatus.Normal);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    eventUrl: config.eventUrl,
  });
  const colors = useThemeColors();

  useEffect(() => {
    setFormData({
      eventUrl: config.eventUrl,
    });
  }, [config.eventUrl]);

  const schema = {
    eventUrl: {
      label: t(Strings.lark_integration_step5_request_url),
      readonly: true,
      suffix: copyButton(formData.eventUrl, colors),
    },
  };

  const onClick = async() => {
    setLoading(true);
    const res = await Api.getAppInstanceById(appInstanceId);
    const { success, data, message } = res.data;
    if (success && data) {
      const { eventCheck } = data.config.profile;
      if (eventCheck) {
        setError(ErrorStatus.Success);
      } else {
        setError(ErrorStatus.Error);
      }
    } else {
      Message.error({ content: message });
    }
    setLoading(false);
  };

  return (
    <div className={classNames(styles.createApplication, styles.formPage)}>
      <div className={styles.formWrap}>
        <div className={styles.form}>
          <div className={styles.formTitle}>{t(Strings.lark_integration_step5_title)}</div>
          <div className={styles.formDesc} dangerouslySetInnerHTML={{ __html: t(Strings.lark_integration_step5_content) }} />
          <div className={styles.formContent}>
            {Object.keys(schema).map(key => (
              <WecomFormItem key={key} formData={formData} formItem={{ ...schema[key], key }} />
            ))}
          </div>
        </div>
        <div style={{ marginTop: 33 }}>
          <Button
            color={error === ErrorStatus.Error ? ErrorStatus.Error : ErrorStatus.Success}
            onClick={onClick}
            loading={loading}
            prefixIcon={error !== ErrorStatus.Normal ? errorMap[error] : undefined}
            disabled={error === ErrorStatus.Success}
          >
            {error === ErrorStatus.Normal
              ? t(Strings.lark_integration_step5_request_button)
              : error === ErrorStatus.Error
                ? t(Strings.lark_integration_step5_request_button_error)
                : t(Strings.lark_integration_step5_request_button_success)}
          </Button>
          {error === ErrorStatus.Error && (
            <div className={styles.verificationError}>
              <div className={styles.verificationErrorTitle}>{t(Strings.lark_integration_step5_error_title)}</div>
              <div
                className={styles.verificationErrorContent}
                dangerouslySetInnerHTML={{ __html: t(Strings.lark_integration_step5_error_content) }}
              />
            </div>
          )}
        </div>
      </div>
      <div className={styles.buttonWrap}>
        <Button color="primary" onClick={nextStep} disabled={error !== ErrorStatus.Success} block>
          {t(Strings.next_step)}
        </Button>
      </div>
    </div>
  );
};
