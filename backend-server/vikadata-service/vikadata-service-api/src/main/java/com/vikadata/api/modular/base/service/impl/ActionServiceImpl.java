package com.vikadata.api.modular.base.service.impl;

import java.util.Objects;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.vcode.VCodeType;
import com.vikadata.api.model.dto.organization.MemberDto;
import com.vikadata.api.model.vo.organization.InviteInfoVo;
import com.vikadata.api.modular.base.service.IActionService;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.space.mapper.SpaceInviteRecordMapper;
import com.vikadata.api.modular.space.mapper.SpaceMapper;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.modular.vcode.mapper.VCodeMapper;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.HttpContextUtil;
import com.vikadata.entity.SpaceEntity;
import com.vikadata.entity.SpaceInviteRecordEntity;
import com.vikadata.entity.UserEntity;

import org.springframework.stereotype.Service;

import static com.vikadata.api.enums.exception.OrganizationException.INVITE_EXPIRE;
import static com.vikadata.api.enums.exception.OrganizationException.INVITE_URL_ERROR;
import static com.vikadata.api.enums.exception.SpaceException.SPACE_NOT_EXIST;

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
    private VCodeMapper vCodeMapper;

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
        ExceptionUtil.isFalse(Objects.isNull(spaceEntity) || !Objects.isNull(spaceEntity.getPreDeletionTime()), SPACE_NOT_EXIST);
        String inviteSpaceName = spaceEntity.getName();
        String inviteEmail = record.getInviteEmail();
        MemberDto member = memberMapper.selectDtoByMemberId(record.getInviteMemberId());
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
        String inviteCode = vCodeMapper.selectCodeByTypeAndRefId(VCodeType.PERSONAL_INVITATION_CODE.getType(), member.getUserId());
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
