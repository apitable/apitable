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

import * as Sentry from '@sentry/nextjs';
import posthog from 'posthog-js';
import {
  Events,
  generateFixInnerConsistencyChangesets,
  generateFixLinkConsistencyChangesets,
  IInnerConsistencyErrorInfo,
  ILinkConsistencyError,
  IReduxState,
  IUserInfo,
  ModalConfirmKey,
  Player,
  Strings,
  t,
} from '@apitable/core';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { IModalReturn } from 'pc/components/common/modal/modal/modal.interface';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { IModalConfirmArgs } from './interface';

let lastModalDestroy: IModalReturn | null = null;
let fixConsistencyMetadata: { errors: IInnerConsistencyErrorInfo[]; datasheetId: string } | null = null;

const fixInnerConsistency = (datasheetId: string, errors: IInnerConsistencyErrorInfo[], state: IReduxState) => {
  const ops = generateFixInnerConsistencyChangesets(datasheetId, errors, state);
  if (!ops.length) {
    return;
  }

  fixConsistencyMetadata = null;
  console.log('Fix inner consistency changesets', ops);
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

  if (fixConsistencyMetadata) {
    // FixInnerConsistency hasn't been carried out, combine their ops
    const { datasheetId, errors } = fixConsistencyMetadata;
    const ops = generateFixInnerConsistencyChangesets(datasheetId, errors, state);
    resourceOps.push(...ops);
    fixConsistencyMetadata = null;
  }

  console.log('Fix consistency changesets', resourceOps);

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
  if (typeof window['posthog'] !== 'undefined') {
    posthog.identify(args.uuid);
  }

  Sentry.setUser({
    email: args.email,
    username: args.nickName,
    memberName: args.memberName,
    uuid: args.uuid,
    spaceName: args.spaceName,
  });
});

// Error reporting related
Player.bindTrigger(Events.app_error_logger, (args) => {
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
      fixConsistencyMetadata = metaData;
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
        onCancel: () => {
          fixConsistencyMetadata = null;
        },
      });
      break;
    }
  }
});
