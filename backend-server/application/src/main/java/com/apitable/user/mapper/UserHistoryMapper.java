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

package com.apitable.user.mapper;

import com.apitable.user.dto.PausedUserHistoryDto;
import com.apitable.user.entity.UserHistoryEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.time.LocalDateTime;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * User History Mapper Interface.
 * </p>
 */
public interface UserHistoryMapper extends BaseMapper<UserHistoryEntity> {

    /**
     * Query the latest logoff application record according to the user ID.
     *
     * @param userId User ID
     * @return UserHistoryEntity
     */
    UserHistoryEntity selectLatest(@Param("userId") Long userId,
                                   @Param("userStatus") Integer userStatus);

    /**
     * Update user history according to user ID.
     *
     * @param userId     User ID
     * @param updateUser Data record updater, 0 represents system user
     * @return Number of affected records
     */
    int updateUpdateUserByUserId(@Param("userId") Long userId,
                                 @Param("updateUser") Long updateUser);

    /**
     * Get the operation record after created At After.
     *
     * @param createdAtBefore Create start time
     * @param createdAtAfter  Create end time
     * @param userStatus      User status
     * @return DTO
     */
    List<PausedUserHistoryDto> selectUserHistoryDtos(
        @Param("createdAtBefore") LocalDateTime createdAtBefore,
        @Param("createdAtAfter") LocalDateTime createdAtAfter,
        @Param("userStatus") Integer userStatus);

    List<Long> selectUserIdsByCreatedAtAndUserStatus(@Param("startAt") LocalDateTime startAt,
                                                     @Param("endAt")
                                                     LocalDateTime endAt,
                                                     @Param("userStatus") Integer userStatus);

}
