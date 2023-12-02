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

package com.apitable.player.mapper;

import com.apitable.player.entity.PlayerActivityEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * Player Activity Mapper.
 * </p>
 */
public interface PlayerActivityMapper extends BaseMapper<PlayerActivityEntity> {

    /**
     * Query actions.
     */
    String selectActionsByUserId(@Param("userId") Long userId);

    /**
     * Query count.
     */
    Integer countByUserId(@Param("userId") Long userId);

    /**
     * Query the specified key and corresponding value in the action aggregate.
     */
    Object selectActionsVal(@Param("userId") Long userId, @Param("key") String key);

    /**
     * Change action collection, insert key-value pair.
     */
    int updateActionsByJsonSet(@Param("userIds") List<Long> userIds, @Param("key") String key,
                               @Param("value") Object value);

    /**
     * Change the action aggregate, replacing the value corresponding to the specified key.
     */
    int updateActionsReplaceByUserId(@Param("userId") Long userId, @Param("key") String key,
                                     @Param("value") Object value);

    /**
     * Change the action aggregate and delete the value corresponding to the specified key.
     */
    int updateActionsRemoveByUserId(@Param("userId") Long userId, @Param("key") String key);

    /**
     * Change user actions.
     */
    int updateActionsByUserId(@Param("userId") Long userId, @Param("act") String act);
}
