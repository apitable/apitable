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

package com.apitable.workspace.enums;

/**
 * <p>
 * view type.
 * </p>
 *
 * @author Benson Cheung
 */
public enum ViewType {

    NOT_SUPPORT(0),

    GRID(1),

    KANBAN(2),

    GALLERY(3),

    FORM(4),

    CALENDAR(5),
    GANTT(6);

    private int type;

    ViewType(int type) {
        this.type = type;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    /**
     * trans to ViewType enum.
     *
     * @param type type
     * @return ViewType
     */
    public static ViewType of(Integer type) {
        for (ViewType value : ViewType.values()) {
            if (value.getType() == type) {
                return value;
            }
        }
        return null;
    }
}
