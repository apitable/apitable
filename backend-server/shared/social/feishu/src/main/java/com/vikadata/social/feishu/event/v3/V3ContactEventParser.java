package com.vikadata.social.feishu.event.v3;

import java.util.Map;

import com.vikadata.social.feishu.event.contact.v3.BaseV3ContactEvent;

/**
 * New version of event parsing interface
 */
public interface V3ContactEventParser {

    /**
     * Analyze the corresponding events according to the data
     *
     * @param data received event data
     * @return event
     */
    BaseV3ContactEvent parse(Map<String, Object> data);
}
