/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { useMount } from 'ahooks';
import { createWidget } from 'api/widget/api';
import classNames from 'classnames';
import filenamify from 'filenamify';
import parser from 'html-react-parser';
import { trim } from 'lodash';
import { TriggerCommands } from 'modules/shared/apphook/trigger_commands';
import { EmitterEventName } from 'modules/shared/simple_emitter';
import Image from 'next/image';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Button, colorVars, IconButton, LinkButton, TextInput, ThemeProvider, Typography, useThemeColors } from '@apitable/components';
import {
  CollaCommandName,
  ConfigConstant,
  ExecuteResult,
  integrateCdnHost,
  ResourceType,
  Selectors,
  StoreActions,
  Strings,
  t,
  WidgetApi,
  WidgetApiInterface,
} from '@apitable/core';
import { CopyOutlined, WarnCircleFilled, BulbOutlined, QuestionCircleOutlined } from '@apitable/icons';
import { loadWidgetCheck, WidgetLoadError } from '@apitable/widget-sdk/dist/initialize_widget';
import { Loading } from 'pc/components/common/loading';
import { Message } from 'pc/components/common/message';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { ModalOutsideOperate } from 'pc/components/common/modal_outside_operate';
import { TComponent } from 'pc/components/common/t_component';
// eslint-disable-next-line no-restricted-imports
import { Tooltip as CommonTooltip } from 'pc/components/common/tooltip';
import { InstallPosition } from 'pc/components/widget/widget_center/enum';
import { installToDashboard, installToPanel, installWidget } from 'pc/components/widget/widget_center/install_utils';
import { useRequest } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { copy2clipBoard, getUrlWithHost } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import { dispatch } from 'pc/worker/store';
import { simpleEmitter } from '../..';
import { installedWidgetHandle } from '../../widget_panel/widget_panel_header';
import { Steps } from './steps';
// @ts-ignore
import { clearWizardsData } from 'enterprise/guide/utils';
import styles from './styles.module.less';

const WIDGET_CMD = {
  publish: 'widget-cli release',
  start: 'widget-cli start',
};

interface IExpandWidgetCreate {
  installPosition: InstallPosition;
  closeModal?: (widgetId?: string) => void;
}

export const expandWidgetCreate = (props: IExpandWidgetCreate) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const { closeModal, installPosition } = props;
  const root = createRoot(container);
  const onModalClose = (closeWidgetCenter?: boolean) => {
    root.unmount();
    container.parentElement!.removeChild(container);
    closeWidgetCenter && closeModal?.();
  };

  root.render(
    <Provider store={store}>
      <ThemeProvider>
        <WidgetCreateModal closeModal={onModalClose} installPosition={installPosition} />
      </ThemeProvider>
    </Provider>,
  );
};

interface IWidgetCreateModalProps {
  installPosition: InstallPosition;
  closeModal?: (closeWidgetCenter?: boolean) => void;
}

