package com.vikadata.social.dingtalk.event;

import java.util.Map;

/**
 * DingTalk event parsing interface
 */
public interface EventParser {

    /**
     * Analyze the corresponding events according to the data
     *
     * @param data Received event data
     * @return event
     */
    BaseEvent parse(Map<String, Object> data);
}
