package com.vikadata.api.asset.service;

import java.util.List;

import com.vikadata.api.asset.ro.AssetUploadTokenRo;
import com.vikadata.api.asset.vo.AssetUploadTokenVo;
import com.vikadata.api.base.model.AssetUploadCertificateVO;
import com.vikadata.api.base.model.WidgetAssetUploadCertificateRO;
import com.vikadata.api.base.model.WidgetUploadMetaVo;
import com.vikadata.api.base.model.WidgetUploadTokenVo;

/**
 * Asset Upload Credentials Service
 */
public interface IAssetUploadTokenService {

    /**
     * create upload mini program resource credentials
     *
     * @param opUserId           operation user id
     * @param nodeId             node id
     * @param assetUploadTokenRo Resource upload token request parameters
     * @return Create Upload Token result
     */
    AssetUploadTokenVo createWidgetAssetsUploadToken(Long opUserId, String nodeId, AssetUploadTokenRo assetUploadTokenRo);

    /**
     * create public asset pre-signed url
     *
     * @return AssetUploadCertificateVO
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
