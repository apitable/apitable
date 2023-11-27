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

package com.apitable.asset.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

/**
 * <p>
 * Resource Audit Table.
 * </p>
 *
 * @author Mybatis Generator Tool
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@EqualsAndHashCode
@TableName(keepGlobalPrefix = true, value = "asset_audit")
public class AssetAuditEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Primary Key.
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * Resource ID(link#xxxx_asset#id).
     */
    private Long assetId;

    /**
     * Cloud File Storage Path.
     */
    private String assetFileUrl;

    /**
     * [Redundancy]md5 Abstract.
     */
    private String assetChecksum;

    /**
     * Audit result score.
     */
    private Float auditResultScore;

    /**
     * Audit Result Suggestion, include:[“block”,”review”,”pass”].
     */
    private String auditResultSuggestion;

    /**
     * Audit Scenes,Currently supported:pul/terror/politician/ads.
     */
    private String auditScenes;

    /**
     * Auditor OpenId.
     */
    private String auditorOpenid;

    /**
     * Auditor Name.
     */
    private String auditorName;

    /**
     * Is Audited(0:No, 1:Yes).
     */
    private Boolean isAudited;

    /**
     * Create Time.
     */
    private LocalDateTime createdAt;

    /**
     * Update Time.
     */
    private LocalDateTime updatedAt;

}
