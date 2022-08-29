package com.vikadata.api.modular.space.controller;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.Notification;
import com.vikadata.api.annotation.PageObjectParam;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.cache.service.UserSpaceService;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.component.notification.NotificationRenderField;
import com.vikadata.api.component.notification.NotificationTemplateId;
import com.vikadata.api.constants.ParamsConstants;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.holder.NotificationRenderFieldHolder;
import com.vikadata.api.lang.PageInfo;
import com.vikadata.api.model.ro.space.AddSpaceRoleRo;
import com.vikadata.api.model.ro.space.UpdateSpaceRoleRo;
import com.vikadata.api.model.vo.space.SpaceRoleDetailVo;
import com.vikadata.api.model.vo.space.SpaceRoleVo;
import com.vikadata.api.modular.space.service.ISpaceInviteLinkService;
import com.vikadata.api.modular.space.service.ISpaceRoleService;
import com.vikadata.core.support.ResponseData;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.constants.PageConstants.PAGE_DESC;
import static com.vikadata.api.constants.PageConstants.PAGE_PARAM;
import static com.vikadata.api.constants.PageConstants.PAGE_SIMPLE_EXAMPLE;

/**
 * <p>
 * 权限管理-主管理员 控制器
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/11 21:00
 */
@RestController
@Api(tags = "空间管理_子管理员相关接口")
@ApiResource(path = "/space")
public class SpaceSubAdminController {

    @Resource
    private ISpaceRoleService iSpaceRoleService;

    @Resource
    private UserSpaceService userSpaceService;

    @Resource
    private ISpaceInviteLinkService iSpaceInviteLinkService;

    @GetResource(path = "/listRole", tags = "READ_SUB_ADMIN")
    @ApiOperation(value = "查询管理员列表", notes = "分页查询子管理员列表\n" + PAGE_DESC)
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
            @ApiImplicitParam(name = PAGE_PARAM, value = "分页参数，说明看接口描述", required = true, dataTypeClass = String.class, paramType = "query", example = PAGE_SIMPLE_EXAMPLE)
    })
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public ResponseData<PageInfo<SpaceRoleVo>> listRole(@PageObjectParam Page page) {
        String spaceId = LoginContext.me().getSpaceId();
        PageInfo<SpaceRoleVo> pageResult = iSpaceRoleService.roleList(spaceId, page);
        return ResponseData.success(pageResult);
    }

    @GetResource(path = { "/getRoleDetail" }, tags = "UPDATE_SUB_ADMIN")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    @ApiOperation(value = "获取管理员信息", notes = "获取管理员信息")
    @SuppressWarnings("unchecked")
    public ResponseData<SpaceRoleDetailVo> getRoleDetail(@RequestParam(name = "memberId") Long memberId) {
        String spaceId = LoginContext.me().getSpaceId();
        SpaceRoleDetailVo spaceRoleDetailVo = iSpaceRoleService.getRoleDetail(spaceId, memberId);
        return ResponseData.success(spaceRoleDetailVo);
    }

    @Notification(templateId = NotificationTemplateId.ADD_SUB_ADMIN)
    @PostResource(path = "/addRole", tags = "CREATE_SUB_ADMIN")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    @ApiOperation(value = "添加管理员", notes = "添加管理员")
    @SuppressWarnings("rawtypes")
    public ResponseData addRole(@RequestBody @Valid AddSpaceRoleRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        // 检查资源是否被禁止
        iSpaceRoleService.checkAdminResourceChangeAllow(spaceId, data.getResourceCodes());
        // 查找限制
        // iSubscriptionService.checkSubAdmins(spaceId);
        //创建管理员
        iSpaceRoleService.createRole(spaceId, data);
        //删除相关缓存
        TaskManager.me().execute(() -> userSpaceService.delete(spaceId, data.getMemberIds()));
        return ResponseData.success();
    }

    @PostResource(path = "/editRole", tags = "UPDATE_SUB_ADMIN")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    @ApiOperation(value = "编辑管理员", notes = "编辑管理员")
    @SuppressWarnings("rawtypes")
    public ResponseData editRole(@RequestBody @Valid UpdateSpaceRoleRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        // 检查资源是否被禁止
        iSpaceRoleService.checkAdminResourceChangeAllow(spaceId, data.getResourceCodes());
        //更新角色权限
        iSpaceRoleService.edit(spaceId, data);
        //删除相关缓存
        TaskManager.me().execute(() -> userSpaceService.delete(spaceId, CollUtil.newArrayList(data.getMemberId())));
        return ResponseData.success();
    }

    @Notification(templateId = NotificationTemplateId.CHANGE_ORDINARY_USER)
    @PostResource(path = "/deleteRole/{memberId}", method = RequestMethod.DELETE, tags = "DELETE_SUB_ADMIN")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    @ApiOperation(value = "删除管理员", notes = "删除管理员")
    @SuppressWarnings("rawtypes")
    public ResponseData deleteRole(@PathVariable("memberId") Long memberId) {
        String spaceId = LoginContext.me().getSpaceId();
        iSpaceRoleService.deleteRole(spaceId, memberId);
        //删除相关缓存
        TaskManager.me().execute(() -> userSpaceService.delete(spaceId, CollUtil.newArrayList(memberId)));
        //该空间全员可邀请成员的开关处于关闭时，该成员生成的空间公开邀请链接均失效
        TaskManager.me().execute(() -> iSpaceInviteLinkService.delByMemberIdIfNotInvite(spaceId, memberId));
        // 通知变量
        NotificationRenderFieldHolder.set(NotificationRenderField.builder().playerIds(ListUtil.toList(memberId)).build());
        return ResponseData.success();
    }
}
