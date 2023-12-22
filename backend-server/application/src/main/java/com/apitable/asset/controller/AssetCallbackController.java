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
import com.apitable.asset.ro.AssetUploadNotifyRO;
import com.apitable.asset.service.IAssetCallbackService;
import com.apitable.asset.vo.AssetUploadResult;
import com.apitable.base.model.WidgetUploadNotifyRO;
import com.apitable.core.support.ResponseData;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import java.util.List;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Attachment callback interface.
 *
 * @author Chambers
 */
@RestController
@Tag(name = "Basic module - accessory callback interface")
@ApiResource(path = "/asset")
public class AssetCallbackController {

    @Resource
    private IAssetCallbackService iAssetCallbackService;

    /**
     * Resource upload completion notification callback.
     */
    @PostResource(path = "/upload/callback", requiredLogin = false)
    @Operation(summary = "Resource upload completion notification callback",
        description = "After S3 completes the client upload, "
            + "it actively reaches the notification server")
    public ResponseData<List<AssetUploadResult>> notifyCallback(
        @RequestBody final AssetUploadNotifyRO body) {
        return ResponseData.success(
            iAssetCallbackService.loadAssetUploadResult(
                AssetType.of(body.getType()), body.getResourceKeys()));
    }

    /**
     * widget upload callback.
     */
    @PostResource(path = "/widget/uploadCallback", requiredLogin = false)
    @Operation(summary = "widget upload callback")
    public ResponseData<Void> widgetCallback(
        @RequestBody final WidgetUploadNotifyRO body) {
        iAssetCallbackService.widgetCallback(body.getResourceKeys());
        return ResponseData.success();
    }
}
