package com.vikadata.social.feishu.util;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.social.feishu.model.v3.FeishuDeptObject;
import com.vikadata.social.feishu.model.v3.FeishuUserObject;

import org.springframework.util.MultiValueMap;

import static com.vikadata.social.feishu.constants.FeishuConstants.FEISHU_ROOT_DEPT_ID;

/**
 * Debug tool class
 */
public class DebugUtil {

    private static final Logger log = LoggerFactory.getLogger(DebugUtil.class);

    public static void printResult(MultiValueMap<FeishuDeptObject, FeishuUserObject> contactMap) {
        contactMap.forEach((dept, users) -> {
            StringBuilder builder = new StringBuilder("[");
            if (CollUtil.isNotEmpty(users)) {
                users.forEach(user -> builder.append(StrUtil.format("{} - {}", user.getName(), user.isTenantManager())).append(", "));
            }
            builder.append("]");
            log.debug("{} -> {} \n", dept.getDepartmentId().equals(FEISHU_ROOT_DEPT_ID) ? "root department" :
                    dept.getName(), builder);
        });
    }
}
