
import { StatusCode, t, Strings } from '@apitable/core';

const InviteInvalidReasonObj = {
  [StatusCode.SPACE_NOT_EXIST]: t(Strings.status_code_space_not_exist),
  [StatusCode.LINK_INVALID]: t(Strings.status_code_link_invalid),
  [StatusCode.INVITER_SPACE_MEMBER_LIMIT]: t(Strings.status_code_inviter_space_member_limit),
  [StatusCode.SPACE_LIMIT]: t(Strings.status_code_space_limit),
};
// 获取错误信息
export const getInvalidReason = (code?: number, message?: string) => {
  const finalReason = (code && InviteInvalidReasonObj[code]) || message || t(Strings.link_common_err);
  return finalReason;
}; 

