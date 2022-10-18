package com.vikadata.api.modular.base.controller;

import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.attach.AssetType;
import com.vikadata.api.enums.exception.AuthException;
import com.vikadata.api.model.ro.asset.AssetUploadTokenRo;
import com.vikadata.api.model.vo.asset.AssetUploadTokenVo;
import com.vikadata.api.modular.base.model.AssetUploadCertificateRO;
import com.vikadata.api.modular.base.model.AssetUploadCertificateVO;
import com.vikadata.api.modular.base.model.WidgetAssetUploadCertificateRO;
import com.vikadata.api.modular.base.model.WidgetUploadMetaVo;
import com.vikadata.api.modular.base.model.WidgetUploadTokenVo;
import com.vikadata.api.modular.base.service.IAssetService;
import com.vikadata.api.modular.base.service.IAssetUploadTokenService;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * 附件上传Token接口
 * </p>
 *
 * @author Pengap
 * @date 2022/4/6 16:43:14
 */
@RestController
@Api(tags = "基础模块_附件上传Token接口")
@ApiResource(path = "/asset")
public class AttachUploadTokenController {

    @Resource
    private IAssetService iAssetService;

    @Resource
    private IAssetUploadTokenService iAssetUploadTokenService;

    @PostResource(name = "获取上传资源令牌", path = "/widget/{nodeId}/uploadToken", requiredPermission = false)
    @ApiOperation(value = "获取上传资源令牌 assets", notes = "获取上传令牌，用于前端直传")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "nodeId", value = "节点ID", required = true, dataTypeClass = String.class, paramType = "path", example = "wpk123456")
    })
    public ResponseData<AssetUploadTokenVo> createWidgetAssetsUploadToken(@PathVariable String nodeId, @RequestBody @Valid AssetUploadTokenRo assetUploadTokenRo) {
        Long userId = SessionContext.getUserId();
        return ResponseData.success(iAssetUploadTokenService.createWidgetAssetsUploadToken(userId, nodeId, assetUploadTokenRo));
    }

    @PostResource(name = "获取上传预签名URL", path = "/upload/preSignedUrl", requiredLogin = false)
    @ApiOperation(value = "获取上传预签名URL")
    public ResponseData<List<AssetUploadCertificateVO>> generatePreSignedUrl(@RequestBody @Valid AssetUploadCertificateRO data) {
        // When not logged in, perform human-machine verification
        Long userId = SessionContext.getUserIdWithoutException();
        if (userId == null) {
            iAssetService.checkBeforeUpload(data.getNodeId(), data.getData());
        }
        if (AssetType.isPublishAsset(data.getType())) {
            // Upload user avatar, space LOGO, must be logged in
            ExceptionUtil.isNotNull(userId, AuthException.UNAUTHORIZED);
            AssetUploadCertificateVO certificate = iAssetUploadTokenService.createPublishAssetPreSignedUrl();
            return ResponseData.success(Collections.singletonList(certificate));
        }
        // Batch Creation of Space Resource Upload Credentials
        return ResponseData.success(iAssetUploadTokenService.createSpaceAssetPreSignedUrl(userId, data.getNodeId(), data.getType(), data.getCount()));
    }

    @PostResource(name = "get widget upload meta", path = "/widget/uploadMeta", requiredPermission = false)
    @ApiOperation(value = "get widget upload meta", notes = "get widget upload meta")
    public ResponseData<WidgetUploadMetaVo> getWidgetUploadMeta() {
        return ResponseData.success(iAssetUploadTokenService.getWidgetUploadMetaVo());
    }

    @PostResource(name = "Get widget file upload pre signed url", path = "/widget/{packageId}/uploadPreSignedUrl", requiredPermission = false)
    @ApiOperation(value = "Get widget file upload pre signed url")
    public ResponseData<List<WidgetUploadTokenVo>> generateWidgetPreSignedUrl(@PathVariable("packageId") String packageId, @RequestBody @Valid WidgetAssetUploadCertificateRO data) {
        Long userId = SessionContext.getUserId();
        List<WidgetUploadTokenVo> certificates = iAssetUploadTokenService.createWidgetAssetPreSignedUrl(userId, packageId, data);
        return ResponseData.success(certificates);
    }

}
