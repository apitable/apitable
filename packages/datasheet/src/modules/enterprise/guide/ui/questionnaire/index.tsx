/* eslint-disable */
import { Button } from '@vikadata/components';
import { ICustomConfig, integrateCdnHost, IReduxState, Strings, t } from '@apitable/core';
import { Checkbox, Input, Modal as AntdModal, Radio } from 'antd';
import classNames from 'classnames';
// import './questionnaire.less';
import Image from 'next/image';
import { ScrollBar } from 'modules/enterprise/guide/scroll_bar';
import { ScreenSize } from 'pc/components/common/component_display/enum';
import { isSocialDingTalk, isSocialFeiShu, isSocialWecom, isWecomFunc } from 'pc/components/home/social_platform';
import { useResponsive } from 'pc/hooks';
import { store } from 'pc/store';
import * as React from 'react';
import { FC, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useSelector } from 'react-redux';
import HeadImage from 'static/icon/common/common_img_questionnaire.png';
import { QrCodeArea } from './components/qr-code-area';

declare global {
  interface Window {
    __vika_custom_config__: ICustomConfig;
  }
}
const CLASS_PREFIX = 'vika-guide-questionnaire';

interface IQuestionnaireConfig {
  key: number;
  name: string;
  title: string;
  type: string;
  answers?: string[];
  // For items in the selection category, whether user-defined content is finally allowed
  lastAllowInput?: boolean;
  submit?: boolean;
  next?: boolean;
  platform?: {
    website: string;
    dingtalk: string;
    wecom: string;
    feishu: string;
  };
}

export interface IQuestionnaireProps {
  config: IQuestionnaireConfig[];
  onSubmit?: (answers: { [key: number]: string }) => void;
  onNext?: () => void;
  mainImg?: string;
  backdrop?: boolean;
  children?: Element;
  onClose?: () => void;
}

