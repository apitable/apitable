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

import com.apitable.asset.entity.AssetAuditEntity;
import com.apitable.asset.ro.AssetsAuditRo;
import com.apitable.asset.ro.AttachAuditCallbackRo;
import com.apitable.asset.vo.AssetsAuditVo;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * Resource Audit Form Service Class.
 */
public interface IAssetAuditService extends IService<AssetAuditEntity> {

    /**
     * Create resource audit records.
     *
     * @param assetId    resource ID
     * @param checksum   resource summary
     * @param uploadPath resource storage path
     */
    void create(Long assetId, String checksum, String uploadPath);

    /**
     * Callback for audit result processing.
     *
     * @param result callback result
     */
    void auditCallback(AttachAuditCallbackRo result);

    /**
     * Query the list of pictures to be reviewed manually.
     *
     * @param page pagination parameters
     * @return List of AssetsAuditVo
     */
    IPage<AssetsAuditVo> readReviews(Page page);

    /**
     * Submit audit results.
     *
     * @param results Submit audit results
     */
    void submitAuditResult(AssetsAuditRo results);
}
