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
 * 内部服务-附件资源相关接口
 * </p>
 *
 * @author Chambers
 * @date 2022/8/20
 */
@RestController
@ApiResource(path = "/internal/asset")
@Api(tags = "内部服务-附件资源相关接口")
public class InternalAssetController {

    @Resource
    private IAssetUploadTokenService iAssetUploadTokenService;

    @Resource
    private IAssetCallbackService iAssetCallbackService;

    @GetResource(path = "/upload/preSignedUrl", requiredPermission = false)
    @ApiOperation(value = "获取上传预签名URL")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "nodeId", value = "节点ID", required = true, dataTypeClass = String.class, paramType = "query", example = "dst123"),
            @ApiImplicitParam(name = "count", value = "创建的数量（默认为1，最大为100）", dataTypeClass = String.class, paramType = "query", example = "2")
    })
    public ResponseData<List<AssetUploadCertificateVO>> getSpaceCapacity(@RequestParam("nodeId") String nodeId, @RequestParam(name = "count", defaultValue = "1") Integer count) {
        Long userId = SessionContext.getUserId();
        return ResponseData.success(iAssetUploadTokenService.createSpaceAssetPreSignedUrl(userId, nodeId, AssetType.DATASHEET.getValue(), count));
    }

    @GetResource(name = "获取资源信息", path = "/get", requiredLogin = false)
    @ApiOperation(value = "获取资源信息", notes = "场景：Fusion附件字段数据写入查询")
    @ApiImplicitParam(name = "resourceKey", value = "资源名", required = true, dataTypeClass = String.class, paramType = "query", example = "2019/12/10/159")
    public ResponseData<AssetUploadResult> get(@RequestParam("token") String token) {
        // 加载资源数据
        List<AssetUploadResult> results = iAssetCallbackService.loadAssetUploadResult(AssetType.DATASHEET, Collections.singletonList(token));
        return ResponseData.success(results.stream().findFirst().orElse(null));
    }
}
