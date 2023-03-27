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

import {
  Events,
  generateFixInnerConsistencyChangesets,
  generateFixLinkConsistencyChangesets,
  IConsistencyErrorInfo,
  ILinkConsistencyError,
  IReduxState,
  IUserInfo,
  ModalConfirmKey,
  Player,
  Strings,
  t,
} from '@apitable/core';
import * as Sentry from '@sentry/nextjs';
import { Modal } from 'pc/components/common';
import { IModalReturn } from 'pc/components/common/modal/modal/modal.interface';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import posthog from 'posthog-js';
import { IModalConfirmArgs } from './interface';

let lastModalDestroy: IModalReturn | null = null;

const fixInnerConsistency = (datasheetId: string, errors: IConsistencyErrorInfo[], state: IReduxState) => {
  const ops = generateFixInnerConsistencyChangesets(datasheetId, errors, state);
  if (!ops.length) {
    return;
  }

  resourceService.instance!.operationExecuted(ops);
  Sentry.captureMessage('fixInnerConsistency: Inner data inconsistency of datasheet found and attempts made to fix', {
    extra: {
      datasheetId,
      ops,
    },
  });
};

const fixLinkConsistency = (error: ILinkConsistencyError, state: IReduxState) => {
  const resourceOps = generateFixLinkConsistencyChangesets(error, state);
  if (!resourceOps) {
    return;
  }

  resourceService.instance!.operationExecuted(resourceOps);
  Sentry.captureMessage('fixLinkConsistency: Link inconsistency found and attempts made to fix', {
    extra: {
      mainDstId: error.mainDstId,
      resourceOps,
    },
  });
};

// Set user ID, logged in
Player.bindTrigger(Events.app_set_user_id, (args: IUserInfo) => {
  posthog.identify(args.uuid);

  Sentry.setUser({
    email: args.email,
    username: args.nickName,
    memberName: args.memberName,
    uuid: args.uuid,
    spaceName: args.spaceName,
  });
});

// Error reporting related
Player.bindTrigger(Events.app_error_logger, args => {
  const { error, metaData } = args;
  console.warn('! ' + 'app_error_logger', args);
  Sentry.captureException(error, {
    extra: metaData,
  });
});

// Error reporting related
Player.bindTrigger(Events.app_modal_confirm, (args: IModalConfirmArgs) => {
  const { key, metaData } = args;
  switch (key) {
    case ModalConfirmKey.FixLinkConsistency: {
      if (lastModalDestroy) {
        lastModalDestroy.destroy();
      }
      lastModalDestroy = Modal.confirm({
        title: 'Oops',
        type: 'warning',
        content: t(Strings.confirm_link_inconsistency_detected),
        onOk: () => {
          fixLinkConsistency(metaData.error, store.getState());
          lastModalDestroy = null;
        },
      });
      break;
    }
    case ModalConfirmKey.FixInnerConsistency:
    default: {
      const handleOk = () => {
        const { datasheetId, errors } = metaData;
        fixInnerConsistency(datasheetId, errors, store.getState());
        lastModalDestroy = null;
      };

      if (lastModalDestroy) {
        lastModalDestroy.destroy();
      }
      lastModalDestroy = Modal.confirm({
        title: 'Oops',
        type: 'warning',
        content: t(Strings.confirm_the_system_has_detected_a_conflict_in_document),
        onOk: handleOk,
      });
      break;
    }
  }
});
