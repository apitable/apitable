import React, { useEffect } from 'react';
import { useCloudStorage, useMeta, ErrorBoundary, IWidgetState, widgetMessage, initWidgetCliSocket, WidgetCliSocketType } from '@apitable/widget-sdk';
import { useWidgetComponent } from '@apitable/widget-sdk/dist/hooks/private/use_widget_loader';
import { Loading, LinkButton, colors } from '@apitable/components';
import styles from './style.module.less';
import { ErrorFilled, InformationSmallOutlined } from '@apitable/icons';
import { Strings, t, WidgetPackageStatus, Settings } from '@apitable/core';
import { WidgetLoadError } from '@apitable/widget-sdk/dist/initialize_widget';
import { useSelector } from 'react-redux';

interface IErrorWidget {
  title?: string;
  content: string | React.ReactNode;
  actionText?: string;
  action?: () => void;
}

const ErrorWidget = ({ title = t(Strings.widget_load_error_title), content, actionText, action }: IErrorWidget) => (
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

export const WidgetLoader: React.FC<{
  expandDevConfig: () => void;
}> = (props)=> {
  const { expandDevConfig } = props;
  const { id, datasheetId, widgetPackageId, releaseCodeBundle, status, widgetId, authorName, widgetPackageName } = useMeta();
  const [codeUrl] = useCloudStorage<string | undefined>(`widget_loader_code_url_${widgetPackageId}`);
  const isDevMode = useSelector((state: IWidgetState) => {
    return state.widgetConfig.isDevMode;
  });
  const loadUrl = isDevMode ? codeUrl : releaseCodeBundle;
  const [WidgetComponent, refresh, loading, error] = useWidgetComponent(loadUrl, widgetPackageId);

  useEffect(() => {
    widgetMessage.onRefreshWidget((res) => {
      res.success && refresh();
    });
  }, [refresh]);

  useEffect(() => {
    if (!isDevMode) {
      return;
    }
    const url = new URL(loadUrl || 'https://127.0.0.1:9000');
    const widgetCliSOcket = initWidgetCliSocket(url.origin, WidgetCliSocketType.LiveReload);
    const reload = (res) => {
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
          <a href={Settings.widget_release_help_url.value} target="_blank" className={styles.helpIcon} rel="noreferrer">
            <InformationSmallOutlined size={16} color={colors.fc4}/>
          </a>
        </div>
        <div className={styles.tips}>{t(Strings.widget_loader_developing_content)}</div>
        <LinkButton onClick={() => {
          widgetPackageId && widgetId && expandDevConfig();
        }}><span className={styles.linkText}>{t(Strings.widget_continue_develop)}</span></LinkButton>
      </div>
    );
  }
  // Developer mode error handling
  if (isDevMode && error) {
    switch(error) {
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
          action={() => window.open(Settings.widget_how_to_close_browser_restriction_help_url.value)}
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
