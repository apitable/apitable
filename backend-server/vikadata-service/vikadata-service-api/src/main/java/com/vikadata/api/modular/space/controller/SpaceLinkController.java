package com.vikadata.api.modular.space.controller;

import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

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
import com.vikadata.api.modular.space.service.ISpaceInviteLinkService;
import com.vikadata.core.support.ResponseData;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * 空间公开邀请链接接口
 * </p>
 *
 * @author Chambers
 * @date 2020/3/21
 */
@RestController
@Api(tags = "空间管理_公开邀请链接相关接口")
@ApiResource(path = "/space/link")
public class SpaceLinkController {

    @Resource
    private ISpaceInviteLinkService iSpaceInviteLinkService;

    @Resource
    private SpaceInviteLinkMapper spaceInviteLinkMapper;

    @Resource
    private TeamMapper teamMapper;

    @GetResource(path = "/list", tags = "INVITE_MEMBER")
    @ApiOperation(value = "获取链接列表")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW")
    public ResponseData<List<SpaceLinkVo>> list() {
        Long memberId = LoginContext.me().getMemberId();
        List<SpaceLinkVo> vo = spaceInviteLinkMapper.selectLinkVo(memberId);
        return ResponseData.success(vo);
    }

    @PostResource(path = "/generate", tags = "INVITE_MEMBER")
    @ApiOperation(value = "生成/刷新链接", notes = "返回token，前端拼接../invite/link?token=:token")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW")
    public ResponseData<String> generate(@RequestBody @Valid SpaceLinkOpRo opRo) {
        String spaceId = LoginContext.me().getSpaceId();
        Long memberId = LoginContext.me().getMemberId();
        Long teamId = opRo.getTeamId();
        if (teamId == 0) {
            teamId = teamMapper.selectRootIdBySpaceId(spaceId);
        }
        String token = iSpaceInviteLinkService.saveOrUpdate(spaceId, teamId, memberId);
        return ResponseData.success(token);
    }

    @PostResource(path = "/delete", method = { RequestMethod.DELETE }, tags = "INVITE_MEMBER")
    @ApiOperation(value = "删除链接")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
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

    @PostResource(name = "邀请链接令牌校验", path = "/valid", requiredLogin = false)
    @ApiOperation(value = "邀请链接令牌校验", notes = "邀请链接令牌校验，校验成功后即可获取相关邀请信息")
    public ResponseData<SpaceLinkInfoVo> valid(@RequestBody @Valid InviteValidRo data) {
        SpaceLinkInfoVo vo = iSpaceInviteLinkService.valid(data.getToken());
        return ResponseData.success(vo);
    }

    @PostResource(name = "公开链接加入空间站", path = "/join", requiredPermission = false)
    @ApiOperation(value = "公开链接加入空间站", notes = "状态码返回201未授权跳转至登陆页面")
    public ResponseData<Void> join(@RequestBody @Valid InviteValidRo data) {
        Long userId = SessionContext.getUserId();
        iSpaceInviteLinkService.join(userId, data.getToken());
        return ResponseData.success();
    }
}
