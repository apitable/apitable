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

package com.apitable.asset.mapper;

import com.apitable.asset.entity.AssetAuditEntity;
import com.apitable.asset.vo.AssetsAuditVo;
import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;

/**
 * Basics - Attachment Audit Form Mapper Interface.
 */
public interface AssetAuditMapper extends BaseMapper<AssetAuditEntity> {

    /**
     * get a list of images that need human review.
     *
     * @param page pagination parameters
     * @return Page of attachment audit vo
     */
    @InterceptorIgnore(illegalSql = "true")
    // There are only a few types of suggestions and scenes, the dispersion is not enough, and the indexing is not meaningful
    IPage<AssetsAuditVo> getArtificialAssetsAuditList(Page<AssetsAuditVo> page);

    /**
     * Get a list of images that need human review.
     *
     * @param assetFileUrl          attachment path
     * @param auditResultSuggestion audit results
     * @param auditorName           Reviewer's name
     * @param auditorUserId         Reviewer user Id
     * @return boolean Update succeeded or failed
     */
    boolean updateByAssetId(@Param("assetFileUrl") String assetFileUrl,
                            @Param("auditResultSuggestion") String auditResultSuggestion,
                            @Param("auditorName") String auditorName,
                            @Param("auditorUserId") String auditorUserId);
}
