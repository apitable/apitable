package com.vikadata.api.modular.integral.controller;


import javax.annotation.Resource;

import cn.hutool.json.JSONUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.developer.GmAction;
import com.vikadata.api.modular.developer.service.IGmService;
import com.vikadata.api.modular.integral.enums.IntegralAlterType;
import com.vikadata.api.modular.integral.model.IntegralDeductRo;
import com.vikadata.api.modular.integral.service.IIntegralService;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.core.support.ResponseData;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.constants.IntegralActionCodeConstants.OFFICIAL_ADJUSTMENT;

@RestController
@Api(tags = "用户积分服务接口")
@ApiResource(path = "/integral")
public class IntegralController {

    @Resource
    private IGmService iGmService;

    @Resource
    private IUserService iUserService;

    @Resource
    private IIntegralService iIntegralService;

    @PostResource(path = "/activity/reward", requiredPermission = false)
    @ApiOperation(value = "活动积分奖励")
    public ResponseData<Void> activityReward() {
        // 校验权限
        iGmService.validPermission(SessionContext.getUserId(), GmAction.INTEGRAL_REWARD);
        iIntegralService.activityReward(LoginContext.me().getLoginUser().getNickName());
        return ResponseData.success();
    }

    @GetResource(path = "/get", requiredPermission = false)
    @ApiOperation(value = "查询用户积分")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "userId", value = "用户ID", dataTypeClass = Long.class, paramType = "query", example = "12511"),
            @ApiImplicitParam(name = "areaCode", value = "区号", dataTypeClass = Integer.class, paramType = "query", example = "+1"),
            @ApiImplicitParam(name = "credential", value = "帐号凭证（手机或邮箱）", dataTypeClass = String.class, paramType = "query", example = "xx@gmail.com")
    })
    public ResponseData<Integer> get(@RequestParam(value = "userId", required = false) Long userId,
            @RequestParam(value = "areaCode", required = false) String areaCode,
            @RequestParam(value = "credential", required = false) String credential) {
        // 校验权限
        iGmService.validPermission(SessionContext.getUserId(), GmAction.INTEGRAL_REWARD);
        Long id = userId != null ? userId : (iUserService.getByUsername(areaCode, credential)).getId();
        return ResponseData.success(iIntegralService.getTotalIntegralValueByUserId(id));
    }

    @PostResource(path = "/deduct", requiredPermission = false)
    @ApiOperation(value = "扣除用户积分")
    public ResponseData<Void> deduct(@RequestBody IntegralDeductRo ro) {
        // 校验权限
        iGmService.validPermission(SessionContext.getUserId(), GmAction.INTEGRAL_SUBTRACT);
        // 获取用户ID
        Long userId = ro.getUserId() != null ? ro.getUserId() : (iUserService.getByUsername(ro.getAreaCode(), ro.getCredential())).getId();
        // 扣除用户积分
        iIntegralService.alterIntegral(OFFICIAL_ADJUSTMENT, IntegralAlterType.EXPENSES, ro.getCredit(), userId, JSONUtil.createObj());
        return ResponseData.success();
    }

}
