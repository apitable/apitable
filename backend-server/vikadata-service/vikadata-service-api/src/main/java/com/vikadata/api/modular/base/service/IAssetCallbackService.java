package com.vikadata.api.modular.base.service;

import com.vikadata.api.model.ro.asset.AssetQiniuUploadCallbackBody;

/**
 * <p>
 * 基础-附件回调 服务类
 * </p>
 *
 * @author Pengap
 * @date 2022/4/6 16:44:50
 */
public interface IAssetCallbackService {

    /**
     * 七牛云上传回调
     *
     * @param body  回调内容
     * @author Pengap
     * @date 2022/4/7 15:02:24
     */
    void qiniuCallback(AssetQiniuUploadCallbackBody body);

}
