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

import java.util.Objects;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import lombok.extern.slf4j.Slf4j;

import com.apitable.base.service.IActionService;
import com.apitable.interfaces.user.facade.UserServiceFacade;
import com.apitable.organization.dto.MemberDTO;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.organization.vo.InviteInfoVo;
import com.apitable.space.entity.SpaceEntity;
import com.apitable.space.entity.SpaceInviteRecordEntity;
import com.apitable.space.mapper.SpaceInviteRecordMapper;
import com.apitable.space.mapper.SpaceMapper;
import com.apitable.user.entity.UserEntity;
import com.apitable.user.service.IUserService;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.HttpContextUtil;

import org.springframework.stereotype.Service;

import static com.apitable.organization.enums.OrganizationException.INVITE_EXPIRE;
import static com.apitable.organization.enums.OrganizationException.INVITE_URL_ERROR;
import static com.apitable.space.enums.SpaceException.SPACE_NOT_EXIST;

/**
 * ActionServiceImpl
 */
@Service
@Slf4j
public class ActionServiceImpl implements IActionService {

    @Resource
    private SpaceInviteRecordMapper spaceInviteRecordMapper;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private SpaceMapper spaceMapper;

    @Resource
    private IUserService iUserService;

    @Resource
    private UserServiceFacade userServiceFacade;

    @Override
    public InviteInfoVo inviteValidate(String inviteToken) {
        log.info("Invitation check");
        // is it a illegal link
        SpaceInviteRecordEntity record = spaceInviteRecordMapper.selectByInviteToken(inviteToken);
        // determine whether it is illegal
        ExceptionUtil.isNotNull(record, INVITE_URL_ERROR);
        // determine whether it expired
        ExceptionUtil.isFalse(record.getIsExpired(), INVITE_EXPIRE);
        String inviteSpaceId = record.getInviteSpaceId();
        SpaceEntity spaceEntity = spaceMapper.selectBySpaceId(inviteSpaceId);
        // Determine whether the space does not exist or is in the deletion state
        ExceptionUtil.isFalse(Objects.isNull(spaceEntity)
            || !Objects.isNull(spaceEntity.getPreDeletionTime()), SPACE_NOT_EXIST);
        String inviteSpaceName = spaceEntity.getName();
        String inviteEmail = record.getInviteEmail();
        MemberDTO member = memberMapper.selectDtoByMemberId(record.getInviteMemberId());
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
     * Check if a session exists for the current request
     *
     * @return true | false
     */
    private boolean checkUserInSession() {
        HttpSession session = HttpContextUtil.getSession(false);
        return session != null;
    }

    /**
     * Check if the mailbox is bound to another user
     *
     * @param inviteEmail invitation email
     * @return true | false
     */
    private boolean checkInviteBindUser(String inviteEmail) {
        UserEntity inviteUser = iUserService.getByEmail(inviteEmail);
        return inviteUser != null;
    }
}
