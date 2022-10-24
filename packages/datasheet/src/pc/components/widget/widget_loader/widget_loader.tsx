import * as components from '@vikadata/components';
import { LinkButton, Loading, useThemeColors } from '@vikadata/components';
import * as core from '@apitable/core';
import { Settings, Strings, t, WidgetPackageStatus } from '@apitable/core';
import * as icons from '@vikadata/icons';
import { ErrorFilled, InformationSmallOutlined } from '@vikadata/icons';
import * as widgetSdk from '@vikadata/widget-sdk';
import { ErrorBoundary, initWidgetCliSocket, useCloudStorage, useMeta, WidgetCliSocketType } from '@vikadata/widget-sdk';
import { useWidgetComponent } from '@vikadata/widget-sdk/dist/hooks/private/use_widget_loader';
import { WidgetLoadError } from '@vikadata/widget-sdk/dist/initialize_widget';
import * as React from 'react';
import { useEffect, useImperativeHandle } from 'react';
import ReactDom from 'react-dom';
import { expandWidgetDevConfig } from '../widget_center/widget_create_modal';
import styles from './styles.module.less';

(()=>{
  if(!process.env.SSR){
    // 注册小组件依赖包到 window，小组件才能正常加载
    window['_React'] = React;
    window['_ReactDom'] = ReactDom;
    window['_@vikadata/components'] = components;
    window['_@vikadata/widget-sdk'] = widgetSdk;
    window['_@apitable/core'] = core;
    window['_@vikadata/icons'] = icons;
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
      const reload = (res) => {
        console.log(res.success ? `小组件热更新: ${widgetId}` : '链接断开');
        refresh();
      };
      widgetCliSOcket.on(WidgetCliSocketType.LiveReload, reload);
      return () => widgetCliSOcket.destroy();
    }, [isDevMode, loadUrl, refresh, widgetId]);
    // 未发布的状态
    if (!isDevMode && status === WidgetPackageStatus.Developing) {
      return (
        <div className={styles.configInfo}>
          <div className={styles.title}>
            <span>{t(Strings.widget_loader_developing_title)}</span>
            <a href={Settings.widget_release_help.value} target="_blank" className={styles.helpIcon} rel="noreferrer">
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
    // 开发者模式错误处理
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
            action={() => window.open(Settings.widget_cret_invalid_help.value)}
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
      <ErrorBoundary id={id} datasheetId={datasheetId} logError={!isDevMode}>
        <WidgetComponent />
      </ErrorBoundary>
    </>;
  };

export const WidgetLoader = React.forwardRef(WidgetLoaderBase);
