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

package com.apitable.internal.controller;

import javax.annotation.Resource;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;

import com.apitable.internal.vo.InternalSpaceApiUsageVo;
import com.apitable.internal.vo.InternalSpaceCapacityVo;
import com.apitable.internal.vo.InternalSpaceSubscriptionVo;
import com.apitable.internal.vo.InternalSpaceUsageVo;
import com.apitable.internal.service.InternalSpaceService;
import com.apitable.organization.service.IMemberService;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.context.SessionContext;
import com.apitable.space.service.ISpaceService;
import com.apitable.core.support.ResponseData;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

/**
 * Internal Service - Space Interface
 */
@RestController
@Api(tags = "Internal Service - Space Interface")
@ApiResource(path = "/internal")
public class InternalSpaceController {

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private InternalSpaceService internalSpaceService;

    @Resource
    private IMemberService iMemberService;

    @GetResource(path = "/space/{spaceId}/capacity", requiredLogin = false)
    @ApiOperation(value = "get attachment capacity information for a space")
    @ApiImplicitParam(name = "spaceId", value = "space id", required = true, dataTypeClass = String.class, paramType = "path", example = "spczJrh2i3tLW")
    public ResponseData<InternalSpaceCapacityVo> getSpaceCapacity(@PathVariable("spaceId") String spaceId) {
        InternalSpaceCapacityVo vo = iSpaceService.getSpaceCapacityVo(spaceId);
        vo.setIsAllowOverLimit(true);
        return ResponseData.success(vo);
    }

    @GetResource(path = "/space/{spaceId}/subscription", requiredLogin = false)
    @ApiOperation(value = "get subscription information for a space")
    @ApiImplicitParam(name = "spaceId", value = "space id", required = true, dataTypeClass = String.class, paramType = "path", example = "spczJrh2i3tLW")
    public ResponseData<InternalSpaceSubscriptionVo> getSpaceSubscription(@PathVariable("spaceId") String spaceId) {
        return ResponseData.success(internalSpaceService.getSpaceEntitlementVo(spaceId));
    }

    @GetResource(path = "/space/{spaceId}/usages", requiredLogin = false)
    @ApiOperation(value = "get space used usage information")
    @ApiImplicitParam(name = "spaceId", value = "space id", required = true, dataTypeClass = String.class, paramType = "path", example = "spczJrh2i3tLW")
    public ResponseData<InternalSpaceUsageVo> getSpaceUsages(@PathVariable("spaceId") String spaceId) {
        return ResponseData.success(iSpaceService.getInternalSpaceUsageVo(spaceId));
    }

    @GetResource(path = "/space/{spaceId}/apiUsages", requiredPermission = false)
    @ApiOperation(value = "get api usage information of a specified space", notes = "Provides the authentication function of the middle layer request, and queries the API usage information in the subscription plan corresponding to the space.")
    public ResponseData<InternalSpaceApiUsageVo> apiUsages(@PathVariable("spaceId") String spaceId) {
        iSpaceService.checkExist(spaceId);
        Long userId = SessionContext.getUserId();
        iMemberService.checkUserIfInSpace(userId, spaceId);
        return ResponseData.success(internalSpaceService.getSpaceEntitlementApiUsageVo(spaceId));
    }
}
