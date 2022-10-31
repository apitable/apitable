package com.vikadata.social.feishu.event;

import java.util.Map;

/**
 * event parsing interface
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
