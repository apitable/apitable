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

package com.apitable.space.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
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
 * Workbench - Attachment Table.
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
@TableName(keepGlobalPrefix = true, value = "space_asset")
public class SpaceAssetEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Primary key.
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * Space ID(link#xxxx_space#space_id).
     */
    private String spaceId;

    /**
     * Datasheet Node Id(link#xxxx_node#node_id).
     */
    private String nodeId;

    /**
     * Resource ID(link#xxxx_asset#id).
     */
    private Long assetId;

    /**
     * [Redundancy]md5 Abstract.
     */
    private String assetChecksum;

    /**
     * Number of references.
     */
    private Integer cite;

    /**
     * Type (0: user profile 1: space logo2: data table Annex 3: thumbnail 4: node description).
     */
    private Integer type;

    /**
     * Source file name, the file name of this upload.
     */
    private String sourceName;

    /**
     * [Redundancy]File Size(Unit: byte).
     */
    private Integer fileSize;

    /**
     * [Redundant] Whether it is a template attachment (0: No, 1: Yes).
     */
    private Boolean isTemplate;

    /**
     * Image Height.
     */
    private Integer height;

    /**
     * Image Width.
     */
    private Integer width;

    /**
     * Delete Tag(0:No,1:Yes).
     */
    @TableLogic
    private Boolean isDeleted;

    /**
     * Create Time.
     */
    private LocalDateTime createdAt;

    /**
     * Update Time.
     */
    private LocalDateTime updatedAt;

}
