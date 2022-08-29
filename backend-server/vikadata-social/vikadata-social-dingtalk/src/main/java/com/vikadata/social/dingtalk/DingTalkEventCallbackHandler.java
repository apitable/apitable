package com.vikadata.social.dingtalk;

import com.vikadata.social.dingtalk.event.BaseEvent;

/**
 * <p>
 * 事件回调处理方法接口
 * </p>
 * @author zoe zheng
 * @date 2021/5/13 2:26 下午
 */
public interface DingTalkEventCallbackHandler<T extends BaseEvent> {

    /**
     * 处理方法
     *
     * @param agentId 钉钉应用agentId,或者corpId
     * @param event 钉钉事件
     * @return 处理结果
     */
    Object doHandle(String agentId, T event);
}
