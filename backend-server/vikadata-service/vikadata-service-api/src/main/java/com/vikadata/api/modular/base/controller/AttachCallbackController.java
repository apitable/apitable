package com.vikadata.api.modular.base.controller;

import java.util.List;
import java.util.Optional;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.enums.attach.AssetType;
import com.vikadata.api.model.ro.asset.AssetQiniuUploadCallbackBody;
import com.vikadata.api.model.vo.asset.AssetUploadResult;
import com.vikadata.api.modular.base.model.AssetUploadNotifyRO;
import com.vikadata.api.modular.base.model.WidgetUploadNotifyRO;
import com.vikadata.api.modular.base.service.IAssetCallbackService;
import com.vikadata.boot.autoconfigure.oss.OssProperties;
import com.vikadata.boot.autoconfigure.oss.OssProperties.Callback;
import com.vikadata.boot.autoconfigure.oss.OssProperties.Qiniu;
import com.vikadata.core.support.ResponseData;
import com.vikadata.integration.oss.qiniu.QiniuTemporaryClientTemplate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.core.constants.ResponseExceptionConstants.DEFAULT_ERROR_CODE;

/**
 * <p>
 * 附件回调接口
 * </p>
 * @author Pengap
 * @date 2022/4/6 16:15:23
 */
@RestController
@Api(tags = "基础模块_附件回调接口")
@ApiResource(path = "/asset")
public class AttachCallbackController {

    @Resource
    private IAssetCallbackService iAssetCallbackService;

    @Autowired(required = false)
    private QiniuTemporaryClientTemplate qiniuTemporaryClientTemplate;

    @Autowired(required = false)
    private OssProperties ossProperties;

    @Deprecated
    @PostResource(name = "七牛云上传回调", path = "/qiniu/uploadCallback", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "七牛云上传回调", hidden = true)
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

    @PostResource(name = "资源上传完成通知回调", path = "/upload/callback", requiredLogin = false)
    @ApiOperation(value = "资源上传完成通知回调", notes = "S3完成客户端上传之后，主动触达通知服务端")
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
