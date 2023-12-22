/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.asset.controller;

import com.apitable.asset.enums.AssetType;
import com.apitable.asset.ro.AssetUploadCertificateRO;
import com.apitable.asset.ro.AssetUrlSignatureRo;
import com.apitable.asset.service.IAssetService;
import com.apitable.asset.service.IAssetUploadTokenService;
import com.apitable.asset.vo.AssetUploadCertificateVO;
import com.apitable.asset.vo.AssetUrlSignatureVo;
import com.apitable.auth.enums.AuthException;
import com.apitable.core.support.ResponseData;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.context.SessionContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.Collections;
import java.util.List;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Attachment upload token interface.
 */
@RestController
@Tag(name = "Basics - Attachment upload token interface")
@ApiResource(path = "/asset")
public class AssetUploadTokenController {

    @Resource
    private IAssetService iAssetService;

    @Resource
    private IAssetUploadTokenService iAssetUploadTokenService;

    @GetResource(path = "/signature", requiredLogin = false)
    @Operation(summary = "Get asset signature url")
    public ResponseData<String> getSignatureUrl(@RequestParam(value = "token") String token) {
        return ResponseData.success(iAssetUploadTokenService.getSignatureUrl(token));
    }

    @PostResource(path = "/signatures", requiredLogin = false)
    @Operation(summary = "Batch get asset signature url")
    public ResponseData<List<AssetUrlSignatureVo>> getSignatureUrls(
        @RequestBody final AssetUrlSignatureRo data) {
        return ResponseData.success(
            iAssetUploadTokenService.getAssetUrlSignatureVos(data.getResourceKeys()));
    }

    /**
     * Get upload presigned URL.
     */
    @PostResource(path = "/upload/preSignedUrl", requiredLogin = false)
    @Operation(summary = "Get upload presigned URL")
    public ResponseData<List<AssetUploadCertificateVO>> generatePreSignedUrl(
        @RequestBody @Valid AssetUploadCertificateRO data) {
        // When not logged in, perform human-machine verification
        Long userId = SessionContext.getUserIdWithoutException();
        if (userId == null) {
            iAssetService.checkBeforeUpload(data.getNodeId(), data.getData());
        }
        if (AssetType.isPublishAsset(data.getType())) {
            // Upload user avatar, space LOGO, must be logged in
            ExceptionUtil.isNotNull(userId, AuthException.UNAUTHORIZED);
            AssetUploadCertificateVO certificate =
                iAssetUploadTokenService.createPublishAssetPreSignedUrl();
            return ResponseData.success(Collections.singletonList(certificate));
        }
        // Batch Creation of Space Resource Upload Credentials
        return ResponseData.success(
            iAssetUploadTokenService.createSpaceAssetPreSignedUrl(userId, data.getNodeId(),
                data.getType(), data.getCount()));
    }

}
