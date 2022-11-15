import { Button, Checkbox, LinkButton, Loading, useThemeColors } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { ChevronLeftOutlined } from '@apitable/icons';
import { useRequest, useUserRequest } from 'pc/hooks';
import * as React from 'react';
import { useContext, useState } from 'react';
import { FormItem } from '../components/form_item';
import { WecomIntegrationContext } from '../wecom_integration_context';
import { CopyButton, CreateApplication } from './create_application';
import { IntegrationDesc } from './integration_desc';
import { ScanBind } from './scan_bind';
import { Steps } from './steps';
import styles from './styles.module.less';

const WecomIntegrationBind: React.FC = () => {
  const colors = useThemeColors();
  const { scrollTo } = useContext(WecomIntegrationContext);
  const [current, setCurrent] = useState(0);
  const [config, setConfig] = useState({
    corpId: '',
    agentId: '',
    configSha: '',
    domainName: ''
  });
  const [checkbox, setCheckbox] = useState(false);
  const { getLoginStatusReq } = useUserRequest();
  const { loading: isLoginStatusGetting } = useRequest(getLoginStatusReq);

  if (isLoginStatusGetting) {
    return <Loading />;
  }

  const infoBox = (formData) => {
    const schema = {
      appHomepageUrl: {
        label: t(Strings.integration_app_wecom_form2_item1_label),
        required: true,
        readonly: true,
        suffix: CopyButton(formData['appHomepageUrl'])
      },
      trustedDomain: {
        label: t(Strings.integration_app_wecom_form2_item2_label),
        required: true,
        readonly: true,
        suffix: CopyButton(formData['trustedDomain'])
      }
    };
    return (
      <div className={styles.formPage}>
        <div className={styles.formWrap}>
          <div className={styles.form}>
            <div className={styles.formTitle}>{t(Strings.integration_app_wecom_form2_title)}</div>
            <div
              className={styles.formDesc}
              dangerouslySetInnerHTML={{ __html: t(Strings.integration_app_wecom_form2_desc) }}
            />
            <div className={styles.formContent}>
              {
                Object.keys(schema).map(key => (
                  <FormItem key={key} formData={formData} formItem={{ ...schema[key], key }}/>
                ))
              }
            </div>
          </div>
        </div>
        <div className={styles.checkboxWrap}>
          <Checkbox checked={checkbox} onChange={() => setCheckbox(!checkbox)} >
            <span className={styles.checkboxText}>{t(Strings.integration_app_wecom_info_check)}</span>
          </Checkbox>
        </div>
        <div className={styles.buttonWrap}>
          <Button color="primary" onClick={() => setCurrent(3)} block disabled={!checkbox}>{t(Strings.next_step)}</Button>
        </div>
      </div>
    );
  };

  const nextStep = () => {
    setCurrent(current + 1);
  };

  const steps = [
    {
      title: t(Strings.integration_app_wecom_step1_title),
      content: <IntegrationDesc nextStep={nextStep}/>,
    },
    {
      title: t(Strings.integration_app_wecom_step2_title),
      content: (
        <CreateApplication
          nextStep={nextStep}
          setConfig={(corpId, agentId, configSha, domainName) => {
            setConfig({ corpId, agentId, configSha, domainName });
          }}
          scrollToTop={() => scrollTo(0)}
        />
      ),
    },
    {
      title: t(Strings.integration_app_wecom_step_info_title),
      content: infoBox({
        appHomepageUrl: `${window.location.protocol}//${config.domainName}/user/wecom_callback?corpId=${config.corpId}&agentId=${config.agentId}`,
        trustedDomain: config.domainName
      }),
    },
    {
      title: t(Strings.integration_app_wecom_step3_title),
      // Since the step is loaded first and then controlled to be hidden, a condition is given here to prevent early loading
      content: current === 3 && <ScanBind {...config} />
    },
  ];

  return (
    <div className={styles.wecomIntegrationBind}>
      {current > 0 && <LinkButton
        className={styles.prevBtn}
        underline={false}
        color={colors.thirdLevelText}
        prefixIcon={<ChevronLeftOutlined color={colors.thirdLevelText}/>}
        onClick={() => setCurrent(current - 1)}
      >
        {t(Strings.last_step)}
      </LinkButton>}
      {/* step */}
      <div className={styles.stepWrapper}>
        <Steps steps={steps} current={current} onChange={setCurrent}/>
      </div>
      {
        steps.map((item, index) => (
          <div
            className={styles.contentMain}
            style={{ display: current === index ? 'block' : 'none' }}
            key={item.title}
          >
            {item.content}
          </div>
        ))
      }
    </div>
  );
};

export default WecomIntegrationBind;
