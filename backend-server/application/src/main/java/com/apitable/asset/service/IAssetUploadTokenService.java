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

package com.apitable.asset.service;

import com.apitable.asset.vo.AssetUploadCertificateVO;
import com.apitable.asset.vo.AssetUrlSignatureVo;
import java.util.List;


/**
 * Asset Upload Credentials Service.
 */
public interface IAssetUploadTokenService {

    /**
     * Get signature url.
     *
     * @param fileName file name
     * @return url
     * @author Chambers
     */
    String getSignatureUrl(String fileName);

    /**
     * Get asset url signature vos.
     *
     * @param fileNames file names
     * @return List of AssetUrlSignatureVo
     * @author Chambers
     */
    List<AssetUrlSignatureVo> getAssetUrlSignatureVos(List<String> fileNames);

    /**
     * create public asset pre-signed url.
     *
     * @return AssetUploadCertificateVO
     */
    AssetUploadCertificateVO createPublishAssetPreSignedUrl();

    /**
     * batch create space asset pre-signed url.
     *
     * @param userId    user id
     * @param nodeId    node id
     * @param assetType asset type
     * @param count     created count
     * @return AssetUploadCertificateVO
     */
    List<AssetUploadCertificateVO> createSpaceAssetPreSignedUrl(Long userId,
                                                                String nodeId, int assetType,
                                                                int count);
}
