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

import static com.apitable.shared.constants.PageConstants.PAGE_DESC;
import static com.apitable.shared.constants.PageConstants.PAGE_PARAM;
import static com.apitable.shared.constants.PageConstants.PAGE_SIMPLE_EXAMPLE;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import com.apitable.core.support.ResponseData;
import com.apitable.shared.cache.service.UserSpaceCacheService;
import com.apitable.shared.component.TaskManager;
import com.apitable.shared.component.notification.NotificationRenderField;
import com.apitable.shared.component.notification.NotificationTemplateId;
import com.apitable.shared.component.notification.annotation.Notification;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.holder.NotificationRenderFieldHolder;
import com.apitable.shared.util.page.PageInfo;
import com.apitable.shared.util.page.PageObjectParam;
import com.apitable.space.mapper.SpaceResourceMapper;
import com.apitable.space.ro.AddSpaceRoleRo;
import com.apitable.space.ro.UpdateSpaceRoleRo;
import com.apitable.space.service.ISpaceInviteLinkService;
import com.apitable.space.service.ISpaceResourceService;
import com.apitable.space.service.ISpaceRoleService;
import com.apitable.space.vo.SpaceRoleDetailVo;
import com.apitable.space.vo.SpaceRoleVo;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Space - Sub Admin Api.
 */
@RestController
@Tag(name = "Space - Sub Admin Api")
@ApiResource(path = "/space")
public class SpaceSubAdminController {

    @Resource
    private ISpaceRoleService iSpaceRoleService;

    @Resource
    private UserSpaceCacheService userSpaceCacheService;

    @Resource
    private ISpaceInviteLinkService iSpaceInviteLinkService;

    @Resource
    private SpaceResourceMapper spaceResourceMapper;

    @Resource
    private ISpaceResourceService iSpaceResourceService;

    /**
     * Query admins.
     */
    @GetResource(path = "/listRole", tags = "READ_SUB_ADMIN")
    @Operation(summary = "Query admins", description = "Page query sub admin." + PAGE_DESC)
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl"),
        @Parameter(name = PAGE_PARAM, description = "paging parameters", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = PAGE_SIMPLE_EXAMPLE)
    })
    @SuppressWarnings({"rawtypes", "unchecked"})
    public ResponseData<PageInfo<SpaceRoleVo>> listRole(@PageObjectParam Page page) {
        String spaceId = LoginContext.me().getSpaceId();
        PageInfo<SpaceRoleVo> pageResult = iSpaceRoleService.roleList(spaceId, page);
        return ResponseData.success(pageResult);
    }

    /**
     * Query admin detail.
     */
    @GetResource(path = {"/getRoleDetail"}, tags = "UPDATE_SUB_ADMIN")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl")
    @Operation(summary = "query admin detail")
    public ResponseData<SpaceRoleDetailVo> getRoleDetail(
        @RequestParam(name = "memberId") Long memberId) {
        String spaceId = LoginContext.me().getSpaceId();
        SpaceRoleDetailVo spaceRoleDetailVo = iSpaceRoleService.getRoleDetail(spaceId, memberId);
        return ResponseData.success(spaceRoleDetailVo);
    }

    /**
     * Create space role.
     */
    @Notification(templateId = NotificationTemplateId.ADD_SUB_ADMIN)
    @PostResource(path = "/addRole", tags = "CREATE_SUB_ADMIN")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl")
    @Operation(summary = "Create space role")
    public ResponseData<Void> addRole(@RequestBody @Valid AddSpaceRoleRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        // check whether the resource is disabled
        iSpaceRoleService.checkAdminResourceChangeAllow(spaceId, data.getResourceCodes());
        // assign permissions
        List<String> resourceCodes = spaceResourceMapper.selectResourceCodesByGroupCode(
            CollUtil.distinct(data.getResourceCodes()));
        // Check whether assignable permissions are included to exclude unreasonable permission assignments
        iSpaceResourceService.checkResourceAssignable(resourceCodes);
        // Check whether the currently assigned permission list is owned
        LoginContext.me().checkSpaceResource(resourceCodes);
        iSpaceRoleService.createRole(spaceId, data.getMemberIds(), resourceCodes);
        // delete the relevant cache
        TaskManager.me().execute(() -> userSpaceCacheService.delete(spaceId, data.getMemberIds()));
        return ResponseData.success();
    }

    /**
     * Edite space role.
     */
    @PostResource(path = "/editRole", tags = "UPDATE_SUB_ADMIN")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl")
    @Operation(summary = "Edite space role")
    @SuppressWarnings("rawtypes")
    public ResponseData editRole(@RequestBody @Valid UpdateSpaceRoleRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        // check whether the resource is disabled
        iSpaceRoleService.checkAdminResourceChangeAllow(spaceId, data.getResourceCodes());
        iSpaceRoleService.edit(spaceId, data);
        // delete the relevant cache
        TaskManager.me().execute(
            () -> userSpaceCacheService.delete(spaceId, CollUtil.newArrayList(data.getMemberId())));
        return ResponseData.success();
    }

    /**
     * Delete admin.
     */
    @Notification(templateId = NotificationTemplateId.CHANGE_ORDINARY_USER)
    @PostResource(path = "/deleteRole/{memberId}",
        method = RequestMethod.DELETE, tags = "DELETE_SUB_ADMIN")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl")
    @Operation(summary = "delete admin", description = "delete admin")
    @SuppressWarnings("rawtypes")
    public ResponseData deleteRole(@PathVariable("memberId") Long memberId) {
        String spaceId = LoginContext.me().getSpaceId();
        iSpaceRoleService.deleteRole(spaceId, memberId);
        // delete the relevant cache
        TaskManager.me()
            .execute(() -> userSpaceCacheService.delete(spaceId, CollUtil.newArrayList(memberId)));
        // If the switch of inviting all members in this space is turned off, all public
        // invitation links generated by this member become invalid
        TaskManager.me()
            .execute(() -> iSpaceInviteLinkService.delByMemberIdIfNotInvite(spaceId, memberId));
        // send notification
        NotificationRenderFieldHolder.set(
            NotificationRenderField.builder().playerIds(ListUtil.toList(memberId)).build());
        return ResponseData.success();
    }
}
