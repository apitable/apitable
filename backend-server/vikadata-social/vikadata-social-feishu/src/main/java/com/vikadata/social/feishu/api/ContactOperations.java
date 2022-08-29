package com.vikadata.social.feishu.api;

import com.vikadata.social.feishu.exception.FeishuApiException;
import com.vikadata.social.feishu.model.FeishuContactScopeResponse;

/**
 * 通讯录 接口
 *
 * @author Shawn Deng
 * @date 2020-12-01 11:49:22
 */
public interface ContactOperations {

    /**
     * 获取通讯录授权范围
     *
     * @param tenantKey 租户标识
     * @return FeishuContactScopeResponse
     * @throws FeishuApiException 飞书自定义异常
     */
    FeishuContactScopeResponse getContactScope(String tenantKey) throws FeishuApiException;
}
