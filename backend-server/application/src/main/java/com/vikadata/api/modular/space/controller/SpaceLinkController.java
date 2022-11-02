package com.vikadata.api.modular.space.controller;

import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.constants.ParamsConstants;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.model.ro.organization.InviteValidRo;
import com.vikadata.api.model.ro.space.SpaceLinkOpRo;
import com.vikadata.api.model.vo.space.SpaceLinkInfoVo;
import com.vikadata.api.model.vo.space.SpaceLinkVo;
import com.vikadata.api.modular.organization.mapper.TeamMapper;
import com.vikadata.api.modular.space.mapper.SpaceInviteLinkMapper;
import com.vikadata.api.modular.space.service.IInvitationService;
import com.vikadata.api.modular.space.service.ISpaceInviteLinkService;
import com.vikadata.core.support.ResponseData;
import com.vikadata.entity.InvitationEntity;

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
