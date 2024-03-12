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

package com.apitable.internal.controller;

import com.apitable.asset.enums.AssetType;
import com.apitable.asset.service.IAssetCallbackService;
import com.apitable.asset.service.IAssetUploadTokenService;
import com.apitable.asset.vo.AssetUploadCertificateVO;
import com.apitable.asset.vo.AssetUploadResult;
import com.apitable.asset.vo.AssetUrlSignatureVo;
import com.apitable.core.support.ResponseData;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.context.SessionContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import java.util.Collections;
import java.util.List;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Internal - Asset API.
 */
@RestController
@ApiResource(path = "/internal/asset")
@Tag(name = "Internal")
public class InternalAssetController {

    @Resource
    private IAssetUploadTokenService iAssetUploadTokenService;

    @Resource
    private IAssetCallbackService iAssetCallbackService;

    /**
     * Get Upload PreSigned URL.
     */
    @GetResource(path = "/upload/preSignedUrl", requiredPermission = false)
    @Operation(summary = "Get Upload PreSigned URL")
    @Parameters({
        @Parameter(name = "nodeId", description = "node custom id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "dst123"),
        @Parameter(name = "count", description = "number to create (default 1, max 20)",
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "2")
    })
    public ResponseData<List<AssetUploadCertificateVO>> getSpaceCapacity(
        @RequestParam("nodeId") String nodeId,
        @RequestParam(name = "count", defaultValue = "1") Integer count) {
        Long userId = SessionContext.getUserId();
        return ResponseData.success(
            iAssetUploadTokenService.createSpaceAssetPreSignedUrl(userId, nodeId,
                AssetType.DATASHEET.getValue(), count));
    }

    /**
     * Get Asset Info.
     */
    @GetResource(path = "/get", requiredLogin = false)
    @Operation(summary = "Get Asset Info", description = "scene：Fusion server query the "
        + "attachment field data before writing")
    @Parameter(name = "token", description = "resource key", required = true, schema = @Schema(type =
        "string"), in = ParameterIn.QUERY, example = "space/2019/12/10/159")
    public ResponseData<AssetUploadResult> get(@RequestParam("token") String token) {
        // load asset upload result
        List<AssetUploadResult> results =
            iAssetCallbackService.loadAssetUploadResult(AssetType.DATASHEET,
                Collections.singletonList(token));
        return ResponseData.success(results.stream().findFirst().orElse(null));
    }

    @GetResource(path = "/signatures", requiredLogin = false)
    @Operation(summary = "Batch get asset signature url")
    public ResponseData<List<AssetUrlSignatureVo>> getSignatureUrls(
        @RequestParam("resourceKeys") final List<String> resourceKeys) {
        return ResponseData.success(iAssetUploadTokenService.getAssetUrlSignatureVos(resourceKeys));
    }
}
