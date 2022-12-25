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

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.notification.annotation.Notification;
import com.apitable.shared.util.page.PageObjectParam;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.cache.service.UserSpaceCacheService;
import com.apitable.shared.component.TaskManager;
import com.apitable.shared.component.notification.NotificationRenderField;
import com.apitable.shared.component.notification.NotificationTemplateId;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.holder.NotificationRenderFieldHolder;
import com.apitable.shared.util.page.PageInfo;
import com.apitable.space.ro.AddSpaceRoleRo;
import com.apitable.space.ro.UpdateSpaceRoleRo;
import com.apitable.space.vo.SpaceRoleDetailVo;
import com.apitable.space.vo.SpaceRoleVo;
import com.apitable.space.service.ISpaceInviteLinkService;
import com.apitable.space.service.ISpaceRoleService;
import com.apitable.core.support.ResponseData;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.apitable.shared.constants.PageConstants.PAGE_DESC;
import static com.apitable.shared.constants.PageConstants.PAGE_PARAM;
import static com.apitable.shared.constants.PageConstants.PAGE_SIMPLE_EXAMPLE;

@RestController
@Api(tags = "Space - Sub Admin Api")
@ApiResource(path = "/space")
public class SpaceSubAdminController {

    @Resource
    private ISpaceRoleService iSpaceRoleService;

    @Resource
    private UserSpaceCacheService userSpaceCacheService;

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
    public ResponseData<SpaceRoleDetailVo> getRoleDetail(@RequestParam(name = "memberId") Long memberId) {
        String spaceId = LoginContext.me().getSpaceId();
        SpaceRoleDetailVo spaceRoleDetailVo = iSpaceRoleService.getRoleDetail(spaceId, memberId);
        return ResponseData.success(spaceRoleDetailVo);
    }

    @Notification(templateId = NotificationTemplateId.ADD_SUB_ADMIN)
    @PostResource(path = "/addRole", tags = "CREATE_SUB_ADMIN")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    @ApiOperation(value = "Create space role")
    public ResponseData<Void> addRole(@RequestBody @Valid AddSpaceRoleRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        // check whether the resource is disabled
        iSpaceRoleService.checkAdminResourceChangeAllow(spaceId, data.getResourceCodes());
        // to find the limit
        // iSubscriptionService.checkSubAdmins(spaceId);
        iSpaceRoleService.createRole(spaceId, data);
        // delete the relevant cache
        TaskManager.me().execute(() -> userSpaceCacheService.delete(spaceId, data.getMemberIds()));
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
        TaskManager.me().execute(() -> userSpaceCacheService.delete(spaceId, CollUtil.newArrayList(data.getMemberId())));
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
        TaskManager.me().execute(() -> userSpaceCacheService.delete(spaceId, CollUtil.newArrayList(memberId)));
        // If the switch of inviting all members in this space is turned off, all public invitation links generated by this member become invalid
        TaskManager.me().execute(() -> iSpaceInviteLinkService.delByMemberIdIfNotInvite(spaceId, memberId));
        // send notification
        NotificationRenderFieldHolder.set(NotificationRenderField.builder().playerIds(ListUtil.toList(memberId)).build());
        return ResponseData.success();
    }
}
