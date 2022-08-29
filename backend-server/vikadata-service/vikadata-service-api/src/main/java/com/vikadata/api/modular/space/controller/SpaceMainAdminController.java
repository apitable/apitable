package com.vikadata.api.modular.space.controller;

import javax.annotation.Resource;
import javax.validation.Valid;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.Notification;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.cache.service.UserSpaceService;
import com.vikadata.api.component.notification.NotificationTemplateId;
import com.vikadata.api.constants.ParamsConstants;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.model.ro.space.SpaceMainAdminChangeOpRo;
import com.vikadata.api.model.vo.space.MainAdminInfoVo;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.space.model.SpaceUpdateOperate;
import com.vikadata.api.modular.space.service.ISpaceInviteLinkService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.core.support.ResponseData;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * 权限管理-子管理员 控制器
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/11 21:00
 */
@RestController
@Api(tags = "空间管理_主管理员相关接口")
@ApiResource(path = "/space")
public class SpaceMainAdminController {

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private UserSpaceService userSpaceService;

    @Resource
    private ISpaceInviteLinkService iSpaceInviteLinkService;

    @GetResource(path = "/manager")
    @ApiOperation(value = "获取主管理员信息", notes = "获取主管理员信息")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<MainAdminInfoVo> getMainAdminInfo() {
        String spaceId = LoginContext.me().getSpaceId();
        MainAdminInfoVo vo = memberMapper.selectAdminInfoBySpaceId(spaceId);
        return ResponseData.success(vo);
    }

    @Notification(templateId = NotificationTemplateId.SPACE_ADD_PRIMARY_ADMIN)
    @PostResource(path = "/changeManager", tags = "UPDATE_MAIN_ADMIN")
    @ApiOperation(value = "更换主管理员", notes = "更换主管理员")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<Void> replace(@RequestBody @Valid SpaceMainAdminChangeOpRo opRo) {
        Long userId = SessionContext.getUserId();
        Long memberId = LoginContext.me().getMemberId();
        String spaceId = LoginContext.me().getSpaceId();
        iSpaceService.checkCanOperateSpaceUpdate(spaceId, memberId, opRo.getMemberId(), new SpaceUpdateOperate[] { SpaceUpdateOperate.UPDATE_MAIN_ADMIN });
        Long id = iSpaceService.changeMainAdmin(spaceId, opRo.getMemberId());
        //该空间全员可邀请成员的开关处于关闭时，原主管理员生成的空间公开邀请链接均失效
        iSpaceInviteLinkService.delByMemberIdIfNotInvite(spaceId, memberId);
        //删除相关缓存
        userSpaceService.delete(userId, spaceId);
        userSpaceService.delete(id, spaceId);
        return ResponseData.success();
    }
}
