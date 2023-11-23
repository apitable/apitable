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

package com.apitable.space.service;

/**
 * space apply service.
 */
public interface ISpaceApplyService {

    /**
     * create space join application.
     *
     * @param userId  userId
     * @param spaceId space id
     * @return ID
     */
    Long create(Long userId, String spaceId);

    /**
     * Send apply notifications.
     *
     * @param userId  user ID
     * @param spaceId space ID
     * @param applyId apply ID
     * @author Chambers
     */
    void sendApplyNotify(Long userId, String spaceId, Long applyId);

    /**
     * process space join application.
     *
     * @param userId   userId
     * @param notifyId notify id
     * @param agree    agree or not
     */
    void process(Long userId, Long notifyId, Boolean agree);
}
