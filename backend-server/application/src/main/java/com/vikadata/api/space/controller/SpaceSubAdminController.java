package com.vikadata.api.space.controller;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.GetResource;
import com.vikadata.api.shared.component.notification.annotation.Notification;
import com.vikadata.api.shared.util.page.PageObjectParam;
import com.vikadata.api.shared.component.scanner.annotation.PostResource;
import com.vikadata.api.shared.cache.service.UserSpaceService;
import com.vikadata.api.shared.component.TaskManager;
import com.vikadata.api.shared.component.notification.NotificationRenderField;
import com.vikadata.api.shared.component.notification.NotificationTemplateId;
import com.vikadata.api.shared.constants.ParamsConstants;
import com.vikadata.api.shared.context.LoginContext;
import com.vikadata.api.shared.holder.NotificationRenderFieldHolder;
import com.vikadata.api.shared.util.page.PageInfo;
import com.vikadata.api.space.ro.AddSpaceRoleRo;
import com.vikadata.api.space.ro.UpdateSpaceRoleRo;
import com.vikadata.api.space.vo.SpaceRoleDetailVo;
import com.vikadata.api.space.vo.SpaceRoleVo;
import com.vikadata.api.space.service.ISpaceInviteLinkService;
import com.vikadata.api.space.service.ISpaceRoleService;
import com.vikadata.core.support.ResponseData;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.shared.constants.PageConstants.PAGE_DESC;
import static com.vikadata.api.shared.constants.PageConstants.PAGE_PARAM;
import static com.vikadata.api.shared.constants.PageConstants.PAGE_SIMPLE_EXAMPLE;

@RestController
@Api(tags = "Space - Sub Admin Api")
@ApiResource(path = "/space")
public class SpaceSubAdminController {

    @Resource
    private ISpaceRoleService iSpaceRoleService;

    @Resource
    private UserSpaceService userSpaceService;

    @Resource
    private ISpaceInviteLinkService iSpaceInviteLinkService;

    @GetResource(path = "/listRole", tags = "READ_SUB_ADMIN")
    @ApiOperation(value = "Query admins", notes = "Page query sub admin." + PAGE_DESC)
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
            @ApiImplicitParam(name = PAGE_PARAM, value = "paging parameters", required = true, dataTypeClass = String.class, paramType = "query", example = PAGE_SIMPLE_EXAMPLE)
    })
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public ResponseData<PageInfo<SpaceRoleVo>> listRole(@PageObjectParam Page page) {
        String spaceId = LoginContext.me().getSpaceId();
        PageInfo<SpaceRoleVo> pageResult = iSpaceRoleService.roleList(spaceId, page);
        return ResponseData.success(pageResult);
    }

    @GetResource(path = { "/getRoleDetail" }, tags = "UPDATE_SUB_ADMIN")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    @ApiOperation(value = "query admin detail")
    @SuppressWarnings("unchecked")
    public ResponseData<SpaceRoleDetailVo> getRoleDetail(@RequestParam(name = "memberId") Long memberId) {
        String spaceId = LoginContext.me().getSpaceId();
        SpaceRoleDetailVo spaceRoleDetailVo = iSpaceRoleService.getRoleDetail(spaceId, memberId);
        return ResponseData.success(spaceRoleDetailVo);
    }

    @Notification(templateId = NotificationTemplateId.ADD_SUB_ADMIN)
    @PostResource(path = "/addRole", tags = "CREATE_SUB_ADMIN")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    @ApiOperation(value = "Create space role")
    @SuppressWarnings("rawtypes")
    public ResponseData addRole(@RequestBody @Valid AddSpaceRoleRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        // check whether the resource is disabled
        iSpaceRoleService.checkAdminResourceChangeAllow(spaceId, data.getResourceCodes());
        // to find the limit
        // iSubscriptionService.checkSubAdmins(spaceId);
        iSpaceRoleService.createRole(spaceId, data);
        // delete the relevant cache
        TaskManager.me().execute(() -> userSpaceService.delete(spaceId, data.getMemberIds()));
        return ResponseData.success();
    }

    @PostResource(path = "/editRole", tags = "UPDATE_SUB_ADMIN")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    @ApiOperation(value = "Edite space role")
    @SuppressWarnings("rawtypes")
    public ResponseData editRole(@RequestBody @Valid UpdateSpaceRoleRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        // check whether the resource is disabled
        iSpaceRoleService.checkAdminResourceChangeAllow(spaceId, data.getResourceCodes());
        iSpaceRoleService.edit(spaceId, data);
        // delete the relevant cache
        TaskManager.me().execute(() -> userSpaceService.delete(spaceId, CollUtil.newArrayList(data.getMemberId())));
        return ResponseData.success();
    }

    @Notification(templateId = NotificationTemplateId.CHANGE_ORDINARY_USER)
    @PostResource(path = "/deleteRole/{memberId}", method = RequestMethod.DELETE, tags = "DELETE_SUB_ADMIN")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    @ApiOperation(value = "delete admin", notes = "delete admin")
    @SuppressWarnings("rawtypes")
    public ResponseData deleteRole(@PathVariable("memberId") Long memberId) {
        String spaceId = LoginContext.me().getSpaceId();
        iSpaceRoleService.deleteRole(spaceId, memberId);
        // delete the relevant cache
        TaskManager.me().execute(() -> userSpaceService.delete(spaceId, CollUtil.newArrayList(memberId)));
        // If the switch of inviting all members in this space is turned off, all public invitation links generated by this member become invalid
        TaskManager.me().execute(() -> iSpaceInviteLinkService.delByMemberIdIfNotInvite(spaceId, memberId));
        // send notification
        NotificationRenderFieldHolder.set(NotificationRenderField.builder().playerIds(ListUtil.toList(memberId)).build());
        return ResponseData.success();
    }
}
