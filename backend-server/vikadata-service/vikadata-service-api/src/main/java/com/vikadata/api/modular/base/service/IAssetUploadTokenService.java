package com.vikadata.api.modular.base.service;

import java.util.List;

import com.vikadata.api.model.ro.asset.AssetUploadTokenRo;
import com.vikadata.api.model.vo.asset.AssetUploadTokenVo;
import com.vikadata.api.modular.base.model.AssetUploadCertificateVO;
import com.vikadata.api.modular.base.model.WidgetAssetUploadCertificateRO;
import com.vikadata.api.modular.base.model.WidgetUploadMetaVo;
import com.vikadata.api.modular.base.model.WidgetUploadTokenVo;

/**
 * <p>
 * Asset Upload Credentials Service
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

    /**
     * create public asset pre-signed url
     *
     * @return AssetUploadCertificateVO
     * @author Chambers
     * @date 2022/8/3
     */
    AssetUploadCertificateVO createPublishAssetPreSignedUrl();

    /**
     * batch create space asset pre-signed url
     *
     * @param userId            user id
     * @param nodeId            node id
     * @param assetType         asset type
     * @param count             created count
     * @return AssetUploadCertificateVO
     * @author Chambers
     * @date 2022/8/3
     */
    List<AssetUploadCertificateVO> createSpaceAssetPreSignedUrl(Long userId, String nodeId, int assetType, int count);


    /**
     * batch create widget asset pre-signed url
     *
     * @param userId            user id
     * @param packageId         widget package id
     * @param data              widget uploadData
     * @return AssetUploadTokenVo
     */
    List<WidgetUploadTokenVo> createWidgetAssetPreSignedUrl(Long userId, String packageId, WidgetAssetUploadCertificateRO data);

    /**
     * get widget upload meta
     *
     * @return WidgetUploadMetaVo
     */
    WidgetUploadMetaVo getWidgetUploadMetaVo();
}
