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

import com.apitable.workspace.entity.DatasheetEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.util.Collection;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface DatasheetMapper extends BaseMapper<DatasheetEntity> {

    /**
     * @param entities datasheets
     * @return affected rows
     */
    int insertBatch(@Param("entities") List<DatasheetEntity> entities);

    /**
     * @param userId  user id
     * @param dstId   datasheet id
     * @param dstName new datasheet name
     * @return affected rows
     */
    int updateNameByDstId(@Param("userId") Long userId, @Param("dstId") String dstId,
                          @Param("dstName") String dstName);

    /**
     * @param userId  user id
     * @param nodeIds node ids
     * @param isDel   logical delete status
     * @return affected rows
     */
    int updateIsDeletedByNodeIds(@Param("userId") Long userId,
                                 @Param("nodeIds") Collection<String> nodeIds,
                                 @Param("isDel") Boolean isDel);

    /**
     * @param nodeId datasheet id
     * @return DatasheetEntity
     */
    DatasheetEntity selectByDstId(@Param("nodeId") String nodeId);

    /**
     * query space dst id.
     *
     * @param spaceId space id
     * @return list of dst id
     */
    List<String> selectDstIdBySpaceId(@Param("spaceId") String spaceId);
}
