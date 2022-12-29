package com.vikadata.api.base.service;

import com.vikadata.api.organization.vo.InviteInfoVo;

/**
 * ActionService
 */
public interface IActionService {

    /**
     * Activate invited users
     *
     * @param inviteToken invitation token
     * @return Invitation related information view
     */
    InviteInfoVo inviteValidate(String inviteToken);
}
