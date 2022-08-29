package com.vikadata.api.modular.base.controller;

import java.util.Optional;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.model.ro.asset.AssetQiniuUploadCallbackBody;
import com.vikadata.api.modular.base.service.IAssetCallbackService;
import com.vikadata.boot.autoconfigure.oss.OssProperties;
import com.vikadata.boot.autoconfigure.oss.OssProperties.Callback;
import com.vikadata.boot.autoconfigure.oss.OssProperties.Qiniu;
import com.vikadata.core.support.ResponseData;
import com.vikadata.integration.oss.OssClientTemplate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * 附件回调接口
 * </p>
 * @author Pengap
 * @date 2022/4/6 16:15:23
 */
@RestController
@Api(tags = "基础模块_附件回调接口", hidden = true)
@ApiResource(path = "/asset")
public class AttachCallbackController {

    @Resource
    private IAssetCallbackService iAssetCallbackService;

    @Autowired(required = false)
    private OssClientTemplate ossTemplate;

    @Autowired(required = false)
    private OssProperties ossProperties;

    @PostResource(name = "七牛云上传回调", path = "/qiniu/uploadCallback", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "七牛云上传回调", hidden = true)
    public ResponseData<Void> qiniuCallback(@RequestHeader("Authorization") String authorization, @RequestBody String body) {
        Qiniu qiniu = ossProperties.getQiniu();
        if (null == ossProperties.getQiniu()) {
            return ResponseData.error("not enabled qiniu callback");
        }
        Callback callback = Optional.ofNullable(qiniu.getCallback()).orElseGet(Callback::new);
        boolean validCallback = ossTemplate.isValidCallback(authorization, callback.getUrl(), StrUtil.bytes(body), callback.getBodyType());
        if (!validCallback) {
            return ResponseData.error("invalid content");
        }

        AssetQiniuUploadCallbackBody callbackBody = JSONUtil.toBean(body, AssetQiniuUploadCallbackBody.class);
        iAssetCallbackService.qiniuCallback(callbackBody);
        return ResponseData.success();
    }

}
