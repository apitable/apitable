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

package com.apitable.space.controller;

import static com.apitable.core.constants.RedisConstants.GENERAL_LOCKED;
import static com.apitable.organization.enums.OrganizationException.INVITE_EMAIL_HAS_ACTIVE;
import static com.apitable.organization.enums.OrganizationException.INVITE_EMAIL_NOT_FOUND;
import static com.apitable.organization.enums.OrganizationException.INVITE_TOO_OFTEN;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.core.support.ResponseData;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.interfaces.billing.facade.EntitlementServiceFacade;
import com.apitable.interfaces.billing.model.SubscriptionInfo;
import com.apitable.interfaces.security.facade.BlackListServiceFacade;
import com.apitable.interfaces.security.facade.HumanVerificationServiceFacade;
import com.apitable.interfaces.security.model.NonRobotMetadata;
import com.apitable.interfaces.user.facade.InvitationServiceFacade;
import com.apitable.interfaces.user.model.InvitationMetadata;
import com.apitable.organization.entity.MemberEntity;
import com.apitable.organization.service.IMemberService;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.context.SessionContext;
import com.apitable.space.ro.EmailInvitationMemberRo;
import com.apitable.space.ro.EmailInvitationResendRo;
import com.apitable.space.ro.EmailInvitationRo;
import com.apitable.space.service.ISpaceInvitationService;
import com.apitable.space.service.ISpaceService;
import com.apitable.space.vo.EmailInvitationResultVO;
import com.apitable.space.vo.EmailInvitationValidateVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Space - Invitation API.
 */
@RestController
@Tag(name = "Space - Invitation API")
@ApiResource(path = "/")
public class SpaceInvitationController {

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private ISpaceInvitationService iSpaceInvitationService;

    @Resource
    private InvitationServiceFacade invitationServiceFacade;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private BlackListServiceFacade blackListServiceFacade;

    @Resource
    private HumanVerificationServiceFacade humanVerificationServiceFacade;

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @Resource
    private EntitlementServiceFacade entitlementServiceFacade;

    /**
     * Valid email invitation.
     */
    @GetResource(path = "/email-invitations/{inviteToken}/valid", requiredLogin = false)
    @Operation(summary = "Valid Email Invitation")
    @Parameter(name = "inviteToken", description = "Invite Token", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "0c7eb51617d34fa4b")
    public ResponseData<EmailInvitationValidateVO> validEmailInvitation(
        @PathVariable("inviteToken") String inviteToken
    ) {
        return ResponseData.success(iSpaceInvitationService.validEmailInvitation(inviteToken));
    }

    /**
     * Accept email invitation.
     */
    @PostResource(path = "spaces/{spaceId}/email-invitations/{inviteToken}/accept",
        requiredPermission = false)
    @Operation(summary = "Accept Email Invitation")
    @Parameters({
        @Parameter(name = "spaceId", description = "Space ID", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "spczJrh2i3tLW"),
        @Parameter(name = "inviteToken", description = "Invite Token", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "0c7eb51617d34fa4b")
    })
    public ResponseData<Void> acceptEmailInvitation(
        @PathVariable("spaceId") String spaceId,
        @PathVariable("inviteToken") String inviteToken
    ) {
        iSpaceService.checkCanOperateSpaceUpdate(spaceId);
        Long userId = SessionContext.getUserId();
        iSpaceInvitationService.acceptEmailInvitation(userId, inviteToken);
        return ResponseData.success();
    }

