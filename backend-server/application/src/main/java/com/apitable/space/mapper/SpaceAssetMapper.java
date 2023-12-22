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

package com.apitable.space.mapper;

import com.apitable.space.dto.NodeAssetDTO;
import com.apitable.space.dto.SpaceAssetDTO;
import com.apitable.space.entity.SpaceAssetEntity;
import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.util.Collection;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * space asset mapper.
 */
public interface SpaceAssetMapper extends BaseMapper<SpaceAssetEntity> {

    /**
     * update is_deleted by asset ids.
     *
     * @param nodeIds node ids
     * @param isDel   logical deletion status
     * @return affected rows
     */
    int updateIsDeletedByNodeIds(@Param("list") List<String> nodeIds,
                                 @Param("isDel") Boolean isDel);

    /**
     * query asset ids by node id.
     *
     * @param nodeIds node ids
     * @return assetIds
     */
    List<Long> selectDistinctAssetIdByNodeIdIn(@Param("nodeIds") Collection<String> nodeIds);

    /**
     * get id and cte, type.
     *
     * @param spaceId space id
     * @param nodeId  node id
     * @param assetId asset id
     * @return dto
     */
    SpaceAssetDTO selectDto(@Param("spaceId") String spaceId, @Param("nodeId") String nodeId,
                            @Param("assetId") Long assetId);

    /**
     * get id and cte, token.
     *
     * @param spaceId  space id
     * @param nodeId   node id
     * @param type     file type
     * @param assetIds asset ID
     * @return dto
     */
    @InterceptorIgnore(illegalSql = "true")
    List<SpaceAssetDTO> selectDtoByAssetIdsAndType(@Param("spaceId") String spaceId,
                                                   @Param("nodeId") String nodeId,
                                                   @Param("type") Integer type,
                                                   @Param("assetIds") List<Long> assetIds);

    /**
     * Obtain information about the attachment resources of a node.
     *
     * @param nodeIds node ids
     * @return Assets
     */
    List<SpaceAssetDTO> selectSpaceAssetDTO(@Param("nodeIds") Collection<String> nodeIds);

    /**
     * Obtain information about the attachment resources of a node.
     *
     * @param nodeIds node ids
     * @return Assets
     */
    List<NodeAssetDTO> selectNodeAssetDto(@Param("list") List<String> nodeIds);

    /**
     * batch insert.
     *
     * @param entities asset
     * @return affected rows
     */
    int insertBatch(@Param("entities") List<SpaceAssetEntity> entities);

    /**
     * Determine whether the attachment exists in the space.
     *
     * @param spaceId  space id
     * @param checksum MD5
     * @return the row amount
     */
    Integer countBySpaceIdAndAssetChecksum(@Param("spaceId") String spaceId,
                                           @Param("checksum") String checksum);

    /**
     * Modifies the number of references to an attachment on a specified node.
     *
     * @param nodeId node id
     * @param token  asset file_url
     * @param offset offset
     * @return affected rows
     */
    int updateCiteByNodeIdAndToken(@Param("nodeId") String nodeId, @Param("token") String token,
                                   @Param("offset") int offset);

    /**
     * query file size by space id.
     *
     * @param spaceId space id
     * @return file sizes
     */
    List<Integer> selectFileSizeBySpaceId(@Param("spaceId") String spaceId);

    /**
     * delete by asset ids.
     *
     * @param ids id
     * @return affected rows
     */
    int deleteBatchByIds(@Param("ids") Collection<Long> ids);

    /**
     * update template status by asset ids.
     *
     * @param isTemplate     updated template status
     * @param assetChecksums asset checksum list
     * @return affected rows count
     */
    int updateIsTemplateByAssetChecksumIn(@Param("isTemplate") Boolean isTemplate,
                                          @Param("assetChecksums")
                                          Collection<String> assetChecksums);

}
