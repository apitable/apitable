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

package com.apitable.workspace.observer.remind;

/**
 * <p>
 * remind type.
 * </p>
 *
 * @author zoe zheng
 */
public enum RemindType {

    MEMBER(1),

    COMMENT(2);

    private final int remindType;

    RemindType(int remindType) {
        this.remindType = remindType;
    }

    public int getRemindType() {
        return remindType;
    }

    /**
     * <p>
     * get remind type by int value.
     * </p>
     *
     * @param remindType int value
     * @return remind type
     */
    public static RemindType of(int remindType) {
        for (RemindType value : RemindType.values()) {
            if (value.getRemindType() == remindType) {
                return value;
            }
        }
        throw new IllegalStateException("Remind Type Can not parse");
    }
}
