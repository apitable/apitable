package com.vikadata.api.modular.base.service;

import com.vikadata.api.model.ro.asset.AssetUploadTokenRo;
import com.vikadata.api.model.vo.asset.AssetUploadTokenVo;

/**
 * <p>
 * 基础-附件上传Token 服务类
 * </p>
 *
 * @author Pengap
 * @date 2022/4/6 16:44:50
 */
public interface IAssetUploadTokenService {

    /**
     * 创建上传小程序资源凭据
     *
     * @param opUserId           操作用户ID
     * @param nodeId             节点Id
     * @param assetUploadTokenRo 资源上传Token请求参数
     * @return 创建Upload Token结果
     * @author Pengap
     * @date 2022/4/6 17:36:27
     */
    AssetUploadTokenVo createWidgetAssetsUploadToken(Long opUserId, String nodeId, AssetUploadTokenRo assetUploadTokenRo);

}