    /**
     * Send email invitation.
     * todo: remove '/org/member/sendInvite' path after v1.9.0
     */
    @PostResource(path = {"spaces/{spaceId}/email-invitations", "/org/member/sendInvite"},
        tags = "INVITE_MEMBER")
    @Operation(summary = "Send an email to invite members",
        description = "The user opens the link in the invitation email"
            + " and will officially join the space station after confirmation.")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spczJrh2i3tLW"),
        @Parameter(name = "spaceId", description = "Space ID", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "spczJrh2i3tLW")
    })
    @Parameter(name = "spaceId", description = "Space ID", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "spcyQkKp9XJEl")
    public ResponseData<EmailInvitationResultVO> sendEmailInvitation(
        @PathVariable(value = "spaceId", required = false) String spaceId,
        @RequestBody @Valid EmailInvitationRo data
    ) {
        if (StrUtil.isBlank(spaceId)) {
            spaceId = LoginContext.me().getSpaceId();
        }
        // human verification
        humanVerificationServiceFacade.verifyNonRobot(new NonRobotMetadata(data.getData()));
        // whether in black list
        blackListServiceFacade.checkSpace(spaceId);
        iSpaceService.checkSeatOverLimit(spaceId, data.getInvite().size());
        // check whether space can invite user
        iSpaceService.checkCanOperateSpaceUpdate(spaceId);
        List<EmailInvitationMemberRo> inviteMembers = data.getInvite();
        EmailInvitationResultVO view = EmailInvitationResultVO.builder().build();
        // get invited emails
        List<String> inviteEmails = inviteMembers.stream()
            .map(EmailInvitationMemberRo::getEmail)
            .filter(StrUtil::isNotBlank).collect(Collectors.toList());
        if (CollUtil.isEmpty(inviteEmails)) {
            // without email, response success directly
            return ResponseData.success(view);
        }
        SubscriptionInfo subscriptionInfo =
            entitlementServiceFacade.getSpaceSubscription(spaceId);
        if (subscriptionInfo.isFree() && iMemberService.shouldPreventInvitation(spaceId)) {
            return ResponseData.success(view);
        }
        // invite new members
        Long userId = SessionContext.getUserId();
        List<String> emails = iMemberService.emailInvitation(userId, spaceId, inviteEmails);
        view.setEmails(emails);
        return ResponseData.success(view);
    }

    /**
     * Resend email invitation.
     * todo: remove '/org/member/sendInviteSingle' path after v1.9.0
     */
    @PostResource(path = {"spaces/{spaceId}/email-invitation/resend",
        "/org/member/sendInviteSingle"}, tags = "INVITE_MEMBER")
    @Operation(summary = "Resend an email to invite members",
        description = "If a member is not activated, it can send an invitation again"
            + " regardless of whether the invitation has expired."
            + " After the invitation is successfully sent,"
            + " the invitation link sent last time will be invalid.")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spczJrh2i3tLW"),
        @Parameter(name = "spaceId", description = "Space ID", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "spczJrh2i3tLW")
    })
    public ResponseData<Void> resendEmailInvitation(
        @PathVariable(value = "spaceId", required = false) String spaceId,
        @RequestBody @Valid EmailInvitationResendRo data
    ) {
        if (StrUtil.isBlank(spaceId)) {
            spaceId = LoginContext.me().getSpaceId();
        }
        // check black space
        blackListServiceFacade.checkSpace(spaceId);
        iSpaceService.checkSeatOverLimit(spaceId);
        iSpaceService.checkCanOperateSpaceUpdate(spaceId);
        // Again email invite members
        MemberEntity member = iMemberService.getBySpaceIdAndEmail(spaceId, data.getEmail());
        ExceptionUtil.isNotNull(member, INVITE_EMAIL_NOT_FOUND);
        ExceptionUtil.isFalse(member.getIsActive(), INVITE_EMAIL_HAS_ACTIVE);
        // Limit the frequency for 10 minutes
        String lockKey = StrUtil.format(GENERAL_LOCKED, "invite:email", data.getEmail());
        BoundValueOperations<String, String> ops = redisTemplate.boundValueOps(lockKey);
        ExceptionUtil.isNull(ops.get(), INVITE_TOO_OFTEN);
        ops.set("", 10, TimeUnit.MINUTES);
        Long userId = SessionContext.getUserId();
        invitationServiceFacade.sendInvitationEmail(
            new InvitationMetadata(userId, spaceId, data.getEmail()));
        return ResponseData.success();
    }
}
