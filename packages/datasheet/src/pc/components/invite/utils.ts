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

import { StatusCode, t, Strings } from '@apitable/core';

const InviteInvalidReasonObj = {
  [StatusCode.SPACE_NOT_EXIST]: t(Strings.status_code_space_not_exist),
  [StatusCode.LINK_INVALID]: t(Strings.status_code_link_invalid),
  [StatusCode.INVITER_SPACE_MEMBER_LIMIT]: t(Strings.status_code_inviter_space_member_limit),
  [StatusCode.SPACE_LIMIT]: t(Strings.status_code_space_limit),
};
// Get error messages
export const getInvalidReason = (code?: number, message?: string) => {
  const finalReason = (code && InviteInvalidReasonObj[code]) || message || t(Strings.link_common_err);
  return finalReason;
};
