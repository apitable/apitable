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

package com.apitable.shared.util;

import cn.hutool.core.util.StrUtil;
import cn.hutool.crypto.SecureUtil;
import com.github.zafarkhaja.semver.Version;

/**
 * <p>
 * Widget release version number verification tool class.
 * </p>
 *
 * @author Pengap
 */
public class WidgetReleaseVersionUtils {

    private static final String VERSION_SHA = "%s+%s";

    /**
     * Check if the version number conforms to the specification.
     *
     * @param version version number
     * @return true | false
     */
    public static boolean checkVersion(String version) {
        if (StrUtil.isBlank(version)) {
            return false;
        }

        try {
            Version.valueOf(version);
            return true;
        } catch (Exception ignored) {
            return false;
        }
    }

    /**
     * Generate unique SHA based on widget bundle ID + version number.
     * <p>
     * ie：b68ab73d3a4aab1e3b6beefa40cc7d075f271352
     * </p>
     *
     * @param packageId widget package id
     * @param version   version number
     * @return generated widget unique sha
     */
    public static String createVersionSHA(String packageId, String version) {
        String data = String.format(VERSION_SHA, packageId, version);
        return SecureUtil.sha1(data);
    }

}
