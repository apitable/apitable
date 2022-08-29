package com.vikadata.api.util;

import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;

/**
 * <p>
 * 角色工具
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/13 21:02
 */
public class RoleBuildUtil {

    public static String createRoleCode(String spaceId) {
        return StrUtil.join("_", "ROLE", spaceId.toUpperCase(), StrUtil.subWithLength(IdUtil.fastSimpleUUID(), 0, 6).toUpperCase());
    }

    public static String createRoleName(String spaceId) {
        return StrUtil.join("_", spaceId.toUpperCase(), "SUB_ADMIN");
    }
}
