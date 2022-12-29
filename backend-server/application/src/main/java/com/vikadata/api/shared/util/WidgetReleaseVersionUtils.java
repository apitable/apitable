package com.vikadata.api.shared.util;

import cn.hutool.core.util.StrUtil;
import cn.hutool.crypto.SecureUtil;
import com.github.zafarkhaja.semver.Version;

/**
 * <p>
 *  Widget release version number verification tool class
 * </p>
 *
 * @author Pengap
 */
public class WidgetReleaseVersionUtils {

    private static final String VERSION_SHA = "%s+%s";

    /**
     * Check if the version number conforms to the specification
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
        }
        catch (Exception ignored) {
            return false;
        }
    }

    /**
     * Generate unique SHA based on widget bundle ID + version number
     * <p>
     *    ie：b68ab73d3a4aab1e3b6beefa40cc7d075f271352
     * </p>
     * @param packageId widget package id
     * @param version version number
     * @return generated widget unique sha
     */
    public static String createVersionSHA(String packageId, String version) {
        String data = String.format(VERSION_SHA, packageId, version);
        return SecureUtil.sha1(data);
    }

}
