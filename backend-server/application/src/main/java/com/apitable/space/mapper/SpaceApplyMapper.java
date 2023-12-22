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

import com.apitable.space.dto.SpaceApplyDTO;
import com.apitable.space.entity.SpaceApplyEntity;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * space apply mapper.
 */
public interface SpaceApplyMapper {

    /**
     * query count by space id and status.
     *
     * @param createdBy creator
     * @param spaceId   space id
     * @param status    status
     * @return the row count
     */
    Integer countBySpaceIdAndCreatedByAndStatus(@Param("createdBy") Long createdBy,
                                                @Param("spaceId") String spaceId,
                                                @Param("status") Integer status);

    /**
     * query DTO by apply info.
     *
     * @param notifyId       apply notification id
     * @param toUser         apply notification receiver
     * @param templateId     apply notification template id
     * @param applyIdKey     apply notification message body apply id key
     * @param applyStatusKey apply notification message body apply status key
     * @return space apply info
     */
    SpaceApplyDTO selectSpaceApplyDto(@Param("notifyId") Long notifyId,
                                      @Param("toUser") Long toUser,
                                      @Param("templateId") String templateId,
                                      @Param("applyIdKey") String applyIdKey,
                                      @Param("applyStatusKey") String applyStatusKey);

    /**
     * insert apply info.
     *
     * @param entity apply info
     * @return affected rows
     */
    int insertApply(@Param("entity") SpaceApplyEntity entity);

    /**
     * update status by apply id.
     *
     * @param applyId   applyId
     * @param status    status
     * @param updatedBy updater
     * @return affected rows
     */
    int updateStatusByApplyIdAndUpdatedBy(@Param("applyId") Long applyId,
                                          @Param("status") Integer status,
                                          @Param("updatedBy") Long updatedBy);

    /**
     * update status by apply id.
     *
     * @param applicants applicants
     * @param spaceId    space id
     * @param reason     invalidate reason
     * @return affected rows
     */
    int invalidateTheApply(@Param("list") List<Long> applicants, @Param("spaceId") String spaceId,
                           @Param("reason") Integer reason);
}
