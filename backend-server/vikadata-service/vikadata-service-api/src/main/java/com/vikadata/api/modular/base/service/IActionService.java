package com.vikadata.api.modular.base.service;

import com.vikadata.api.model.vo.organization.InviteInfoVo;

/**
 * ActionService
 *
 * @author Chambers
 * @since 2019/10/26
 */
public interface IActionService {

    /**
     * 激活邀请用户
     *
     * @param inviteToken 邀请令牌
     * @return 邀请相关信息视图
     * @author Shawn Deng
     * @date 2019/12/24 16:35
     */
    InviteInfoVo inviteValidate(String inviteToken);
}
