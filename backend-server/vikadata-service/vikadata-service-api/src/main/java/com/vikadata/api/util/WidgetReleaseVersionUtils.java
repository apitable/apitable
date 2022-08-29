package com.vikadata.api.util;

import cn.hutool.core.util.StrUtil;
import cn.hutool.crypto.SecureUtil;
import com.github.zafarkhaja.semver.Version;

/**
 * <p>
 *  小组件发布版本号校验工具类
 * </p>
 *
 * @author Pengap
 * @date 2021/7/9
 */
public class WidgetReleaseVersionUtils {

    // 发布版本号SHA格式
    private static final String VERSION_SHA = "%s+%s";

    /**
     * 检查版本号是否符合规范
     *
     * @param version 版本号
     * @return 是否合格
     * @author Pengap
     * @date 2021/7/9
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
     * 根据小组件包ID + 版本号生成唯一SHA
     * <p>
     *    生成内容如：b68ab73d3a4aab1e3b6beefa40cc7d075f271352
     * </p>
     * @param packageId 小组件包ID
     * @param version 版本号
     * @return 生成的小组件唯一SHA
     * @author Pengap
     * @date 2021/7/9
     */
    public static String createVersionSHA(String packageId, String version) {
        String data = String.format(VERSION_SHA, packageId, version);
        return SecureUtil.sha1(data);
    }

}
