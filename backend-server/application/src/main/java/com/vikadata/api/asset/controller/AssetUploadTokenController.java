package com.vikadata.api.asset.controller;

import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.asset.enums.AssetType;
import com.vikadata.api.asset.service.IAssetService;
import com.vikadata.api.asset.service.IAssetUploadTokenService;
import com.vikadata.api.base.enums.AuthException;
import com.vikadata.api.base.model.AssetUploadCertificateRO;
import com.vikadata.api.base.model.AssetUploadCertificateVO;
import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.PostResource;
import com.vikadata.api.shared.context.SessionContext;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Attachment upload token interface
 */
@RestController
@Api(tags = "Basics - Attachment upload token interface")
@ApiResource(path = "/asset")
public class AssetUploadTokenController {

    @Resource
    private IAssetService iAssetService;

    @Resource
    private IAssetUploadTokenService iAssetUploadTokenService;

    @PostResource(name = "Get upload presigned URL", path = "/upload/preSignedUrl", requiredLogin = false)
    @ApiOperation(value = "Get upload presigned URL")
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

}
