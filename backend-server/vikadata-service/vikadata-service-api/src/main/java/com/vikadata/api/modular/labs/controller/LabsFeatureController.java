package com.vikadata.api.modular.labs.controller;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.model.vo.labs.UserSpaceLabsFeatureVo;
import com.vikadata.api.modular.labs.service.ILabsFeatureService;
import com.vikadata.core.support.ResponseData;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * <p>
 * 实验室模块 实验性功能接口
 * </p>
 *
 * @author 胡海平(Humphrey Hu)
 * @date 2021/10/20 10:31:09
 */
@RestController
@Api(tags = "实验室模块_实验性功能接口")
@ApiResource(path = "/labs")
@Slf4j
public class LabsFeatureController {

    @Resource
    private ILabsFeatureService iLabsFeatureService;

    @GetResource(name = "获取实验室功能列表", path = "/features", requiredPermission = false)
    @ApiOperation(value = "获取实验室功能列表", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<UserSpaceLabsFeatureVo> showAvailableLabsFeatures() {
        // 获取可用的实验性列表
        return ResponseData.success(iLabsFeatureService.getAvailableLabsFeature());
    }
}
