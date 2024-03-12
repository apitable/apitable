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

package com.apitable.shared.cache.service;

import com.apitable.shared.cache.bean.UserSpaceDto;
import java.util.List;

/**
 * <p>
 * space stayed by user service.
 * </p>
 *
 * @author Shawn Deng
 */
public interface UserSpaceCacheService {

    /**
     * cache space stayed by users.
     *
     * @param userId   user id
     * @param spaceId  space id
     * @param memberId member id
     * @return user stayed space object
     */
    UserSpaceDto saveUserSpace(Long userId, String spaceId, Long memberId);

    /**
     * get member id in space stayed by user.
     *
     * @param userId  user id
     * @param spaceId space id
     * @return member id
     */
    Long getMemberId(Long userId, String spaceId);

    /**
     * get cache space stayed by users.
     *
     * @param userId  user id
     * @param spaceId space id
     * @return user stayed space object
     */
    UserSpaceDto getUserSpace(Long userId, String spaceId);

    /**
     * delete special cache space stayed by user.
     *
     * @param userId  user id
     * @param spaceId space id
     */
    void delete(Long userId, String spaceId);

    /**
     * delete cache.
     *
     * @param spaceId   space id
     * @param memberIds member id list
     */
    void delete(String spaceId, List<Long> memberIds);

    /**
     * delete space cache.
     *
     * @param spaceId space id
     */
    void delete(String spaceId);
}
