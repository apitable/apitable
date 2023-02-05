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
import com.apitable.asset.vo.AssetUploadResult;

/**
 * Asset Upload Callback Service.
 *
 * @author Pengap
 */
public interface IAssetCallbackService {

    /**
     * asset callback notify after complete upload.
     *
     * @param assetType     assert type
     * @param resourceKeys  resource key list
     * @return AssetUploadResults
     * @author Chambers
     */
    List<AssetUploadResult> loadAssetUploadResult(AssetType assetType,
        List<String> resourceKeys);

    /**
     * widget upload callback.
     *
     * @param resourceKeys   file urls
     */
    void widgetCallback(List<String> resourceKeys);
}
