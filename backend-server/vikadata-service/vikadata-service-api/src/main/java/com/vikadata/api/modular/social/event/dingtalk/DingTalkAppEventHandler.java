package com.vikadata.api.modular.social.event.dingtalk;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventHandler;
import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventListener;
import com.vikadata.social.dingtalk.event.CheckUrlEvent;

/**
 * <p>
 * 钉钉
 * 事件订阅 - 基本事件
 * </p>
 * @author zoe zheng
 * @date 2021/5/13 4:36 下午
 */
@DingTalkEventHandler
@Slf4j
public class DingTalkAppEventHandler {


    /**
     * 用户激活
     *
     * @param event 事件内容
     * @return 响应内容
     */
    @DingTalkEventListener
    public Object onCheckUrl(String agentId, CheckUrlEvent event) {
        // 钉钉的事件推送不会重复
        return "";
    }
}
