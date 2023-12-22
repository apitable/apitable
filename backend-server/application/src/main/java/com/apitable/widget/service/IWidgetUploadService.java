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

package com.apitable.widget.service;

import com.apitable.base.model.WidgetAssetUploadCertificateRO;
import com.apitable.base.model.WidgetUploadMetaVo;
import com.apitable.base.model.WidgetUploadTokenVo;
import java.util.List;

/**
 * widget upload service.
 */
public interface IWidgetUploadService {

    /**
     * batch create widget asset pre-signed url.
     *
     * @param userId    user id
     * @param packageId widget package id
     * @param data      widget uploadData
     * @return AssetUploadTokenVo
     */
    List<WidgetUploadTokenVo> createWidgetAssetPreSignedUrl(Long userId,
                                                            String packageId,
                                                            WidgetAssetUploadCertificateRO data);

    /**
     * get widget upload meta.
     *
     * @return WidgetUploadMetaVo
     */
    WidgetUploadMetaVo getWidgetUploadMetaVo();
}
