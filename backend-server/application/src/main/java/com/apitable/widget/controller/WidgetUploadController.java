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

package com.apitable.widget.controller;

import com.apitable.base.model.WidgetAssetUploadCertificateRO;
import com.apitable.base.model.WidgetUploadMetaVo;
import com.apitable.base.model.WidgetUploadTokenVo;
import com.apitable.core.support.ResponseData;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.context.SessionContext;
import com.apitable.widget.service.IWidgetUploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Widget Upload API.
 */
@RestController
@Tag(name = "Widget Upload API")
@ApiResource
public class WidgetUploadController {

    @Resource
    private IWidgetUploadService iWidgetUploadService;

    @PostResource(path = "/asset/widget/uploadMeta", requiredPermission = false)
    @Operation(summary = "get widget upload meta", description = "get widget upload meta")
    public ResponseData<WidgetUploadMetaVo> getWidgetUploadMeta() {
        return ResponseData.success(iWidgetUploadService.getWidgetUploadMetaVo());
    }

    /**
     * Get widget file upload pre signed url.
     */
    @PostResource(path = "/asset/widget/{packageId}/uploadPreSignedUrl",
        requiredPermission = false)
    @Operation(summary = "Get widget file upload pre signed url")
    public ResponseData<List<WidgetUploadTokenVo>> generateWidgetPreSignedUrl(
        @PathVariable("packageId") String packageId,
        @RequestBody @Valid WidgetAssetUploadCertificateRO data
    ) {
        Long userId = SessionContext.getUserId();
        List<WidgetUploadTokenVo> certificates =
            iWidgetUploadService.createWidgetAssetPreSignedUrl(userId, packageId, data);
        return ResponseData.success(certificates);
    }
}
