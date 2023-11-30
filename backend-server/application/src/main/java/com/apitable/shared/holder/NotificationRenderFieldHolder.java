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

package com.apitable.shared.holder;

import com.apitable.shared.component.notification.NotificationRenderField;

/**
 * <p>
 * Notify temporary field.
 * </p>
 *
 * @author zoe zheng
 */
public class NotificationRenderFieldHolder {

    private static final ThreadLocal<Boolean> OPEN_UP_FLAG = new ThreadLocal<>();

    private static final ThreadLocal<NotificationRenderField> HOLDER = new ThreadLocal<>();

    public static void init() {
        OPEN_UP_FLAG.set(true);
    }

    /**
     * setter.
     *
     * @param val val
     */
    public static void set(NotificationRenderField val) {
        Boolean openUpFlag = OPEN_UP_FLAG.get();
        if (openUpFlag != null && openUpFlag.equals(true)) {
            HOLDER.set(val);
        }
    }

    /**
     * getter.
     *
     * @return NotificationRenderField
     */
    public static NotificationRenderField get() {
        Boolean openUpFlag = OPEN_UP_FLAG.get();
        if (openUpFlag == null || openUpFlag.equals(false)) {
            return null;
        } else {
            return HOLDER.get();
        }
    }

    public static void remove() {
        OPEN_UP_FLAG.remove();
        HOLDER.remove();
    }
}
