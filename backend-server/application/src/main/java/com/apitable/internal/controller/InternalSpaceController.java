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

import com.apitable.core.support.ResponseData;
import com.apitable.internal.service.InternalSpaceService;
import com.apitable.internal.vo.InternalSpaceApiUsageVo;
import com.apitable.internal.vo.InternalSpaceCapacityVo;
import com.apitable.internal.vo.InternalSpaceInfoVo;
import com.apitable.internal.vo.InternalSpaceSubscriptionVo;
import com.apitable.internal.vo.InternalSpaceUsageVo;
import com.apitable.organization.service.IMemberService;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.context.SessionContext;
import com.apitable.space.service.ISpaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import javax.annotation.Resource;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

/**
 * Internal Service - Space Interface.
 */
@RestController
@Tag(name = "Internal Service - Space Interface")
@ApiResource(path = "/internal")
public class InternalSpaceController {

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private InternalSpaceService internalSpaceService;

    @Resource
    private IMemberService iMemberService;

    /**
     * Get attachment capacity information for a space.
     */
    @GetResource(path = "/space/{spaceId}/capacity", requiredLogin = false)
    @Operation(summary = "get attachment capacity information for a space")
    @Parameter(name = "spaceId", description = "space id", required = true, schema =
        @Schema(type = "string"), in = ParameterIn.PATH, example = "spczJrh2i3tLW")
    public ResponseData<InternalSpaceCapacityVo> getSpaceCapacity(
        @PathVariable("spaceId") String spaceId) {
        InternalSpaceCapacityVo vo = iSpaceService.getSpaceCapacityVo(spaceId);
        vo.setIsAllowOverLimit(true);
        return ResponseData.success(vo);
    }

    /**
     * Get subscription information for a space.
     */
    @GetResource(path = "/space/{spaceId}/subscription", requiredLogin = false)
    @Operation(summary = "get subscription information for a space")
    @Parameter(name = "spaceId", description = "space id", required = true, schema =
        @Schema(type = "string"), in = ParameterIn.PATH, example = "spczJrh2i3tLW")
    public ResponseData<InternalSpaceSubscriptionVo> getSpaceSubscription(
        @PathVariable("spaceId") String spaceId) {
        return ResponseData.success(internalSpaceService.getSpaceEntitlementVo(spaceId));
    }

    /**
     * Get space used usage information.
     */
    @GetResource(path = "/space/{spaceId}/usages", requiredLogin = false)
    @Operation(summary = "get space used usage information")
    @Parameter(name = "spaceId", description = "space id", required = true, schema =
        @Schema(type = "string"), in = ParameterIn.PATH, example = "spczJrh2i3tLW")
    public ResponseData<InternalSpaceUsageVo> getSpaceUsages(
        @PathVariable("spaceId") String spaceId) {
        return ResponseData.success(iSpaceService.getInternalSpaceUsageVo(spaceId));
    }

    /**
     * Get api usage information of a specified space.
     */
    @GetResource(path = "/space/{spaceId}/apiUsages", requiredPermission = false)
    @Operation(summary = "get api usage information of a specified space", description =
        "Provides the authentication function of the middle layer request, and queries the API "
            + "usage information in the subscription plan corresponding to the space.")
    public ResponseData<InternalSpaceApiUsageVo> apiUsages(
        @PathVariable("spaceId") String spaceId) {
        iSpaceService.checkExist(spaceId);
        Long userId = SessionContext.getUserId();
        iMemberService.checkUserIfInSpace(userId, spaceId);
        return ResponseData.success(internalSpaceService.getSpaceEntitlementApiUsageVo(spaceId));
    }

    /**
     * get space info.
     */
    @GetResource(path = "/space/{spaceId}", requiredPermission = false, requiredLogin = false)
    @Operation(summary = "get space information")
    public ResponseData<InternalSpaceInfoVo> labs(@PathVariable("spaceId") String spaceId) {
        iSpaceService.checkExist(spaceId);
        return ResponseData.success(internalSpaceService.getSpaceInfo(spaceId));
    }
}
