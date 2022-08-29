package com.vikadata.api.component.audit;

import cn.hutool.core.collection.CollUtil;

/**
 * <p>
 * 针对系统行为的审计记录
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/3/27 15:34
 */
public class SystemAuditField extends AbstractAuditField {

    @Override
    protected void init() {
        put("user_login", CollUtil.newHashSet("ip", "user_id", "user_name"));
        put("user_logout", CollUtil.newHashSet("ip", "user_id", "user_name"));
    }

    @Override
    protected void initWrapper() {
        putFieldWrapperMethodName("user_name", "getUserNameByUserId");
    }
}
