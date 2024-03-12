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

package com.apitable.space.service.impl;

import static com.apitable.organization.enums.OrganizationException.INVITE_EMAIL_NOT_MATCH;
import static com.apitable.organization.enums.OrganizationException.INVITE_EXPIRE;
import static com.apitable.organization.enums.OrganizationException.INVITE_URL_ERROR;

import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.HttpContextUtil;
import com.apitable.interfaces.user.facade.UserServiceFacade;
import com.apitable.organization.entity.MemberEntity;
import com.apitable.organization.service.IMemberService;
import com.apitable.shared.component.TaskManager;
import com.apitable.shared.context.LoginContext;
import com.apitable.space.entity.SpaceEntity;
import com.apitable.space.entity.SpaceInviteRecordEntity;
import com.apitable.space.mapper.SpaceInviteRecordMapper;
import com.apitable.space.service.ISpaceInvitationService;
import com.apitable.space.service.ISpaceService;
import com.apitable.space.vo.EmailInvitationValidateVO;
import com.apitable.user.service.IUserService;
import jakarta.annotation.Resource;
import java.util.concurrent.locks.Lock;
import org.springframework.integration.redis.util.RedisLockRegistry;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Space Invitation Service Implement Class.
 */
@Service
public class SpaceInvitationServiceImpl implements ISpaceInvitationService {

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

    @Resource
    private RedisLockRegistry redisLockRegistry;

    @Override
    public EmailInvitationValidateVO validEmailInvitation(String inviteToken) {
        // is it a illegal link
        SpaceInviteRecordEntity record = this.getSpaceInviteRecord(inviteToken);
        String inviteSpaceId = record.getInviteSpaceId();
        MemberEntity member = iMemberService.getById(record.getInviteMemberId());
        ExceptionUtil.isNotNull(member, INVITE_URL_ERROR);
        EmailInvitationValidateVO vo = new EmailInvitationValidateVO();
        vo.setSpaceId(inviteSpaceId);
        SpaceEntity spaceEntity = iSpaceService.isSpaceAvailable(inviteSpaceId);
        vo.setSpaceName(spaceEntity.getName());
        vo.setInviter(member.getMemberName());
        String inviteEmail = record.getInviteEmail();
        vo.setInviteEmail(inviteEmail);
        // Whether the binding is bound to the mailbox
        boolean inviteBindUser = iUserService.getByEmail(inviteEmail) != null;
        vo.setIsBound(inviteBindUser);
        boolean isLogin = HttpContextUtil.getSession(false) != null;
        vo.setIsLogin(isLogin);
        if (isLogin) {
            vo.setIsMatch(inviteEmail.equals(LoginContext.me().getLoginUser().getEmail()));
        }
        // get the link creator's personal invitation code
        String inviteCode = userServiceFacade.getUserInvitationCode(member.getUserId()).getCode();
        vo.setInviteCode(inviteCode);
        return vo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long acceptEmailInvitation(Long userId, String inviteToken) {
        SpaceInviteRecordEntity inviteRecord = this.getSpaceInviteRecord(inviteToken);
        String email = iUserService.getEmailByUserId(userId);
        ExceptionUtil.isTrue(inviteRecord.getInviteEmail().equals(email), INVITE_EMAIL_NOT_MATCH);
        Long invitorUserId = iMemberService.getUserIdByMemberId(inviteRecord.getInviteMemberId());
        ExceptionUtil.isNotNull(invitorUserId, INVITE_URL_ERROR);

        String spaceId = inviteRecord.getInviteSpaceId();
        MemberEntity member =
            iMemberService.getByUserIdAndSpaceIdIncludeDeleted(userId, spaceId);
        // The user already exists in the space
        if (member != null && !member.getIsDeleted()) {
            return member.getId();
        }
        iSpaceService.checkSeatOverLimit(spaceId);
        String key = StrUtil.format("space:email-invitations:{}", inviteToken);
        Lock lock = redisLockRegistry.obtain(key);
        boolean locked = false;
        try {
            locked = lock.tryLock();
            if (locked) {
                // create member
                Long memberId = iMemberService.createMember(userId, spaceId, null);
                spaceInviteRecordMapper.expireByInviteToken(inviteToken, "Accept Invitation");
                TaskManager.me().execute(
                    () -> iMemberService.sendInviteNotification(invitorUserId,
                        ListUtil.toList(memberId), spaceId, false));
                return memberId;
            } else {
                throw new BusinessException("Frequent operations");
            }
        } finally {
            if (locked) {
                lock.unlock();
            }
        }
    }

    private SpaceInviteRecordEntity getSpaceInviteRecord(String inviteToken) {
        // is it a illegal link
        SpaceInviteRecordEntity record =
            spaceInviteRecordMapper.selectByInviteToken(inviteToken);
        // determine whether it is illegal
        ExceptionUtil.isNotNull(record, INVITE_URL_ERROR);
        // determine whether it expired
        ExceptionUtil.isFalse(record.getIsExpired(), INVITE_EXPIRE);
        return record;
    }
}
