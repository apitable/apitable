package com.vikadata.social.service.dingtalk.constants;

import cn.hutool.core.lang.Assert;
import cn.hutool.core.util.StrUtil;

/**
 * redis 常量
 *
 * @author Zoe Zheng
 * @date 2021-09-06 21:32:38
 */
public class RedisConstants {
    /**
     * 登录用户信息
     */
    private static final String SUITE_TICKET_KEY = "vikadata:social:cache:suite_ticket:{}";

    /**
     * 获取用户在空间内打开的数表信息
     *
     * @param corpId 服务商企业ID
     * @return 返回用户信息存储的键
     * @author Shawn Deng
     * @date 2019/11/12 17:43
     */
    public static String getSuiteTicketKey(String corpId) {
        Assert.notNull(corpId, "服务商不存在");
        return StrUtil.format(SUITE_TICKET_KEY, corpId);
    }
}
