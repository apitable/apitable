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

import { Navigation, OnOkType, OtErrorCode, StatusCode, Strings, t } from '@apitable/core';
import { IServiceError } from '@apitable/widget-sdk';
import * as Sentry from '@sentry/nextjs';
// @ts-ignore
import { triggerUsageAlertForDatasheet } from 'enterprise';
import { Message } from 'pc/components/common/message';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { Router } from 'pc/components/route_manager/router';
import { getEnvVariables } from 'pc/utils/env';
import parser from 'html-react-parser';

export const onError: IServiceError = (error, type) => {
  const { title, code, message: errorMessage } = error;
  const errorCode = code as number;
  const env = getEnvVariables();
  const qrcodeVisible = !(getEnvVariables().IS_SELFHOST || getEnvVariables().IS_APITABLE);
  if (type === 'modal') {
    Sentry.captureMessage(errorMessage, {
      extra: error as any,
    });

    window.parent.postMessage({
      message: 'socketError', data: {
        errorCode: code,
        message: errorMessage,
      }
    }, '*');

    let modalType = error.modalType || 'error';
    let contentMessage = `<span>${errorMessage}(${errorCode})${qrcodeVisible ? '' :
      `<a href="${env.CRASH_PAGE_REPORT_ISSUES_URL}" target="_blank">，${t(Strings.report_issues)}</a>`}</span>`;
    // TODO: Temporary solutions, forms and tables without permission to insert or edit need to report different errors and
    // different error codes to report errors need different copy
    if (errorCode == StatusCode.NOT_PERMISSION || errorCode == StatusCode.NODE_NOT_EXIST) {
      modalType = 'warning';
      contentMessage = /fom\w+/.test(window.location.href) && errorCode == StatusCode.NOT_PERMISSION ?
        t(Strings.no_datasheet_editing_right) :
        `<span>${t(Strings.no_file_permission_message)}(${errorCode})${qrcodeVisible ? '' :
          `<a href="${env.HELP_MENU_USER_COMMUNITY_URL}" target="_blank">，${t(Strings.join_discord_community)}</a>`}</span>`;
    }
    if (errorCode == OtErrorCode.REVISION_OVER_LIMIT) {
      modalType = 'info';
    }
    const modalOnOk = () => {
      if (modal.destroy()) {
        modal.destroy();
      }
      if (error.onOkType && error.onOkType === OnOkType.BackWorkBench) {
        Router.redirect(Navigation.WORKBENCH);
      } else {
        window.location.reload();
      }
    };

    const modalConfig = {
      title: title || t(Strings.kindly_reminder),
      content: parser(contentMessage),
      okText: error.okText || t(Strings.refresh),
      onOk: modalOnOk,
      maskClosable: false,
      modalButtonType: modalType
    };
    const modal = Modal[modalType](modalConfig);
    return;
  }

  if (type === 'message') {
    Message.warning({ content: errorMessage });
    return;
  }

  if (type === 'subscribeUsage' && errorMessage) {
    const { key, specification, usage } = JSON.parse(errorMessage);
    triggerUsageAlertForDatasheet?.(t(Strings[key], { specification, usage }));
    return;
  }
};
