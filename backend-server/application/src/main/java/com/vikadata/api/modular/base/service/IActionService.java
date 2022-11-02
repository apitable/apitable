package com.vikadata.api.modular.base.service;

import com.vikadata.api.model.vo.organization.InviteInfoVo;

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
