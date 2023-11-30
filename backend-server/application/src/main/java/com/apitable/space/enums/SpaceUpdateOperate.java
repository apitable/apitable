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

package com.apitable.space.enums;

/**
 * <p>
 * Modify space operations (using space integrated with third-party IM).
 * </p>
 */
public enum SpaceUpdateOperate {

    /**
     * update the main administration operation.
     */
    UPDATE_MAIN_ADMIN,
    /**
     * modify member info.
     */
    UPDATE_MEMBER,
    /**
     * add team.
     */
    ADD_TEAM,
    /**
     * update team info.
     */
    UPDATE_TEAM,
    /**
     * delete team.
     */
    DELETE_TEAM,
    /**
     * delete space.
     */
    DELETE_SPACE;

    /**
     * dingtalk isv can be operated.
     *
     * @param value value
     * @return true or false
     */
    public static Boolean dingTalkIsvCanOperated(SpaceUpdateOperate value) {
        return value.equals(UPDATE_MEMBER) || value.equals(ADD_TEAM) || value.equals(UPDATE_TEAM)
            || value.equals(DELETE_TEAM);
    }

    /**
     * wecom isv can be operated.
     *
     * @param value value
     * @return true or false
     */
    public static boolean weComIsvCanOperated(SpaceUpdateOperate value) {

        return value.equals(UPDATE_MEMBER) || value.equals(ADD_TEAM) || value.equals(UPDATE_TEAM)
            || value.equals(DELETE_TEAM);

    }

    /**
     * lar isv can be operated.
     *
     * @param value value
     * @return true or false
     */
    public static boolean larIsvCanOperated(SpaceUpdateOperate value) {
        return value.equals(UPDATE_MEMBER);
    }

}