const WidgetCreateModal: React.FC<React.PropsWithChildren<IWidgetCreateModalProps>> = (props) => {
  const colors = useThemeColors();
  const { closeModal, installPosition } = props;
  const [widgetName, setWidgetName] = useState<string>();
  const [inputWidgetName, setInputWidgetName] = useState<string>();
  const spaceId = useAppSelector((state) => state.space.activeId);
  const [widgetCreating, setWidgetCreating] = useState(false);
  const { dashboardId, datasheetId, mirrorId } = useAppSelector((state) => state.pageParams);
  const { data: templateData, loading: templateDataLoading } = useRequest(WidgetApi.getTemplateList);
  const [templateWidgetList, setTemplateWidgetList] = useState<WidgetApiInterface.IWidgetTemplateItem[]>([]);
  const [selectTemplate, setSelectTemplate] = useState<WidgetApiInterface.IWidgetTemplateItem>();
  const inputName = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTemplateWidgetList(templateData?.data?.data ?? []);
  }, [templateData]);

  useMount(() => {
    inputName.current?.focus();
  });

  const _createWidget = async () => {
    if (!widgetName) {
      return;
    }
    setWidgetCreating(true);
    const res = await createWidget(
      JSON.stringify({
        'en-US': widgetName,
        'zh-CN': widgetName,
      }),
      spaceId!,
    );
    const { data } = res.data;
    toInstallWidget(data.packageId);
  };

  const toInstallWidget = async (widgetPackageId: string) => {
    const nodeId = installPosition === InstallPosition.WidgetPanel ? (mirrorId || datasheetId)! : dashboardId!;
    const widget = await installWidget(widgetPackageId, nodeId, widgetName);
    Message.success({
      content: t(Strings.create_widget_success),
    });
    installPosition === InstallPosition.WidgetPanel
      ? await installToPanel(widget, nodeId, mirrorId ? ResourceType.Mirror : ResourceType.Datasheet)
      : await installToDashboard(widget, nodeId);
    setWidgetCreating(false);
    dispatch(StoreActions.receiveInstallationWidget(widget.id, widget));
    expandWidgetCreateSteps({
      widgetId: widget.id,
      widgetName: widgetName!,
      widgetPackageId,
      sourceCodeBundle: selectTemplate!.sourceCodeBundle,
    });
    closeModal?.(true);
    installedWidgetHandle(widget.id, false);
  };

  const Title = () => (
    <div className={styles.modalHeader}>
      <Typography variant={'h6'} component={'div'}>
        {t(Strings.create_widget)}
      </Typography>
      <CommonTooltip title={t(Strings.create_widget_step_tooltip)} placement="top">
        <a href={getEnvVariables().WIDGET_CREATE_WIDGET_HELP_URL} target="_blank" className={styles.helpIcon} rel="noreferrer">
          <QuestionCircleOutlined color={colors.fc3} />
        </a>
      </CommonTooltip>
    </div>
  );
  const isValid = widgetName && selectTemplate;
  return (
    <Modal title={<Title />} visible centered width={528} onCancel={() => closeModal?.()} className={styles.widgetCenterWrap} footer={null}>
      <div className={styles.createContainer}>
        <div className={styles.itemLabel}>
          <span>{t(Strings.widget_center_create_modal_widget_name)}</span>
        </div>
        <TextInput
          ref={inputName}
          placeholder={t(Strings.widget_center_create_modal_widget_name_placeholder)}
          value={inputWidgetName}
          onChange={(e) => {
            const value = e.target.value;
            setInputWidgetName(value);
            /**
             * Remove leading and trailing spaces, replace middle spaces with '-'.
             * filenamify: On Unix-like systems, / is reserved. On Windows, <>:"/\|?* along with trailing periods are reserved.
             */
            setWidgetName(value ? filenamify(trim(value).replace(/\s/g, '-'), { replacement: '-' }) : '');
          }}
          block
        />
        <div className={styles.itemLabel} style={{ marginTop: 24 }}>
          <span>{t(Strings.widget_center_create_modal_widget_template)}</span>
        </div>
        <div className={styles.templateList}>
          {templateWidgetList.map((item) => (
            <div
              className={classNames(styles.templateItem, selectTemplate?.widgetPackageId === item.widgetPackageId && styles.templateItemSelected)}
              key={item.widgetPackageId}
              onClick={() => setSelectTemplate(item)}
            >
              <div className={styles.checkbox} />
              <div className={styles.templateCover}>
                <Image src={getUrlWithHost(item.extras?.templateCover)} alt={''} width={40} height={40} />
              </div>
              <div className={styles.templateInfo}>
                <div className={styles.templateName}>{item.name}</div>
                <div className={styles.templateDesc}>{item.description}</div>
              </div>
              <div style={{ height: 40 }}>
                {selectTemplate?.widgetPackageId === item.widgetPackageId && selectTemplate && (
                  <LinkButton
                    className={styles.lookSourceCodeBtn}
                    href={selectTemplate.extras?.widgetOpenSource}
                    color={colors.thirdLevelText}
                    target="_blank"
                  >
                    {t(Strings.widget_center_create_modal_widget_template_link)}
                  </LinkButton>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.buttonWrap}>
          <Button color="primary" loading={widgetCreating} block disabled={!isValid} onClick={_createWidget}>
            {t(Strings.create_widget)}
          </Button>
        </div>
        {templateDataLoading && <Loading style={{ backgroundColor: colors.defaultBg }} />}
      </div>
    </Modal>
  );
};

interface IExpandWidgetCreateStepsProps {
  widgetId: string;
  widgetName: string;
  widgetPackageId: string;
  sourceCodeBundle?: string;
  devCodeUrl?: string;
  closeModal?: (widgetId?: string) => void;
}

export const expandWidgetCreateSteps = (props: IExpandWidgetCreateStepsProps) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  const onModalClose = (widgetId?: string) => {
    root.unmount();
    container.parentElement!.removeChild(container);
    widgetId && installedWidgetHandle(widgetId);
    props.sourceCodeBundle &&
      widgetId &&
      setTimeout(() => {
        TriggerCommands.open_guide_wizard?.(ConfigConstant.WizardIdConstant.CREATE_WIDGET_GUIDE);
      }, 0);
  };

  root.render(
    <Provider store={store}>
      <ThemeProvider>
        <WidgetCreateModalStep {...props} closeModal={onModalClose} />
      </ThemeProvider>
    </Provider>,
  );
};

const WidgetCretInvalidError = () => (
  <div className={styles.widgetCretInvalidError}>
    <div className={styles.title}>
      <WarnCircleFilled size={20} />
      <span>{t(Strings.widget_cret_invalid_error_title)}</span>
    </div>
    <div className={styles.content}>{parser(t(Strings.widget_cret_invalid_error_content))}</div>
  </div>
);

export const addCurrentDomainIfNeeded = (url: string) => {
  const currentDomain = window.location.origin;
  const parsedUrl = new URL(url, currentDomain);
  return parsedUrl.toString();
};

const WidgetCreateModalStep: React.FC<React.PropsWithChildren<IExpandWidgetCreateStepsProps>> = (props) => {
  const colors = useThemeColors();
  const { closeModal, widgetId, sourceCodeBundle, widgetName, widgetPackageId, devCodeUrl = '' } = props;
  const [current, setCurrent] = useState(0);
  const [devUrl, setDevUrl] = useState<string>(devCodeUrl);
  const userInfo = useAppSelector((state) => state.user.info);
  const [urlError, setUrlError] = useState<string>();
  const [isCretInvalid, setIsCretInvalid] = useState<boolean>();
  const defaultTemplateUrl = integrateCdnHost(getEnvVariables().WIDGET_DEFAULT_TEMPLATE_URL!);
  const [isCopiedIndex, setIsCopiedIndex] = useState<number | null>(null);
  const { run: getWidgetTemplate } = useRequest(WidgetApi.getTemplateList, { manual: true });
  const [sourceCodeUrl, setSourceCodeUrl] = useState<string | undefined>();

  useEffect(() => {
    if (sourceCodeBundle) {
      setSourceCodeUrl(sourceCodeBundle);
    } else {
      !sourceCodeUrl &&
        getWidgetTemplate().then(({ data }) => {
          setSourceCodeUrl(data?.data?.[0]?.sourceCodeBundle);
        });
    }
  }, [getWidgetTemplate, sourceCodeBundle, sourceCodeUrl]);

  const widgetCliCmd = (config: {
    apiToken?: string;
    spaceId?: string;
    env: string;
    widgetName: string;
    widgetPackageId: string;
    templateUrl?: string;
  }) => {
    const { apiToken, spaceId, env, widgetName, widgetPackageId, templateUrl = defaultTemplateUrl } = config;
    // eslint-disable-next-line max-len
    return `widget-cli init ${apiToken && `-t ${apiToken} `}${
      spaceId && `-s ${spaceId}`
    } -h ${env} -c ${widgetName} -p ${widgetPackageId} -u ${templateUrl}`;
  };

  useEffect(() => {
    const input = document.getElementById('WIDGET_CREATE_STEP_INPUT');
    input?.focus();
  }, [current]);

  const config: any = [
    {
      title: t(Strings.widget_step_install_title),
      desc: t(Strings.widget_step_install_desc),
      content: [
        { label: t(Strings.widget_step_install_content_label1), type: 'info' },
        {
          label: t(Strings.widget_step_install_content_label2),
          type: 'info',
          value: 'npm install -g @apitable/widget-cli',
        },
      ],
      helpLink: getEnvVariables().WIDGET_DEVELOP_INSTALL_HELP_URL,
    },
    {
      title: t(Strings.widget_step_init_title),
      desc: t(Strings.widget_step_init_desc),
      content: [
        {
          label: t(Strings.widget_step_init_content_label),
          type: 'info',
          value: widgetCliCmd({
            apiToken: userInfo?.apiKey,
            spaceId: userInfo?.spaceId,
            env: window.location.origin,
            widgetName,
            widgetPackageId,
            templateUrl: sourceCodeUrl ? addCurrentDomainIfNeeded(sourceCodeUrl) : sourceCodeUrl,
          }),
          desc: !userInfo?.apiKey && !userInfo?.spaceId && parser(t(Strings.widget_step_init_content_desc)),
        },
      ],
      helpLink: getEnvVariables().WIDGET_DEVELOP_INIT_HELP_URL,
    },
    {
      title: t(Strings.widget_step_start_title),
      desc: t(Strings.widget_step_start_desc),
      content: [
        { label: t(Strings.widget_step_start_content_label1), value: `cd ${widgetName}`, type: 'info' },
        {
          label: t(Strings.widget_step_start_content_label2),
          type: 'info',
          value: WIDGET_CMD.start,
          desc: t(Strings.widget_step_start_content_desc2),
        },
      ],
      helpLink: getEnvVariables().WIDGET_DEVELOP_START_HELP_URL,
    },
    {
      title: t(Strings.widget_step_dev_title),
      desc: t(Strings.widget_step_dev_desc),
      content: [
        {
          label: t(Strings.widget_step_dev_content_label),
          placeholder: t(Strings.widget_dev_url_input_placeholder),
          type: 'input',
          value: devUrl,
        },
      ],
      helpLink: getEnvVariables().WIDGET_DEVELOP_PREVIEW_HELP_URL,
    },
  ];
  const steps = [
    { title: t(Strings.widget_step_install) },
    { title: t(Strings.widget_step_init) },
    { title: t(Strings.widget_step_start) },
    { title: t(Strings.widget_step_dev) },
  ];

  const startDev = () => {
    if (!devUrl) {
      return;
    }
    loadWidgetCheck(devUrl, widgetPackageId)
      .then(() => {
        const result = resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.SetGlobalStorage,
          key: `widget_loader_code_url_${widgetPackageId}`,
          value: devUrl,
          resourceType: ResourceType.Widget,
          resourceId: widgetId,
        });
        if (result.result === ExecuteResult.Success) {
          closeModal?.(widgetId);
          clearWizardsData?.();
          simpleEmitter.emit(EmitterEventName.ToggleWidgetDevMode, widgetId);
        }
      })
      .catch((error) => {
        switch (error) {
          case WidgetLoadError.CretInvalid:
            {
              setIsCretInvalid(true);
            }
            break;
          case WidgetLoadError.PackageIdNotMatch:
            setUrlError(t(Strings.widget_load_url_error_not_match, { widgetPackageId }));
            break;
          case WidgetLoadError.CliLowVersion:
            setUrlError(t(Strings.widget_cli_upgrade_tip));
            break;
          default:
            setUrlError(t(Strings.widget_connect_error));
        }
      });
  };

  const copyLinkHandler = (text: string, index: number) => {
    if (isCopiedIndex !== null) {
      return;
    }
    setIsCopiedIndex(index);
    setTimeout(() => setIsCopiedIndex(null), 1000);
    copy2clipBoard(text);
  };

  const resetError = useCallback(() => {
    setUrlError('');
    setIsCretInvalid(false);
  }, []);

  useEffect(() => {
    resetError();
  }, [resetError, current]);

  return (
    <ModalOutsideOperate
      modalWidth={528}
      onModalClose={() => {
        closeModal?.();
        installedWidgetHandle(widgetId, Boolean(sourceCodeBundle));
      }}
      modalClassName={styles.widgetCreateModalStep}
    >
      <Steps
        steps={steps}
        current={current}
        onChange={(current) => {
          setCurrent(current);
        }}
      />
      <div className={styles.stepContentWrap}>
        {config?.[current] && (
          <div className={styles.stepContent}>
            <Typography variant={'h6'} component={'div'} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', marginRight: 4 }}>
              <span className={styles.stepContentTitleMain}>{config?.[current].title}</span>
              <CommonTooltip title={t(Strings.create_widget_step_tooltip)} placement="top">
                <a href={config?.[current].helpLink} target="_blank" className={styles.helpIcon} rel="noreferrer">
                  <QuestionCircleOutlined size={16} color={colors.thirdLevelText} />
                </a>
              </CommonTooltip>
            </Typography>
            <div className={styles.stepContentDesc}>{config?.[current].desc}</div>
            {config?.[current].content.map((contentItem: any, index: number) => (
              <div className={classNames(styles.contentItem, contentItem.value ?? styles.contentItemNoMargin)} key={index}>
                <div className={styles.contentItemLabel}>{contentItem.label}</div>
                {((contentItem.type === 'info' && contentItem.value) || contentItem.type === 'input') && (
                  <div className={styles.contentItemValue}>
                    {contentItem.type === 'info' ? (
                      <TextInput
                        className={classNames(styles.contentItemValueInput, { [styles.highBorder]: isCopiedIndex === index })}
                        value={contentItem?.value}
                        disabled
                      />
                    ) : (
                      <TextInput
                        id={'WIDGET_CREATE_STEP_INPUT'}
                        className={styles.contentItemValueInput}
                        placeholder={contentItem?.placeholder}
                        value={devUrl}
                        onChange={(e) => {
                          resetError();
                          setDevUrl(e.target.value);
                        }}
                        error={Boolean(urlError)}
                      />
                    )}
                    {contentItem?.type === 'info' && (
                      <CommonTooltip title={t(Strings.copy_link)} placement="top">
                        <IconButton
                          className={styles.copyBtn}
                          onClick={() => contentItem.value && copyLinkHandler(contentItem.value, index)}
                          shape="square"
                          variant="background"
                          size="large"
                          icon={() => <CopyOutlined size={16} color={colors.secondLevelText} />}
                        />
                      </CommonTooltip>
                    )}
                  </div>
                )}
                {!isCretInvalid && urlError && <div className={styles.errorText}>{urlError}</div>}
                {isCretInvalid && <WidgetCretInvalidError />}
                {contentItem.desc && <div className={styles.contentItemDesc}>{contentItem.desc}</div>}
              </div>
            ))}
            <div className={styles.contentFooter}>
              {current < steps.length - 1 && (
                <Button color="primary" onClick={() => setCurrent(current + 1)}>
                  {t(Strings.next_step)}
                </Button>
              )}
              {current === steps.length - 1 && (
                <Button color="primary" disabled={!devUrl} onClick={startDev}>
                  {t(Strings.widget_start_dev)}
                </Button>
              )}
              {current > 0 && (
                <LinkButton underline={false} color={colors.thirdLevelText} onClick={() => setCurrent(current - 1)}>
                  {t(Strings.last_step)}
                </LinkButton>
              )}
            </div>
          </div>
        )}
      </div>
    </ModalOutsideOperate>
  );
};

