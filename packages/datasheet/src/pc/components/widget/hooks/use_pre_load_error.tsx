import { IWidget, Strings, t, WidgetInstallEnv, WidgetRuntimeEnv } from '@vikadata/core';
import { ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from 'pc/hooks';
import { FC, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ErrorWidget } from '../widget_loader';

enum PreLoadErrorCode {
  NotSupportMobile,
  NotSupportDesktop,
  NotSupportDashboard,
  NotSupportPanel,
}

export const usePreLoadError = (widget: IWidget | undefined): JSX.Element | undefined => {
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const isDashboard = useSelector(state => Boolean(state.pageParams.dashboardId));

  const getError = useCallback(
    (widget: IWidget | undefined) => {
      if (!widget || !widget.installEnv?.length || !widget.runtimeEnv?.length) {
        return undefined;
      }
      if (isMobile && !widget.runtimeEnv.includes(WidgetRuntimeEnv.Mobile)) {
        return PreLoadErrorCode.NotSupportMobile;
      }

      if (!isMobile && !widget.runtimeEnv.includes(WidgetRuntimeEnv.Desktop)) {
        return PreLoadErrorCode.NotSupportDesktop;
      }

      if (isDashboard && !widget.installEnv.includes(WidgetInstallEnv.Dashboard)) {
        return PreLoadErrorCode.NotSupportDashboard;
      }

      if (!isDashboard && !widget.installEnv.includes(WidgetInstallEnv.Panel)) {
        return PreLoadErrorCode.NotSupportPanel;
      }
      return undefined;
    },
    [isMobile, isDashboard],
  );
  return useMemo(() => {
    const errorCode = getError(widget);
    return errorCode !== undefined ? <PreLoadError errorCode={errorCode} /> : undefined;
  }, [getError, widget]);
};

const PreLoadError: FC<{ errorCode: PreLoadErrorCode }> = ({ errorCode }) => {
  const ErrorCodeMap = {
    [PreLoadErrorCode.NotSupportDashboard]: {
      title: t(Strings.widget_install_error_title),
      content: t(Strings.widget_install_error_env, {
        errorEnv: t(Strings.dashboard),
        expectEnv: t(Strings.widget_panel),
      }),
    },
    [PreLoadErrorCode.NotSupportPanel]: {
      title: t(Strings.widget_install_error_title),
      content: t(Strings.widget_install_error_env, {
        errorEnv: t(Strings.widget_panel),
        expectEnv: t(Strings.dashboard),
      }),
    },
    [PreLoadErrorCode.NotSupportDesktop]: {
      title: t(Strings.robot_run_history_fail),
      content: t(Strings.widget_env_error, {
        errorEnv: t(Strings.widget_runtime_desktop),
        expectEnv: t(Strings.widget_runtime_mobile),
      }),
    },
    [PreLoadErrorCode.NotSupportMobile]: {
      title: t(Strings.robot_run_history_fail),
      content: t(Strings.widget_env_error, {
        errorEnv: t(Strings.widget_runtime_mobile),
        expectEnv: t(Strings.widget_runtime_desktop),
      }),
    },
  };

  const { title, content } = ErrorCodeMap[errorCode];

  return <ErrorWidget title={title} content={content} />;
};
