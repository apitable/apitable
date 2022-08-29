package com.vikadata.social.feishu;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

/**
 * 消息卡片交互事件
 *
 * @author Shawn Deng
 * @date 2020-11-24 11:48:32
 */
@Getter
@Setter
public class CardEvent {

    private String openId;

    private String userId;

    private String openMessageId;

    private String tenantKey;

    private String token;

    private Action action;

    @Getter
    @Setter
    public static class Action {
        String tag;

        Map<String, String> value;

        private String option;
    }
}