export interface IExpandWidgetDevConfigProps {
  widgetPackageId: string;
  widgetId: string;
  codeUrl?: string;
  onConfirm?: (devUrl: string) => void;
  onClose?: () => void;
}

export const expandWidgetDevConfig = (props: IExpandWidgetDevConfigProps) => {
  const { onClose } = props;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  const onModalClose = () => {
    root.unmount();
    container.parentElement!.removeChild(container);
    onClose && onClose();
  };

  root.render(
    <Provider store={store}>
      <ThemeProvider>
        <WidgetDevConfigModal {...props} onClose={onModalClose} />
      </ThemeProvider>
    </Provider>,
  );
};

const WidgetDevConfigModal: React.FC<React.PropsWithChildren<IExpandWidgetDevConfigProps>> = (props) => {
  const colors = useThemeColors();
  const { codeUrl, onClose, onConfirm, widgetPackageId, widgetId } = props;
  const [devUrl, setDevUrl] = useState<string | undefined>(codeUrl);
  const [error, setError] = useState<string>();
  const widget = useAppSelector((state) => Selectors.getWidget(state, widgetId))!;
  const [isCretInvalid, setIsCretInvalid] = useState<boolean>();

  const startDev = () => {
    if (!devUrl) {
      return;
    }
    loadWidgetCheck(devUrl, widgetPackageId)
      .then(() => {
        simpleEmitter.emit(EmitterEventName.ToggleWidgetDevMode, widgetId);
        onConfirm && onConfirm(devUrl);
        onClose && onClose();
        widgetId && installedWidgetHandle(widgetId);
      })
      .catch((error) => {
        switch (error) {
          case WidgetLoadError.CretInvalid:
            {
              setIsCretInvalid(true);
            }
            break;
          case WidgetLoadError.PackageIdNotMatch:
            setError(t(Strings.widget_load_url_error_not_match, { widgetPackageId }));
            break;
          case WidgetLoadError.CliLowVersion:
            setError(t(Strings.widget_cli_upgrade_tip));
            break;
          default:
            setError(t(Strings.widget_connect_error));
        }
      });
  };

  return (
    <ModalOutsideOperate
      modalWidth={528}
      onModalClose={() => onClose?.()}
      modalClassName={classNames(styles.widgetDevConfigModal, styles.modalBodyAutoHeight)}
    >
      <div className={classNames(styles.widgetDevConfigModalWrap, styles.stepContentWrap)}>
        <Typography variant={'h6'} component={'div'} style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
          <span className={styles.stepContentTitleMain}>{t(Strings.preview_widget)}</span>
          <CommonTooltip title={t(Strings.create_widget_step_tooltip)} placement="top">
            <a href={getEnvVariables().WIDGET_DEVELOP_PREVIEW_HELP_URL} target="_blank" className={styles.helpIcon} rel="noreferrer">
              <QuestionCircleOutlined size={16} color={colors.thirdLevelText} />
            </a>
          </CommonTooltip>
        </Typography>
        <div className={styles.stepContentDesc}>
          <TComponent
            tkey={t(Strings.widget_dev_config_content)}
            params={{
              startCmd: <span>{WIDGET_CMD.start}</span>,
            }}
          />
        </div>
        <div className={styles.contentItem}>
          <div className={styles.contentItemLabel}>{t(Strings.widget_dev_url)}</div>
          <div className={styles.contentItemValue}>
            <TextInput
              error={Boolean(error)}
              className={styles.contentItemValueInput}
              placeholder={t(Strings.widget_dev_url_input_placeholder)}
              value={devUrl}
              autoFocus
              onChange={(e) => {
                setError(undefined);
                setIsCretInvalid(false);
                setDevUrl(e.target.value);
              }}
            />
          </div>
          {!isCretInvalid && error && <div className={styles.errorText}>{error}</div>}
          {isCretInvalid && <WidgetCretInvalidError />}
        </div>
        <div className={classNames(styles.contentFooter, styles.configContentFooter)}>
          <Button color="primary" onClick={startDev} disabled={!devUrl}>
            {t(Strings.widget_start_dev)}
          </Button>
          <LinkButton
            underline={false}
            color={colors.thirdLevelText}
            prefixIcon={<BulbOutlined color={colors.thirdLevelText} />}
            onClick={() => {
              expandWidgetCreateSteps({
                widgetId: widget.id,
                widgetName: widget.widgetPackageName,
                widgetPackageId,
                devCodeUrl: devUrl,
              });
              onClose && onClose();
            }}
          >
            {t(Strings.widget_developer_novice_guide)}
          </LinkButton>
        </div>
      </div>
    </ModalOutsideOperate>
  );
};

