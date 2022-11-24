package com.vikadata.api.internal.controller;

import javax.annotation.Resource;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.internal.model.InternalSpaceApiUsageVo;
import com.vikadata.api.internal.model.InternalSpaceCapacityVo;
import com.vikadata.api.internal.model.InternalSpaceSubscriptionVo;
import com.vikadata.api.internal.model.InternalSpaceUsageVo;
import com.vikadata.api.internal.service.InternalSpaceService;
import com.vikadata.api.organization.service.IMemberService;
import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.GetResource;
import com.vikadata.api.shared.context.SessionContext;
import com.vikadata.api.space.service.ISpaceService;
import com.vikadata.core.support.ResponseData;

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
