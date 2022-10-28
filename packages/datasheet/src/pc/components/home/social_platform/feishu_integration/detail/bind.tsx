import { LinkButton, Loading, Message, useThemeColors } from '@vikadata/components';
import { Api, Strings, t } from '@apitable/core';
import { ChevronLeftOutlined } from '@vikadata/icons';
import { useRouter } from 'next/router';
import { useRequest, useUserRequest } from 'pc/hooks';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { defaultFieldConfig } from '../feishu_integration_config';
import { BindManager } from './bind_manager';
import { CreateApplication } from './create_application';
import { CreateEvent } from './create_event';
import { CreateRouter } from './create_router';
import { EventVerification } from './event_verification';
import { IntegrationDesc } from './integration_desc';
import { Steps } from './steps';

import styles from './styles.module.less';

const FeishuIntegrationBind: React.FC = () => {
  const router = useRouter();
  const { appInstanceId } = router.query as { appInstanceId: string };
  const [current, setCurrent] = useState(0);

  const [config, setConfig] = useState({ ...defaultFieldConfig });
  const { getLoginStatusReq } = useUserRequest();
  const { loading: isLoginStatusGetting } = useRequest(getLoginStatusReq);
  const colors = useThemeColors();
  const { run: requestInstance, loading: requestInstanceLoading } = useRequest(() => Api.getAppInstanceById(appInstanceId || '').then(res => {
    const { success, message, data } = res.data;
    if (success && data) {
      const { profile } = data.config;
      const { appKey, appSecret, eventVerificationToken, eventCheck, configComplete } = profile;
      let step = 0;
      const step1Complete = appKey && appSecret;
      const step3Complete = step1Complete && eventVerificationToken;
      const step4Complete = step3Complete && eventCheck;
      if (
        (appKey && !appSecret)
        || (!appKey && appSecret)
      ) {
        step = 1;
      } else if (step1Complete && !eventVerificationToken) {
        step = 3;
      } else if (step3Complete && !eventCheck) {
        step = 4;
      } else if (step4Complete && !configComplete) {
        step = 5;
      }
      setCurrent(step);
      setConfig({
        ...profile,
        appId: profile.appKey,
        encryptKey: profile.eventEncryptKey,
        verificationToken: profile.eventVerificationToken,
      });
      return;
    }
    Message.error({ content: message });
  }), {
    manual: true
  });

  useEffect(() => {
    if (appInstanceId) {
      requestInstance();
    }
  }, [appInstanceId, requestInstance]);

  if (isLoginStatusGetting || requestInstanceLoading) {
    return <Loading />;
  }

  const nextStep = () => {
    setCurrent(current + 1);
  };

  const steps = [
    {
      title: t(Strings.lark_integration_step1),
      content: <IntegrationDesc nextStep={nextStep} />,
    },
    {
      title: t(Strings.lark_integration_step2),
      content: (
        <CreateApplication
          onSetConfig={(result) => {
            setConfig((val) => ({
              ...val,
              ...result,
              appId: result.appKey,
              encryptKey: result.eventEncryptKey,
              verificationToken: result.eventVerificationToken
            }));
          }}
          appInstanceId={appInstanceId!}
          nextStep={nextStep}
          config={config}
        />
      ),
    },
    {
      title: t(Strings.lark_integration_step3),
      content: <CreateRouter config={config} nextStep={nextStep} />,
    },
    {
      title: t(Strings.lark_integration_step4),
      content: (
        <CreateEvent
          nextStep={nextStep}
          onSetConfig={(result) => {
            setConfig((val) => ({
              ...val,
              ...result,
              appId: result.appKey,
              encryptKey: result.eventEncryptKey,
              verificationToken: result.eventVerificationToken
            }));
          }}
          appInstanceId={appInstanceId!}
          config={config}
        />
      )
    },
    {
      title: t(Strings.lark_integration_step5),
      content: <EventVerification config={config} appInstanceId={appInstanceId!} nextStep={nextStep} />
    },
    {
      title: '绑定主管理员',
      content: <BindManager step={current} config={config} />
    }
  ];

  return (
    <div className={styles.wecomIntegrationBind}>
      {current > 0 && <LinkButton
        className={styles.prevBtn}
        underline={false}
        color={colors.thirdLevelText}
        prefixIcon={<ChevronLeftOutlined color={colors.thirdLevelText} />}
        onClick={() => setCurrent(current - 1)}
      >
        {t(Strings.last_step)}
      </LinkButton>}
      <div className={styles.stepWrapper}>
        <Steps steps={steps} current={current} onChange={setCurrent} />
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

export default FeishuIntegrationBind;
