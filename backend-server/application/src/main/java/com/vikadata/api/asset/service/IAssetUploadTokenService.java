package com.vikadata.api.asset.service;

import java.util.List;

import com.vikadata.api.base.model.AssetUploadCertificateVO;

/**
 * Asset Upload Credentials Service
 */
public interface IAssetUploadTokenService {

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
}
