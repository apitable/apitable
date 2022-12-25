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

import java.util.List;

import com.apitable.asset.enums.AssetType;
import com.apitable.asset.ro.AssetQiniuUploadCallbackBody;
import com.apitable.asset.vo.AssetUploadResult;

/**
 * <p>
 * Asset Upload Callback Service
 * </p>
 *
 * @author Pengap
 * @date 2022/4/6 16:44:50
 */
public interface IAssetCallbackService {

    /**
     * qiniu cloud upload callback
     *
     * @param body  callback body
     * @return AssetUploadResult
     * @author Pengap
     * @date 2022/4/7 15:02:24
     */
    @Deprecated
    AssetUploadResult qiniuCallback(AssetQiniuUploadCallbackBody body);

    /**
     * asset callback notify after complete upload
     *
     * @param assetType     assert type
     * @param resourceKeys  resource key list
     * @return AssetUploadResults
     * @author Chambers
     * @date 2022/8/8
     */
    List<AssetUploadResult> loadAssetUploadResult(AssetType assetType, List<String> resourceKeys);

    /**
     * widget upload callback
     *
     * @param resourceKeys   file urls
     */
    void widgetCallback(List<String> resourceKeys);
}
