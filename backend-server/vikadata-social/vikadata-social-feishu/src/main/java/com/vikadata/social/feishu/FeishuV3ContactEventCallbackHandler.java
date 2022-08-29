package com.vikadata.social.feishu;

import com.vikadata.social.feishu.event.contact.v3.BaseV3ContactEvent;

/**
 * 事件回调处理方法接口
 *
 * @author Shawn Deng
 * @date 2020-11-24 17:03:46
 */
public interface FeishuV3ContactEventCallbackHandler<T extends BaseV3ContactEvent> {

    /**
     * 处理方法
     *
     * @param event 飞书事件
     * @return 处理结果
     */
    Object doHandle(T event);
}
