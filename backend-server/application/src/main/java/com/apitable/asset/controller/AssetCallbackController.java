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
import java.util.Optional;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import com.apitable.core.support.ResponseData;
import com.apitable.starter.oss.autoconfigure.OssProperties;
import com.apitable.starter.oss.autoconfigure.OssProperties.Callback;
import com.apitable.starter.oss.autoconfigure.OssProperties.Qiniu;
import com.apitable.starter.oss.core.qiniu.QiniuTemporaryClientTemplate;
import com.apitable.asset.enums.AssetType;
import com.apitable.asset.ro.AssetQiniuUploadCallbackBody;
import com.apitable.asset.ro.AssetUploadNotifyRO;
import com.apitable.asset.service.IAssetCallbackService;
import com.apitable.asset.vo.AssetUploadResult;
import com.apitable.base.model.WidgetUploadNotifyRO;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.PostResource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import static com.apitable.core.constants.ResponseExceptionConstants.DEFAULT_ERROR_CODE;

/**
 * Attachment callback interface
 */
@RestController
@Api(tags = "Basic module - accessory callback interface")
@ApiResource(path = "/asset")
public class AssetCallbackController {

    @Resource
    private IAssetCallbackService iAssetCallbackService;

    @Autowired(required = false)
    private QiniuTemporaryClientTemplate qiniuTemporaryClientTemplate;

    @Autowired(required = false)
    private OssProperties ossProperties;

    @Deprecated
    @PostResource(name = "Qiniu cloud upload callback", path = "/qiniu/uploadCallback", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "Qiniu cloud upload callback", hidden = true)
    public ResponseData<AssetUploadResult> qiniuCallback(@RequestHeader("Authorization") String authorization, @RequestBody String body) {
        Qiniu qiniu = ossProperties.getQiniu();
        if (null == ossProperties.getQiniu()) {
            return ResponseData.status(false, DEFAULT_ERROR_CODE, "not enabled qiniu callback").data(null);
        }
        Callback callback = Optional.ofNullable(qiniu.getCallback()).orElseGet(Callback::new);
        boolean validCallback = qiniuTemporaryClientTemplate.isValidCallback(authorization, callback.getUrl(), StrUtil.bytes(body), callback.getBodyType());
        if (!validCallback) {
            return ResponseData.status(false, DEFAULT_ERROR_CODE, "invalid content").data(null);
        }

        AssetQiniuUploadCallbackBody callbackBody = JSONUtil.toBean(body, AssetQiniuUploadCallbackBody.class);
        return ResponseData.success(iAssetCallbackService.qiniuCallback(callbackBody));
    }

    @PostResource(name = "Resource upload completion notification callback", path = "/upload/callback", requiredLogin = false)
    @ApiOperation(value = "Resource upload completion notification callback", notes = "After S3 completes the client upload, it actively reaches the notification server")
    public ResponseData<List<AssetUploadResult>> notifyCallback(@RequestBody AssetUploadNotifyRO body) {
        return ResponseData.success(iAssetCallbackService.loadAssetUploadResult(AssetType.of(body.getType()), body.getResourceKeys()));
    }

    @PostResource(name = "widget upload callback", path = "/widget/uploadCallback", requiredLogin = false)
    @ApiOperation(value = "widget upload callback")
    public ResponseData<Void> widgetCallback(@RequestBody WidgetUploadNotifyRO body) {
        iAssetCallbackService.widgetCallback(body.getResourceKeys());
        return ResponseData.success();
    }
}
