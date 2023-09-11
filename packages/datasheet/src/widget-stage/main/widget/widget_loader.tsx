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

import React, { useEffect } from 'react';
import { colors, LinkButton, Loading } from '@apitable/components';
import { Strings, t, WidgetPackageStatus } from '@apitable/core';
import { WarnCircleFilled, QuestionCircleOutlined } from '@apitable/icons';
import {
  ErrorBoundary,
  eventMessage,
  initWidgetCliSocket,
  MessageType,
  useCloudStorage,
  useMeta,
  WidgetCliSocketType,
  widgetMessage,
} from '@apitable/widget-sdk';
import { useWidgetComponent } from '@apitable/widget-sdk/dist/hooks/private/use_widget_loader';
import { WidgetLoadError } from '@apitable/widget-sdk/dist/initialize_widget';
import { getEnvVariables } from 'pc/utils/env';
import styles from './style.module.less';

interface IErrorWidget {
  title?: string;
  content: string | React.ReactNode;
  actionText?: string;
  action?: () => void;
}

const _ErrorBoundary: any = ErrorBoundary;

const ErrorWidget = ({ title = t(Strings.widget_load_error_title), content, actionText, action }: IErrorWidget) => (
  <div className={styles.errorWidgetWrap}>
    <div className={styles.title}>
      <WarnCircleFilled size={16} />
      <span>{title}</span>
    </div>
    <div className={styles.content}>{content}</div>
    {action && (
      <LinkButton className={styles.actionBtn} onClick={() => action()}>
        <span className={styles.linkText}>{actionText}</span>
      </LinkButton>
    )}
  </div>
);

export const WidgetLoader: React.FC<
  React.PropsWithChildren<{
    expandDevConfig: () => void;
    isDevMode: boolean;
  }>
> = (props) => {
  const { expandDevConfig, isDevMode } = props;
  const { id, datasheetId, widgetPackageId, releaseCodeBundle, status, widgetId, authorName, widgetPackageName } = useMeta();
  const [codeUrl] = useCloudStorage<string | undefined>(`widget_loader_code_url_${widgetPackageId}`);
  const loadUrl = isDevMode ? codeUrl : releaseCodeBundle;
  const [WidgetComponent, refresh, loading, error] = useWidgetComponent(loadUrl, widgetPackageId);

  useEffect(() => {
    widgetMessage?.onRefreshWidget(refresh);
    widgetId && eventMessage.onRefreshWidget(widgetId, refresh);
    return () => {
      widgetId && eventMessage.removeListenEvent(widgetId, MessageType.MAIN_REFRESH_WIDGET);
      widgetMessage?.removeListenEvent(MessageType.MAIN_REFRESH_WIDGET);
    };
  }, [refresh, widgetId]);

  useEffect(() => {
    if (!isDevMode) {
      return;
    }
    const url = new URL(loadUrl || 'https://127.0.0.1:9000');
    const widgetCliSOcket = initWidgetCliSocket(url.origin, WidgetCliSocketType.LiveReload);
    const reload = (res: any) => {
      console.log(res.success ? `The widget is hot updated: ${widgetId}` : 'Socket link disconnected');
      refresh();
    };
    widgetCliSOcket.on(WidgetCliSocketType.LiveReload, reload);
    return () => widgetCliSOcket.destroy();
  }, [isDevMode, loadUrl, refresh, widgetId]);
  // Unpublished status
  if (!isDevMode && status === WidgetPackageStatus.Developing) {
    return (
      <div className={styles.configInfo}>
        <div className={styles.title}>
          <span>{t(Strings.widget_loader_developing_title)}</span>
          <a href={getEnvVariables().WIDGET_RELEASE_HELP_URL} target="_blank" className={styles.helpIcon} rel="noreferrer">
            <QuestionCircleOutlined size={16} color={colors.textCommonTertiary} />
          </a>
        </div>
        <div className={styles.tips}>{t(Strings.widget_loader_developing_content)}</div>
        <LinkButton
          onClick={() => {
            widgetPackageId && widgetId && expandDevConfig();
          }}
        >
          <span className={styles.linkText}>{t(Strings.widget_continue_develop)}</span>
        </LinkButton>
      </div>
    );
  }
  // Developer mode error handling
  if (isDevMode && error) {
    switch (error) {
      case WidgetLoadError.PackageIdNotMatch:
        return <ErrorWidget content={t(Strings.widget_load_error_not_match)} />;
      case WidgetLoadError.LoadError:
        return <ErrorWidget content={t(Strings.widget_load_error_load_error)} />;
      case WidgetLoadError.CretInvalid:
        return (
          <ErrorWidget
            content={t(Strings.widget_loader_error_cret_invalid)}
            actionText={t(Strings.widget_loader_error_cret_invalid_action_text)}
            action={() => window.open(getEnvVariables().WIDGET_HOW_TO_CLOSE_BROWSER_RESTRICTION_HELP_URL)}
          />
        );
      default:
        return <ErrorWidget content={t(Strings.widget_load_error)} />;
    }
  }
  if (status === WidgetPackageStatus.Ban) {
    return (
      <div className={styles.configInfo}>
        <div className={styles.title}>
          <span>{t(Strings.widget_load_error_ban_title)}</span>
        </div>
        <div className={styles.tips}>{t(Strings.widget_load_error_ban_content)}</div>
        <LinkButton>
          <span className={styles.linkText}>{t(Strings.widget_load_error_ban_btn)}</span>
        </LinkButton>
      </div>
    );
  }
  if (error && (status === WidgetPackageStatus.Published || status === WidgetPackageStatus.Unpublished)) {
    return (
      <ErrorWidget
        content={
          <div>
            <p>widgetPackageName: {widgetPackageName}</p>
            <p>widgetPackageId: {widgetPackageId}</p>
            <p>{t(Strings.widget_load_error_published, { authorName })}</p>
          </div>
        }
      />
    );
  }

  if (!WidgetComponent || loading) {
    return (
      <div className={styles.configInfo}>
        <Loading />
      </div>
    );
  }

  return (
    <>
      <_ErrorBoundary id={id} datasheetId={datasheetId} logError={!isDevMode}>
        <WidgetComponent />
      </_ErrorBoundary>
    </>
  );
};
