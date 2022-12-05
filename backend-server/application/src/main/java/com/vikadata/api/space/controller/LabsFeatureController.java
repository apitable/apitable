package com.vikadata.api.space.controller;

import javax.annotation.Resource;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.space.service.ILabsFeatureService;
import com.vikadata.api.space.vo.UserSpaceLabsFeatureVo;
import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.GetResource;
import com.vikadata.core.support.ResponseData;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * Laboratory module experimental function interface
 * </p>
 */
@RestController
@Api(tags = "Laboratory module_ Experimental function interface")
@ApiResource(path = "/labs")
@Slf4j
public class LabsFeatureController {

    @Resource
    private ILabsFeatureService iLabsFeatureService;

    @GetResource(name = "Get Lab Function List", path = "/features", requiredPermission = false)
    @ApiOperation(value = "Get Lab Function List", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<UserSpaceLabsFeatureVo> showAvailableLabsFeatures() {
        // Get a list of available experiments
        return ResponseData.success(iLabsFeatureService.getAvailableLabsFeature());
    }
}
