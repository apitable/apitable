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

import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;

import com.apitable.organization.ro.InviteValidRo;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.context.SessionContext;
import com.apitable.space.ro.SpaceLinkOpRo;
import com.apitable.space.vo.SpaceLinkInfoVo;
import com.apitable.space.vo.SpaceLinkVo;
import com.apitable.organization.mapper.TeamMapper;
import com.apitable.space.mapper.SpaceInviteLinkMapper;
import com.apitable.space.service.IInvitationService;
import com.apitable.space.service.ISpaceInviteLinkService;
import com.apitable.core.support.ResponseData;
import com.apitable.space.entity.InvitationEntity;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Api(tags = "Space - Invite Link Api")
@ApiResource(path = "/space/link")
public class SpaceLinkController {

    @Resource
    private ISpaceInviteLinkService iSpaceInviteLinkService;

    @Resource
    private SpaceInviteLinkMapper spaceInviteLinkMapper;

    @Resource
    private TeamMapper teamMapper;

    @Resource
    private IInvitationService iInvitationService;

    @GetResource(path = "/list", tags = "INVITE_MEMBER")
    @ApiOperation(value = "Get a list of links")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW")
    public ResponseData<List<SpaceLinkVo>> list() {
        Long memberId = LoginContext.me().getMemberId();
        List<SpaceLinkVo> vo = spaceInviteLinkMapper.selectLinkVo(memberId);
        return ResponseData.success(vo);
    }

    @PostResource(path = "/generate", tags = "INVITE_MEMBER")
    @ApiOperation(value = "Generate or refresh link", notes = "return token，the front stitch ../invite/link?token=:token")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW")
    public ResponseData<String> generate(@RequestBody @Valid SpaceLinkOpRo opRo) {
        String spaceId = LoginContext.me().getSpaceId();
        Long memberId = LoginContext.me().getMemberId();
        if (StrUtil.isNotBlank(opRo.getNodeId())) {
            return ResponseData.success(iInvitationService.getMemberInvitationTokenByNodeId(memberId, spaceId, opRo.getNodeId()));
        }
        Long teamId = opRo.getTeamId();
        if (teamId == 0) {
            teamId = teamMapper.selectRootIdBySpaceId(spaceId);
        }
        String token = iSpaceInviteLinkService.saveOrUpdate(spaceId, teamId, memberId);
        return ResponseData.success(token);
    }

    @PostResource(path = "/delete", method = { RequestMethod.DELETE }, tags = "INVITE_MEMBER")
    @ApiOperation(value = "Delete link")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<Void> delete(@RequestBody @Valid SpaceLinkOpRo opRo) {
        Long memberId = LoginContext.me().getMemberId();
        Long teamId = opRo.getTeamId();
        if (teamId == 0) {
            String spaceId = LoginContext.me().getSpaceId();
            teamId = teamMapper.selectRootIdBySpaceId(spaceId);
        }
        spaceInviteLinkMapper.delByTeamIdAndMemberId(teamId, Collections.singletonList(memberId));
        return ResponseData.success();
    }

    @PostResource(name = "Valid invite link token", path = "/valid", requiredLogin = false)
    @ApiOperation(value = "Valid invite link token", notes = "After the verification is successful, it can obtain related invitation information")
    public ResponseData<SpaceLinkInfoVo> valid(@RequestBody @Valid InviteValidRo data) {
        SpaceLinkInfoVo vo;
        if (StrUtil.isNotBlank(data.getNodeId())) {
            InvitationEntity entity = iInvitationService.validInvitationToken(data.getToken(), data.getNodeId());
            vo = iInvitationService.getInvitationInfo(entity.getSpaceId(), entity.getCreator());
        }
        else {
            vo = iSpaceInviteLinkService.valid(data.getToken());
        }
        return ResponseData.success(vo);
    }

    @PostResource(name = "Join the space using the public link", path = "/join", requiredPermission = false)
    @ApiOperation(value = "Join the space using the public link", notes = "If return code status 201, the user redirects to the login page due to unauthorized。")
    public ResponseData<Void> join(@RequestBody @Valid InviteValidRo data) {
        Long userId = SessionContext.getUserId();
        iSpaceInviteLinkService.join(userId, data.getToken(), data.getNodeId());
        return ResponseData.success();
    }
}
