/*
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

package com.apitable.base.service.impl;

import static com.apitable.organization.enums.OrganizationException.INVITE_EXPIRE;
import static com.apitable.organization.enums.OrganizationException.INVITE_URL_ERROR;

import com.apitable.base.service.IActionService;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.HttpContextUtil;
import com.apitable.interfaces.user.facade.UserServiceFacade;
import com.apitable.organization.entity.MemberEntity;
import com.apitable.organization.service.IMemberService;
import com.apitable.organization.vo.InviteInfoVo;
import com.apitable.space.entity.SpaceEntity;
import com.apitable.space.entity.SpaceInviteRecordEntity;
import com.apitable.space.mapper.SpaceInviteRecordMapper;
import com.apitable.space.service.ISpaceService;
import com.apitable.user.entity.UserEntity;
import com.apitable.user.service.IUserService;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

/**
 * action service implement.
 */
@Service
public class ActionServiceImpl implements IActionService {

    @Resource
    private IUserService iUserService;

    @Resource
    private UserServiceFacade userServiceFacade;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private SpaceInviteRecordMapper spaceInviteRecordMapper;

    @Resource
    private IMemberService iMemberService;

    @Override
    public InviteInfoVo inviteValidate(String inviteToken) {
        // is it a illegal link
        SpaceInviteRecordEntity record = spaceInviteRecordMapper.selectByInviteToken(inviteToken);
        // determine whether it is illegal
        ExceptionUtil.isNotNull(record, INVITE_URL_ERROR);
        // determine whether it expired
        ExceptionUtil.isFalse(record.getIsExpired(), INVITE_EXPIRE);
        String inviteSpaceId = record.getInviteSpaceId();
        SpaceEntity spaceEntity = iSpaceService.isSpaceAvailable(inviteSpaceId);
        String inviteSpaceName = spaceEntity.getName();
        String inviteEmail = record.getInviteEmail();
        MemberEntity member = iMemberService.getByIdIgnoreDelete(record.getInviteMemberId());
        InviteInfoVo inviteInfoVo = new InviteInfoVo();
        inviteInfoVo.setSpaceId(inviteSpaceId);
        inviteInfoVo.setSpaceName(inviteSpaceName);
        inviteInfoVo.setInviter(member.getMemberName());
        inviteInfoVo.setInviteEmail(inviteEmail);
        // Whether the binding is bound to the mailbox
        boolean inviteBindUser = this.checkInviteBindUser(inviteEmail);
        inviteInfoVo.setIsBound(inviteBindUser);
        boolean isLogin = this.checkUserInSession();
        inviteInfoVo.setIsLogin(isLogin);
        // get the link creator's personal invitation code
        String inviteCode = userServiceFacade.getUserInvitationCode(member.getUserId()).getCode();
        inviteInfoVo.setInviteCode(inviteCode);
        return inviteInfoVo;
    }

    /**
     * Check if a session exists for the current request.
     *
     * @return true | false
     */
    private boolean checkUserInSession() {
        return HttpContextUtil.getSession(false) != null;
    }

    /**
     * Check if the mailbox is bound to another user.
     *
     * @param inviteEmail invitation email
     * @return true | false
     */
    private boolean checkInviteBindUser(String inviteEmail) {
        UserEntity inviteUser = iUserService.getByEmail(inviteEmail);
        return inviteUser != null;
    }
}