export const expandPublishHelp = (props?: { onClose?(): void }) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  const onModalClose = () => {
    root.unmount();
    container.parentElement!.removeChild(container);
    props?.onClose?.();
    TriggerCommands.open_guide_wizard?.(ConfigConstant.WizardIdConstant.CREATE_WIDGET_GUIDE);
  };

  root.render(
    <ThemeProvider>
      <ModalOutsideOperate modalWidth={528} onModalClose={onModalClose} modalClassName={classNames(styles.widgetCreateModalStep)}>
        <div className={classNames(styles.widgetDevConfigModalWrap, styles.stepContentWrap)}>
          <Typography variant={'h6'} component={'div'} style={{ marginBottom: 24, display: 'flex', alignItems: 'center' }}>
            <span className={styles.stepContentTitleMain}>{t(Strings.widget_operate_publish_help)}</span>
            <CommonTooltip title={t(Strings.create_widget_step_tooltip)} placement="top">
              <a href={getEnvVariables().WIDGET_RELEASE_HELP_URL} target="_blank" className={styles.helpIcon} rel="noreferrer">
                <QuestionCircleOutlined size={16} color={colorVars.thirdLevelText} />
              </a>
            </CommonTooltip>
          </Typography>
          <div className={classNames(styles.contentItem, styles.contentItemNoMargin)}>
            <TComponent
              tkey={t(Strings.widget_publish_help_step1)}
              params={{
                cmd: (
                  <div className={styles.cmdBox}>
                    <div>Ctrl</div>
                    <div>C</div>
                  </div>
                ),
              }}
            />
          </div>
          <div className={styles.contentItem}>
            <div className={styles.contentItemLabel}>{t(Strings.widget_publish_help_step2)}</div>
            <div className={styles.contentItemValue}>
              <TextInput className={styles.contentItemValueInput} value={WIDGET_CMD.publish} disabled />
              <CommonTooltip title={t(Strings.copy_link)} placement="top">
                <IconButton
                  className={styles.copyBtn}
                  onClick={() => copy2clipBoard(WIDGET_CMD.publish)}
                  shape="square"
                  variant="background"
                  size="large"
                  icon={() => <CopyOutlined size={16} color={colorVars.secondLevelText} />}
                />
              </CommonTooltip>
            </div>
            <div className={styles.contentItemDesc}>{t(Strings.widget_publish_help_desc)}</div>
          </div>
          <div className={classNames(styles.contentFooter, styles.configContentFooter)}>
            <Button color="primary" onClick={onModalClose}>
              {t(Strings.confirm)}
            </Button>
          </div>
        </div>
      </ModalOutsideOperate>
    </ThemeProvider>,
  );
};
