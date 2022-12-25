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

import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.apitable.asset.enums.AssetType;
import com.apitable.asset.service.IAssetCallbackService;
import com.apitable.asset.service.IAssetUploadTokenService;
import com.apitable.asset.vo.AssetUploadCertificateVO;
import com.apitable.asset.vo.AssetUploadResult;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.context.SessionContext;
import com.apitable.core.support.ResponseData;

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
