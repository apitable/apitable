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
 *
 * @author Chambers
 * @since 2019/10/26
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
        log.info("邀请校验");
        //是否非法链接
        SpaceInviteRecordEntity record = spaceInviteRecordMapper.selectByInviteToken(inviteToken);
        //判断是否非法
        ExceptionUtil.isNotNull(record, INVITE_URL_ERROR);
        //判断是否失效
        ExceptionUtil.isFalse(record.getIsExpired(), INVITE_EXPIRE);
        String inviteSpaceId = record.getInviteSpaceId();
        SpaceEntity spaceEntity = spaceMapper.selectBySpaceId(inviteSpaceId);
        //判断空间是否不存在或者处于删除状态中
        ExceptionUtil.isFalse(Objects.isNull(spaceEntity) || !Objects.isNull(spaceEntity.getPreDeletionTime()), SPACE_NOT_EXIST);
        String inviteSpaceName = spaceEntity.getName();
        String inviteEmail = record.getInviteEmail();
        MemberDto member = memberMapper.selectDtoByMemberId(record.getInviteMemberId());
        InviteInfoVo inviteInfoVo = new InviteInfoVo();
        inviteInfoVo.setSpaceId(inviteSpaceId);
        inviteInfoVo.setSpaceName(inviteSpaceName);
        inviteInfoVo.setInviter(member.getMemberName());
        inviteInfoVo.setInviteEmail(inviteEmail);
        //是否绑定绑定了邮箱
        boolean inviteBindUser = this.checkInviteBindUser(inviteEmail);
        inviteInfoVo.setIsBound(inviteBindUser);
        boolean isLogin = this.checkUserInSession();
        inviteInfoVo.setIsLogin(isLogin);
        // 获取链接创建者的个人邀请码
        String inviteCode = vCodeMapper.selectCodeByTypeAndRefId(VCodeType.PERSONAL_INVITATION_CODE.getType(), member.getUserId());
        inviteInfoVo.setInviteCode(inviteCode);
        return inviteInfoVo;
    }

    /**
     * 检查当前请求是否存在会话
     *
     * @return true | false
     */
    private boolean checkUserInSession() {
        HttpSession session = HttpContextUtil.getSession(false);
        return session != null;
    }

    /**
     * 检查邮箱是否已经绑定其他用户
     *
     * @param inviteEmail 邀请邮箱
     * @return true | false
     */
    private boolean checkInviteBindUser(String inviteEmail) {
        UserEntity inviteUser = iUserService.getByEmail(inviteEmail);
        return inviteUser != null;
    }
}
