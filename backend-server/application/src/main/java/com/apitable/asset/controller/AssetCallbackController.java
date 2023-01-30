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

import java.util.List;

import javax.annotation.Resource;

import com.apitable.asset.enums.AssetType;
import com.apitable.asset.ro.AssetUploadNotifyRO;
import com.apitable.asset.service.IAssetCallbackService;
import com.apitable.asset.vo.AssetUploadResult;
import com.apitable.base.model.WidgetUploadNotifyRO;
import com.apitable.core.support.ResponseData;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Attachment callback interface.
 *
 * @author Chambers
 */
@RestController
@Api(tags = "Basic module - accessory callback interface")
@ApiResource(path = "/asset")
public class AssetCallbackController {

    @Resource
    private IAssetCallbackService iAssetCallbackService;

    @PostResource(name = "Resource upload completion notification callback",
        path = "/upload/callback", requiredLogin = false)
    @ApiOperation(value = "Resource upload completion notification callback",
        notes = "After S3 completes the client upload, "
            + "it actively reaches the notification server")
    public ResponseData<List<AssetUploadResult>> notifyCallback(
        @RequestBody AssetUploadNotifyRO body) {
        return ResponseData.success(
            iAssetCallbackService.loadAssetUploadResult(
                AssetType.of(body.getType()), body.getResourceKeys()));
    }

    @PostResource(name = "widget upload callback",
        path = "/widget/uploadCallback", requiredLogin = false)
    @ApiOperation(value = "widget upload callback")
    public ResponseData<Void> widgetCallback(
        @RequestBody WidgetUploadNotifyRO body) {
        iAssetCallbackService.widgetCallback(body.getResourceKeys());
        return ResponseData.success();
    }
}