const QuestionnaireContent: FC<IQuestionnaireProps> = props => {
  const { config, onSubmit, onNext } = props;
  const [curIndex, setCurIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const { screenIsAtLeast } = useResponsive();
  const checkboxValues = useRef<any[]>();

  const StepTitle = (data: { cur: number; all: number; title: string; type: string }): React.ReactElement => {
    return (
      <>
        {data.type !== 'contactUs' && (
          <div className={`${CLASS_PREFIX}-stepTitle`}>
            <span className={`${CLASS_PREFIX}-curStep`}>{`0${data.cur}`}</span>
            {`of 0${data.all}`}
          </div>
        )}
        <div className={`${CLASS_PREFIX}-questionTitle`}>{data.title}</div>
      </>
    );
  };

  useEffect(() => {
    const contentDom = document.querySelector(`.${CLASS_PREFIX}-content`) as Element;
    if (!contentDom) {
      return;
    }
    contentDom.parentElement!.parentElement!.scrollTop = 0;
  }, [curIndex]);

  // Go to the next step
  const enterNext = () => {
    setCurIndex(preIndex => {
      if (preIndex === 2 && isWecomFunc()) {
        return preIndex + 2;
      }
      return preIndex + 1;
    });
  };

  const onRadioChange = (config: IQuestionnaireConfig, e: any) => {
    const value = e.target.value;
    setAnswers({ ...answers, [config.key]: value });

    // Whether to move on to the next topic
    if (config.type === 'radio' && config.lastAllowInput && value === config.answers![config.answers!.length - 1]) {
      return;
    }
    setTimeout(() => {
      enterNext();
    }, 300);
  };

  const onCheckboxChange = (config: IQuestionnaireConfig, checkValue: any[]) => {
    setTimeout(() => {
      const value = checkValue.join(';');
      setAnswers({ ...answers, [config.key]: value });
    }, 0);
  };

  const changeCheckboxLastValue = (value: string, newValue: string) => {
    const arr = value.split(';');
    arr[arr.length - 1] = newValue;
    return arr.join(';');
  };

  const onInputChange = (config: IQuestionnaireConfig, e: any) => {
    setAnswers({ ...answers, [config.key]: e.target.value });
  };

  const submit = () => {
    const submitData = {};
    Object.keys(answers).forEach(value => {
      const targetConfig = config.find(item => item.key === Number(value));
      if (!targetConfig) {
        return;
      }
      submitData[targetConfig.name] = answers[value];
    });
    onSubmit && onSubmit(submitData); // There is logic in the onSubmit configuration to close it.
  };

  const removeRadioElseAnswer = (str: string) => {
    return str.split('-')[0];
  };
  const getRadioElseAnswer = (str: string) => {
    return str.split('-')[1];
  };
  const getItemInfo = (info: IQuestionnaireConfig) => {
    const { title, key, answers: answersConfig, lastAllowInput, type, submit: _submit } = info;
    const curValue = answers.hasOwnProperty(key) ? removeRadioElseAnswer(answers[key]) : undefined;
    const curElseInputValue = answers.hasOwnProperty(key) ? getRadioElseAnswer(answers[key]) : undefined;

    const space = useSelector((state: IReduxState) => state.space.curSpaceInfo);

    switch (type) {
      case 'radio': {
        return (
          <>
            <StepTitle cur={key} all={config.length - 1} title={title} type={type} />
            <Radio.Group onChange={e => onRadioChange(info, e)} value={curValue}>
              {answersConfig &&
                answersConfig.map((item, index) => {
                  const radioMarginTop = screenIsAtLeast(ScreenSize.md) ? '24px' : '8px';
                  const isElseSelected = Boolean(
                    lastAllowInput &&
                    index === answersConfig.length - 1 &&
                    answers.hasOwnProperty(key) &&
                    removeRadioElseAnswer(answers[key]) === item,
                  );
                  return (
                    <div key={item}>
                      <Radio value={item} style={{ marginBottom: index === answersConfig.length - 1 ? '0' : radioMarginTop }}>
                        {item}
                      </Radio>
                      {isElseSelected && (
                        <div className={`${CLASS_PREFIX}-inputWrap`}>
                          <Input
                            onChange={e => setAnswers({ ...answers, [key]: `${item}-${e.target.value}` })}
                            size='large'
                            autoFocus
                            style={{ marginTop: radioMarginTop }}
                            placeholder={t(Strings.placeholder_input)}
                            value={curElseInputValue}
                            onPressEnter={enterNext}
                          />
                          <Button color='primary' shape='round' className={`${CLASS_PREFIX}-nextBtn`} onClick={enterNext}>
                            {t(Strings.next_page)}
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
            </Radio.Group>
          </>
        );
      }
      case 'checkbox': {
        return (
          <>
            <StepTitle cur={key} all={config.length - 1} title={title} type={type} />
            <Checkbox.Group
              onChange={e => {
                checkboxValues.current = e;
              }}
            >
              {answersConfig &&
                answersConfig.map((item, index) => {
                  const checkboxMarginTop = screenIsAtLeast(ScreenSize.md) ? '24px' : '8px';
                  const isElseSelected = Boolean(
                    lastAllowInput && index === answersConfig.length - 1 && answers.hasOwnProperty(key) && answers[key].split(';').includes(item),
                  );
                  return (
                    <div key={item}>
                      <Checkbox value={item} style={{ marginBottom: index === answersConfig.length - 1 ? '0' : checkboxMarginTop }}>
                        {item}
                      </Checkbox>
                      {isElseSelected && (
                        <div className={`${CLASS_PREFIX}-inputWrap`}>
                          <Input
                            onBlur={e => setAnswers({ ...answers, [key]: changeCheckboxLastValue(answers[key], `${item}-${e.target.value}`) })}
                            size='large'
                            autoFocus
                            style={{ marginTop: checkboxMarginTop }}
                            placeholder={t(Strings.placeholder_input)}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
            </Checkbox.Group>
            <Button
              color='primary'
              shape='round'
              className={`${CLASS_PREFIX}-nextBtn`}
              onClick={e => {
                onCheckboxChange(info, checkboxValues.current || []);
                enterNext();
              }}
              block={true}
            >
              {t(Strings.next_page)}
            </Button>
          </>
        );
      }
      case 'input': {
        return (
          <>
            <StepTitle cur={key} all={config.length - 1} title={title} type={type} />
            <div className={`${CLASS_PREFIX}-inputWrap`}>
              <Input
                autoFocus
                size='large'
                value={curValue}
                onPressEnter={submit}
                onChange={e => onInputChange(info, e)}
                placeholder={t(Strings.placeholder_input)}
              />
              {_submit || (curIndex === 2 && isWecomFunc()) ? (
                <Button
                  color='primary'
                  shape='round'
                  className={`${CLASS_PREFIX}-nextBtn`}
                  onClick={() => {
                    submit();
                    enterNext();
                  }}
                >
                  {t(Strings.fill_in_completed)}
                </Button>
              ) : (
                <Button color='primary' shape='round' className={`${CLASS_PREFIX}-nextBtn`} onClick={enterNext}>
                  {t(Strings.next_page)}
                </Button>
              )}
            </div>
          </>
        );
      }
      case 'contactUs': {
        const isFeiShuSpace = isSocialFeiShu(space);
        const isWecomSpace = isSocialWecom(space);
        const isDingTalkSpace = isSocialDingTalk(space);

        const { website, dingtalk, wecom, feishu } = info.platform || {};
        let platformImg = website;
        if (isFeiShuSpace) platformImg = feishu;
        if (isWecomSpace) platformImg = wecom;
        if (isDingTalkSpace) platformImg = dingtalk;

        return (
          <>
            <StepTitle cur={key} all={config.length - 1} title={title} type={type} />
            <div className={`${CLASS_PREFIX}-contactUsWrap`}>
              <div className={`${CLASS_PREFIX}-contactUsDesc`}>{t(Strings.contact_us_qr_code_desc)}</div>
              <div className={`${CLASS_PREFIX}-qrCodeBoxWrap`}>
                {isFeiShuSpace ? <QrCodeArea url={feishu}></QrCodeArea> : <QrCodeArea img={platformImg}></QrCodeArea>}
              </div>
              <Button color='primary' shape='round' className={`${CLASS_PREFIX}-nextBtn`} onClick={onNext}>
                {t(Strings.player_contact_us_confirm_btn)}
              </Button>
            </div>
          </>
        );
      }
      default: {
        return <></>;
      }
    }
  };
  return <>{getItemInfo(config[curIndex])}</>;
};

const Questionnaire: FC<IQuestionnaireProps> = props => {
  const { config, mainImg, onSubmit, backdrop, onClose, onNext } = props;
  const img = mainImg ? integrateCdnHost(mainImg) : HeadImage;
  const { screenIsAtLeast } = useResponsive();
  return (
    <AntdModal
      visible
      className={classNames(`${CLASS_PREFIX}`, { ['vika-guide-modal-no-box-shadow']: backdrop })}
      width={screenIsAtLeast(ScreenSize.md) ? 480 : '80vw'}
      maskClosable={false}
      centered
      mask={backdrop}
      footer={null}
      getContainer={'.' + `${CLASS_PREFIX}`}
      onCancel={onClose}
      closable={false}
    >
      <ScrollBar>
        <div className={`${CLASS_PREFIX}-imgWrap`}>
          <span className={`${CLASS_PREFIX}-img`}>
            <Image src={img} alt='questionnaire' />
          </span>
        </div>
        <div className={`${CLASS_PREFIX}-content`}>
          <QuestionnaireContent config={config} onSubmit={onSubmit} onNext={onNext} />
        </div>
      </ScrollBar>
    </AntdModal>
  );
};

export const showQuestionnaire = (props: IQuestionnaireProps) => {
  const { children, ...rest } = props;

  const render = () => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.setAttribute('class', CLASS_PREFIX);
      document.body.appendChild(div);
      const root = createRoot(div);
      root.render(
        <Provider store={store}>
          <Questionnaire {...rest}>{children}</Questionnaire>
        </Provider>,
      );
    });
  };

  const run = () => {
    destroyQuestionnaire();
    render();
  };

  run();
};
export const destroyQuestionnaire = () => {
  const destroy = () => {
    const dom = document.querySelector('.' + `${CLASS_PREFIX}`);
    dom && document.body.removeChild(dom);
  };
  destroy();
};
