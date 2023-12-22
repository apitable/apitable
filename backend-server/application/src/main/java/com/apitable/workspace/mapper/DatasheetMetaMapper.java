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

package com.apitable.workspace.mapper;

import com.apitable.internal.dto.SimpleDatasheetMetaDTO;
import com.apitable.workspace.dto.DatasheetMetaDTO;
import com.apitable.workspace.dto.DatasheetSnapshot;
import com.apitable.workspace.entity.DatasheetMetaEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.util.Collection;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * datsheet meta mapper.
 */
public interface DatasheetMetaMapper extends BaseMapper<DatasheetMetaEntity> {

    /**
     * insert batch.
     *
     * @param entities datasheet metas
     * @return affected rows
     */
    int insertBatch(@Param("entities") List<DatasheetMetaEntity> entities);

    /**
     * Query datasheet data source by datasheet id.
     *
     * @param dstId datasheet id
     * @return DatasheetSnapshot
     */
    DatasheetSnapshot selectByDstId(@Param("dstId") String dstId);

    /**
     * query with datasheet id.
     *
     * @param dstId datasheet id
     * @return DatasheetMetaVo
     */
    SimpleDatasheetMetaDTO selectByNodeId(@Param("dstId") String dstId);

    /**
     * quert DTO by datasheet ids.
     *
     * @param dstIdList datasheet ids
     * @return DatasheetMetaDTO
     */
    List<DatasheetMetaDTO> selectDtoByDstIds(@Param("list") List<String> dstIdList);

    /**
     * insert one meta.
     *
     * @param entity datasheet meta
     * @return affected rows
     */
    int insertMeta(@Param("entity") DatasheetMetaEntity entity);

    /**
     * update meta by datasheet id.
     *
     * @param userId user id
     * @param dstId  datasheet id
     * @param meta   datasheet meta
     * @return affected rows
     */
    int updateByDstId(@Param("userId") Long userId, @Param("meta") String meta,
                      @Param("dstId") String dstId);

    /**
     * update is deleted by datasheet id.
     *
     * @param userId  user id
     * @param nodeIds node ids
     * @param isDel   logical delete status
     * @return affected rows
     */
    int updateIsDeletedByNodeId(@Param("userId") Long userId,
                                @Param("nodeIds") Collection<String> nodeIds,
                                @Param("isDel") Boolean isDel);

    /**
     * the number of nodes that metadata contains  with keywords.
     *
     * @param nodeIds node ids
     * @param keyword keyword
     * @return count
     */
    Integer countByMetaData(@Param("nodeIds") Collection<String> nodeIds,
                            @Param("keyword") String keyword);
}
