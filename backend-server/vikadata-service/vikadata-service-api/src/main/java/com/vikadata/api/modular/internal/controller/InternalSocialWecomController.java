package com.vikadata.api.modular.internal.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.modular.social.service.ISocialWecomPermitDelayService;
import com.vikadata.boot.autoconfigure.social.wecom.WeComProperties;
import com.vikadata.boot.autoconfigure.social.wecom.WeComProperties.IsvApp;
import com.vikadata.core.support.ResponseData;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * 内部服务-企微接口
 * </p>
 * @author 刘斌华
 * @date 2022-08-11 14:39:35
 */
@RestController
@Api(tags = "内部服务-企微接口")
@ApiResource(path = "/internal/social/wecom")
public class InternalSocialWecomController {

    @Autowired(required = false)
    private WeComProperties weComProperties;

    @Resource
    private ISocialWecomPermitDelayService socialWecomPermitDelayService;

    @PostResource(path = "/permitDelay/batchProcess", requiredLogin = false)
    @ApiOperation("批量处理待处理的接口许可延时信息")
    public ResponseData<Void> postPermitDelayBatchProcess() {
        List<String> suiteIds = weComProperties.getIsvAppList().stream()
                .map(IsvApp::getSuiteId)
                .collect(Collectors.toList());
        suiteIds.forEach(suiteId -> socialWecomPermitDelayService.batchProcessPending(suiteId));
        return ResponseData.success();
    }

}
