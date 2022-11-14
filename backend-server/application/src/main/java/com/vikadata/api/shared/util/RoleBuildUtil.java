package com.vikadata.api.shared.util;

import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;

/**
 * <p>
 * Role util
 * </p>
 *
 * @author Shawn Deng
 */
public class RoleBuildUtil {

    public static String createRoleCode(String spaceId) {
        return StrUtil.join("_", "ROLE", spaceId.toUpperCase(), StrUtil.subWithLength(IdUtil.fastSimpleUUID(), 0, 6).toUpperCase());
    }

    public static String createRoleName(String spaceId) {
        return StrUtil.join("_", spaceId.toUpperCase(), "SUB_ADMIN");
    }
}
