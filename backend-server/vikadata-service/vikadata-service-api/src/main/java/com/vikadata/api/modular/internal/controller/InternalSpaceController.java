package com.vikadata.api.modular.internal.controller;

import javax.annotation.Resource;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.modular.finance.service.ISpaceSubscriptionService;
import com.vikadata.api.modular.internal.model.InternalSpaceApiUsageVo;
import com.vikadata.api.modular.internal.model.InternalSpaceCapacityVo;
import com.vikadata.api.modular.internal.model.InternalSpaceSubscriptionVo;
import com.vikadata.api.modular.internal.model.InternalSpaceUsageVo;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.statics.service.IStaticsService;
import com.vikadata.api.util.billing.BillingConfigManager;
import com.vikadata.api.util.billing.model.BillingPlanFeature;
import com.vikadata.api.util.billing.model.SubscribePlanInfo;
import com.vikadata.core.support.ResponseData;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * 内部服务-空间接口
 * </p>
 *
 * @author Chambers
 * @date 2021/4/14
 */
@RestController
@Api(tags = "内部服务-空间接口")
@ApiResource(path = "/internal")
public class InternalSpaceController {

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private ISpaceSubscriptionService iSpaceSubscriptionService;

    @Resource
    private IStaticsService iStaticsService;

    @GetResource(path = "/space/{spaceId}/capacity", requiredLogin = false)
    @ApiOperation(value = "获取空间的附件容量信息")
    @ApiImplicitParam(name = "spaceId", value = "空间ID", required = true, dataTypeClass = String.class, paramType = "path", example = "spczJrh2i3tLW")
    public ResponseData<InternalSpaceCapacityVo> getSpaceCapacity(@PathVariable("spaceId") String spaceId) {
        InternalSpaceCapacityVo vo = iSpaceService.getSpaceCapacityVo(spaceId);
        vo.setIsAllowOverLimit(true);
        return ResponseData.success(vo);
    }

    @GetResource(path = "/space/{spaceId}/subscription", requiredLogin = false)
    @ApiOperation(value = "获取空间的订阅信息")
    @ApiImplicitParam(name = "spaceId", value = "空间ID", required = true, dataTypeClass = String.class, paramType = "path", example = "spczJrh2i3tLW")
    public ResponseData<InternalSpaceSubscriptionVo> getSpaceSubscription(@PathVariable("spaceId") String spaceId) {
        return ResponseData.success(iSpaceSubscriptionService.getSpaceSubscriptionVo(spaceId));
    }

    @GetResource(path = "/space/{spaceId}/usages", requiredLogin = false)
    @ApiOperation(value = "获取空间的用量信息")
    @ApiImplicitParam(name = "spaceId", value = "空间ID", required = true, dataTypeClass = String.class, paramType = "path", example = "spczJrh2i3tLW")
    public ResponseData<InternalSpaceUsageVo> getSpaceUsages(@PathVariable("spaceId") String spaceId) {
        return ResponseData.success(iSpaceService.getInternalSpaceUsageVo(spaceId));
    }

    @GetResource(path = "/space/{spaceId}/apiUsages", requiredLogin = false)
    @ApiOperation(value = "获取指定空间的API用量信息", notes = "提供中间层请求鉴权作用，查询空间对应的订阅计划里API用量信息")
    public ResponseData<InternalSpaceApiUsageVo> apiUsages(@PathVariable("spaceId") String spaceId) {
        InternalSpaceApiUsageVo result = new InternalSpaceApiUsageVo();
        SubscribePlanInfo planInfo = iSpaceSubscriptionService.getPlanInfoBySpaceId(spaceId);
        BillingPlanFeature planFeature = BillingConfigManager.buildPlanFeature(planInfo.getBasePlan(), planInfo.getAddOnPlans());
        result.setMaxApiUsageCount(planFeature.getMaxApiCall());
        result.setApiUsageUsedCount(iStaticsService.getCurrentMonthApiUsage(spaceId));
        result.setIsAllowOverLimit(true);
        return ResponseData.success(result);
    }
}
