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

import { StatusCode, Strings, t } from '@apitable/core';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { openSliderVerificationModal } from 'pc/components/common/slider_verification';
import { getEnvVariables } from 'pc/utils/env';

export const secondStepVerify = (code: number) => {
  const env = getEnvVariables();
  if (env.IS_SELFHOST) {
    return true;
  }
  if (code === StatusCode.SECONDARY_VALIDATION || code === StatusCode.NVC_FAIL) {
    openSliderVerificationModal();
  } else if (code === StatusCode.PHONE_VALIDATION) {
    Modal.confirm({
      title: t(Strings.warning),
      content: t(Strings.status_code_phone_validation),
      onOk: () => {
        if (!env.IS_SELFHOST) {
          window['nvc'].reset();
        }
      },
      type: 'warning',
      okText: t(Strings.got_it),
      cancelButtonProps: {
        style: { display: 'none' },
      },
    });
    return true;
  }
  return true;
};
