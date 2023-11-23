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

import com.apitable.space.vo.SpaceGlobalFeature;

/**
 * <p>
 * Temporary storage container for the space ID of the current request.
 * </p>
 *
 * @author Shawn Deng
 */
public class SpaceHolder {

    private static final ThreadLocal<Boolean> OPEN_UP_FLAG = new ThreadLocal<>();

    private static final ThreadLocal<String> SPACE_HOLDER = new ThreadLocal<>();

    private static final ThreadLocal<SpaceGlobalFeature> SPACE_GLOBAL_FEATURE = new ThreadLocal<>();

    public static void init() {
        OPEN_UP_FLAG.set(true);
    }

    /**
     * setter.
     *
     * @param spaceId space id
     */
    public static void set(String spaceId) {
        Boolean openUpFlag = OPEN_UP_FLAG.get();
        if (openUpFlag != null && openUpFlag.equals(true)) {
            SPACE_HOLDER.set(spaceId);
        }
    }

    /**
     * getter.
     *
     * @return space id
     */
    public static String get() {
        Boolean openUpFlag = OPEN_UP_FLAG.get();
        if (openUpFlag == null || openUpFlag.equals(false)) {
            return null;
        } else {
            return SPACE_HOLDER.get();
        }
    }

    /**
     * put global feature.
     *
     * @param feature feature.
     */
    public static void setGlobalFeature(SpaceGlobalFeature feature) {
        Boolean openUpFlag = OPEN_UP_FLAG.get();
        if (openUpFlag != null && openUpFlag.equals(true)) {
            SPACE_GLOBAL_FEATURE.set(feature);
        }
    }

    /**
     * get global feature.
     *
     * @return global feature.
     */
    public static SpaceGlobalFeature getGlobalFeature() {
        Boolean openUpFlag = OPEN_UP_FLAG.get();
        if (openUpFlag == null || openUpFlag.equals(false)) {
            return null;
        } else {
            return SPACE_GLOBAL_FEATURE.get();
        }
    }

    /**
     * remove thread local.
     */
    public static void remove() {
        OPEN_UP_FLAG.remove();
        SPACE_HOLDER.remove();
        SPACE_GLOBAL_FEATURE.remove();
    }
}
