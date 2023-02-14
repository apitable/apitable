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

import * as components from '@apitable/components';
import { LinkButton, Loading, useThemeColors } from '@apitable/components';
import * as core from '@apitable/core';
import { Strings, t, WidgetPackageStatus } from '@apitable/core';
import * as icons from '@apitable/icons';
import { ErrorFilled, InformationSmallOutlined } from '@apitable/icons';
import * as widgetSdk from '@apitable/widget-sdk';
import { ErrorBoundary, initWidgetCliSocket, useCloudStorage, useMeta, WidgetCliSocketType } from '@apitable/widget-sdk';
import { useWidgetComponent } from '@apitable/widget-sdk/dist/hooks/private/use_widget_loader';
import { WidgetLoadError } from '@apitable/widget-sdk/dist/initialize_widget';
import { getEnvVariables } from 'pc/utils/env';
import * as React from 'react';
import { useEffect, useImperativeHandle } from 'react';
import ReactDom from 'react-dom';
import { expandWidgetDevConfig } from '../widget_center/widget_create_modal';
import styles from './styles.module.less';

const _ErrorBoundary: any = ErrorBoundary;

(()=>{
  if(!process.env.SSR){
    const prefix = getEnvVariables().WIDGET_REPO_PREFIX;
    // Register the widget dependency package to window in order for the widget to load properly.
    window['_React'] = React;
    window['_ReactDom'] = ReactDom;
    window[`_@${prefix}/components`] = components;
    window[`_@${prefix}/widget-sdk`] = widgetSdk;
    window[`_@${prefix}/core`] = core;
    window[`_@${prefix}/icons`] = icons;
  }
})();

export interface IWidgetLoaderRefs {
  refresh: () => void;
  setCodeUrl?: React.Dispatch<React.SetStateAction<string | undefined>>;
  codeUrl?: string
}

interface IErrorWidget {
  title?: string;
  content: string | React.ReactNode;
  actionText?: string;
  action?: () => void;
}

export const ErrorWidget = ({ title = t(Strings.widget_load_error_title), content, actionText, action }: IErrorWidget) => (
  <div className={styles.errorWidgetWrap}>
    <div className={styles.title}>
      <ErrorFilled size={16} />
      <span>{title}</span>
    </div>
    <div className={styles.content}>{content}</div>
    {action && <LinkButton className={styles.actionBtn} onClick={() => action()}>
      <span className={styles.linkText}>{actionText}</span>
    </LinkButton>}
  </div>
);

const WidgetLoaderBase: React.ForwardRefRenderFunction<
  IWidgetLoaderRefs, {isDevMode?: boolean, setDevWidgetId?: (widgetId: string) => void}
  > = (props, ref) => {
    const colors = useThemeColors();
    const { isDevMode } = props;
    const { id, datasheetId, widgetPackageId, releaseCodeBundle, status, widgetId, authorName, widgetPackageName } = useMeta();
    const [codeUrl, setCodeUrl] = useCloudStorage<string | undefined>(`widget_loader_code_url_${widgetPackageId}`);
    const loadUrl = isDevMode ? codeUrl : releaseCodeBundle;
    const [WidgetComponent, refresh, loading, error] = useWidgetComponent(loadUrl, widgetPackageId);
    useImperativeHandle(ref, () => ({
      refresh,
      setCodeUrl,
      codeUrl
    }));
    useEffect(() => {
      if (!isDevMode) {
        return;
      }
      const url = new URL(loadUrl || 'https://127.0.0.1:9000');
      const widgetCliSOcket = initWidgetCliSocket(url.origin, WidgetCliSocketType.LiveReload);
      const reload = (res: any) => {
        console.log(res.success ? `Widget hot updates: ${widgetId}` : 'Widget disconnection');
        refresh();
      };
      widgetCliSOcket.on(WidgetCliSocketType.LiveReload, reload);
      return () => widgetCliSOcket.destroy();
    }, [isDevMode, loadUrl, refresh, widgetId]);
    // Unpublished status.
    if (!isDevMode && status === WidgetPackageStatus.Developing) {
      return (
        <div className={styles.configInfo}>
          <div className={styles.title}>
            <span>{t(Strings.widget_loader_developing_title)}</span>
            <a href={getEnvVariables().WIDGET_RELEASE_HELP_URL} target="_blank" className={styles.helpIcon} rel="noreferrer">
              <InformationSmallOutlined size={16} color={colors.fourthLevelText} />
            </a>
          </div>
          <div className={styles.tips}>{t(Strings.widget_loader_developing_content)}</div>
          <LinkButton onClick={() => {
            widgetPackageId && widgetId && expandWidgetDevConfig({ codeUrl, widgetPackageId, widgetId, onConfirm: (devUrl) => {
              setCodeUrl?.(devUrl);
            } });
          }}><span className={styles.linkText}>{t(Strings.widget_continue_develop)}</span></LinkButton>
        </div>
      );
    }
    // Developer mode error handling.
    if (isDevMode && error) {
      switch (error) {
        case WidgetLoadError.PackageIdNotMatch: return (
          <ErrorWidget content={t(Strings.widget_load_error_not_match)} />
        );
        case WidgetLoadError.LoadError: return (
          <ErrorWidget content={t(Strings.widget_load_error_load_error)} />
        );
        case WidgetLoadError.CretInvalid: return (
          <ErrorWidget
            content={t(Strings.widget_loader_error_cret_invalid)}
            actionText={t(Strings.widget_loader_error_cret_invalid_action_text)}
            action={() => window.open(getEnvVariables().WIDGET_HOW_TO_CLOSE_BROWSER_RESTRICTION_HELP_URL)}
          />
        );
        default: return <ErrorWidget content={t(Strings.widget_load_error)} />;
      }
    }
    if (status === WidgetPackageStatus.Ban) {
      return (
        <div className={styles.configInfo}>
          <div className={styles.title}>
            <span>{t(Strings.widget_load_error_ban_title)}</span>
          </div>
          <div className={styles.tips}>{t(Strings.widget_load_error_ban_content)}</div>
          <LinkButton><span className={styles.linkText}>{t(Strings.widget_load_error_ban_btn)}</span></LinkButton>
        </div>
      );
    }
    if (error && (status === WidgetPackageStatus.Published || status === WidgetPackageStatus.Unpublished)) {
      return <ErrorWidget content={<div>
        <p>widgetPackageName: {widgetPackageName}</p>
        <p>widgetPackageId: {widgetPackageId}</p>
        <p>{t(Strings.widget_load_error_published, { authorName })}</p>
      </div>} />;
    }

    if (!WidgetComponent || loading) {
      return <div className={styles.configInfo}><Loading /></div>;
    }
    return <>
      <_ErrorBoundary id={id} datasheetId={datasheetId} logError={!isDevMode}>
        <WidgetComponent />
      </_ErrorBoundary>
    </>;
  };

export const WidgetLoader = React.forwardRef(WidgetLoaderBase);
