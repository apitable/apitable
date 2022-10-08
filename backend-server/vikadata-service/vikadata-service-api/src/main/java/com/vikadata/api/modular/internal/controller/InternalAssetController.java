package com.vikadata.api.modular.internal.controller;

import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.attach.AssetType;
import com.vikadata.api.model.vo.asset.AssetUploadResult;
import com.vikadata.api.modular.base.model.AssetUploadCertificateVO;
import com.vikadata.api.modular.base.service.IAssetCallbackService;
import com.vikadata.api.modular.base.service.IAssetUploadTokenService;
import com.vikadata.core.support.ResponseData;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * Internal Server - Asset API
 * </p>
 *
 * @author Chambers
 * @date 2022/8/20
 */
@RestController
@ApiResource(path = "/internal/asset")
@Api(tags = "Internal Server - Asset API")
public class InternalAssetController {

    @Resource
    private IAssetUploadTokenService iAssetUploadTokenService;

    @Resource
    private IAssetCallbackService iAssetCallbackService;

    @GetResource(path = "/upload/preSignedUrl", requiredPermission = false)
    @ApiOperation(value = "Get Upload PreSigned URL")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "nodeId", value = "node custom id", required = true, dataTypeClass = String.class, paramType = "query", example = "dst123"),
            @ApiImplicitParam(name = "count", value = "number to create (default 1, max 20)", dataTypeClass = String.class, paramType = "query", example = "2")
    })
    public ResponseData<List<AssetUploadCertificateVO>> getSpaceCapacity(@RequestParam("nodeId") String nodeId, @RequestParam(name = "count", defaultValue = "1") Integer count) {
        Long userId = SessionContext.getUserId();
        return ResponseData.success(iAssetUploadTokenService.createSpaceAssetPreSignedUrl(userId, nodeId, AssetType.DATASHEET.getValue(), count));
    }

    @GetResource(name = "Get Asset Info", path = "/get", requiredLogin = false)
    @ApiOperation(value = "Get Asset Info", notes = "scene：Fusion server query the attachment field data before writing")
    @ApiImplicitParam(name = "token", value = "resource key", required = true, dataTypeClass = String.class, paramType = "query", example = "space/2019/12/10/159")
    public ResponseData<AssetUploadResult> get(@RequestParam("token") String token) {
        // load asset upload result
        List<AssetUploadResult> results = iAssetCallbackService.loadAssetUploadResult(AssetType.DATASHEET, Collections.singletonList(token));
        return ResponseData.success(results.stream().findFirst().orElse(null));
    }
}
