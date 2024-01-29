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

import { FC, useCallback, useMemo } from 'react';
import { IWidget, Strings, t, WidgetInstallEnv, WidgetRuntimeEnv } from '@apitable/core';
import { ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { ErrorWidget } from '../error_widget';

enum PreLoadErrorCode {
  NotSupportMobile,
  NotSupportDesktop,
  NotSupportDashboard,
  NotSupportPanel,
}

export const usePreLoadError = (widget: IWidget | undefined): JSX.Element | undefined => {
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const isDashboard = useAppSelector((state) => Boolean(state.pageParams.dashboardId));

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

const PreLoadError: FC<React.PropsWithChildren<{ errorCode: PreLoadErrorCode }>> = ({ errorCode }) => {
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
