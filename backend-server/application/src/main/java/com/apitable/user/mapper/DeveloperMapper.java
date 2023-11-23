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

import com.apitable.user.entity.DeveloperEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

/**
 * develop mapper.
 */
public interface DeveloperMapper extends BaseMapper<DeveloperEntity> {

    /**
     * query developer info by user id.
     *
     * @param userId user id
     * @return DeveloperEntity
     */
    DeveloperEntity selectByUserId(@Param("userId") Long userId);

    /**
     * modify API KEY by user id.
     *
     * @param userId user id
     * @param apiKey access token
     * @return row
     */
    int updateApiKeyByUserId(@Param("userId") Long userId, @Param("apiKey") String apiKey);

    /**
     * query user id by access token.
     *
     * @param apiKey access token
     * @return user id
     */
    Long selectUserIdByApiKey(@Param("apiKey") String apiKey);
}
