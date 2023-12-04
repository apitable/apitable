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

import cn.hutool.core.util.StrUtil;
import com.apitable.core.support.ResponseData;
import com.apitable.interfaces.security.facade.HumanVerificationServiceFacade;
import com.apitable.interfaces.security.model.NonRobotMetadata;
import com.apitable.organization.ro.InviteValidRo;
import com.apitable.organization.service.ITeamService;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.context.SessionContext;
import com.apitable.space.entity.InvitationEntity;
import com.apitable.space.ro.SpaceLinkOpRo;
import com.apitable.space.service.IInvitationService;
import com.apitable.space.service.ISpaceInviteLinkService;
import com.apitable.space.vo.SpaceLinkInfoVo;
import com.apitable.space.vo.SpaceLinkVo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Space - Invite Link Api.
 */
@RestController
@Tag(name = "Space - Invite Link Api")
@ApiResource(path = "/space/link")
public class SpaceLinkController {

    @Resource
    private ISpaceInviteLinkService iSpaceInviteLinkService;

    @Resource
    private ITeamService iTeamService;

    @Resource
    private IInvitationService iInvitationService;

    @Resource
    private HumanVerificationServiceFacade humanVerificationServiceFacade;

    /**
     * Get a list of links.
     */
    @GetResource(path = "/list", tags = "INVITE_MEMBER")
    @Operation(summary = "Get a list of links")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spczJrh2i3tLW")
    public ResponseData<List<SpaceLinkVo>> list() {
        Long memberId = LoginContext.me().getMemberId();
        return ResponseData.success(iSpaceInviteLinkService.getSpaceLinkVos(memberId));
    }

    /**
     * Generate or refresh link.
     */
    @PostResource(path = "/generate", tags = "INVITE_MEMBER")
    @Operation(summary = "Generate or refresh link",
        description = "return token，the front end stitching $DOMAIN/invite/link?token=:token")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spczJrh2i3tLW")
    public ResponseData<String> generate(@RequestBody @Valid SpaceLinkOpRo opRo) {
        String spaceId = LoginContext.me().getSpaceId();
        Long memberId = LoginContext.me().getMemberId();
        if (StrUtil.isNotBlank(opRo.getNodeId())) {
            return ResponseData.success(
                iInvitationService.getMemberInvitationTokenByNodeId(memberId, spaceId,
                    opRo.getNodeId()));
        }
        Long teamId = opRo.getTeamId();
        if (teamId == 0) {
            teamId = iTeamService.getRootTeamId(spaceId);
        }
        String token = iSpaceInviteLinkService.saveOrUpdate(spaceId, teamId, memberId);
        return ResponseData.success(token);
    }

    /**
     * Delete link.
     */
    @PostResource(path = "/delete", method = {RequestMethod.DELETE}, tags = "INVITE_MEMBER")
    @Operation(summary = "Delete link")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl")
    public ResponseData<Void> delete(@RequestBody @Valid SpaceLinkOpRo opRo) {
        String spaceId = LoginContext.me().getSpaceId();
        Long memberId = LoginContext.me().getMemberId();
        Long teamId = opRo.getTeamId();
        if (teamId == 0) {
            teamId = iTeamService.getRootTeamId(spaceId);
        }
        iSpaceInviteLinkService.deleteByTeamIdAndMemberId(teamId, memberId);
        return ResponseData.success();
    }

    /**
     * Valid invite link token.
     */
    @PostResource(path = "/valid", requiredLogin = false)
    @Operation(summary = "Valid invite link token", description = "After the verification is "
        + "successful, it can obtain related invitation information")
    public ResponseData<SpaceLinkInfoVo> valid(@RequestBody @Valid InviteValidRo data) {
        if (StrUtil.isBlank(data.getNodeId())) {
            return ResponseData.success(iSpaceInviteLinkService.valid(data.getToken()));
        }
        InvitationEntity entity =
            iInvitationService.validInvitationToken(data.getToken(), data.getNodeId());
        SpaceLinkInfoVo vo =
            iInvitationService.getInvitationInfo(entity.getSpaceId(), entity.getCreator());
        return ResponseData.success(vo);
    }

    /**
     * Join the space using the public link.
     */
    @PostResource(path = "/join", requiredPermission = false)
    @Operation(summary = "Join the space using the public link",
        description = "If return code status 201,"
            + "the user redirects to the login page due to unauthorized.")
    public ResponseData<Void> join(@RequestBody @Valid InviteValidRo data) {
        // human verification
        humanVerificationServiceFacade.verifyNonRobot(new NonRobotMetadata(data.getData()));
        Long userId = SessionContext.getUserId();
        iSpaceInviteLinkService.join(userId, data.getToken(), data.getNodeId());
        return ResponseData.success();
    }
}
