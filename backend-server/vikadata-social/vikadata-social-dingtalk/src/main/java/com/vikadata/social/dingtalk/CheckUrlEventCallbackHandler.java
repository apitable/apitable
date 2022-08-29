package com.vikadata.social.dingtalk;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.social.dingtalk.event.CheckUrlEvent;

import static com.vikadata.social.dingtalk.constants.DingTalkConst.DING_TALK_CALLBACK_SUCCESS;

/**
 * APP Tick 推送事件处理
 * 默认由飞书内部组件完成处理转换
 *
 * @author Shawn Deng
 * @date 2020-11-24 19:06:04
 */
@Slf4j
public class CheckUrlEventCallbackHandler implements DingTalkEventCallbackHandler<CheckUrlEvent> {
    /**
     * 处理方法
     *
     * @param suiteId 钉钉ISV应用suiteId
     * @param event 钉钉事件
     * @return 处理结果
     */
    @Override
    public Object doHandle(String suiteId, CheckUrlEvent event) {
        return DING_TALK_CALLBACK_SUCCESS;
    }
}
