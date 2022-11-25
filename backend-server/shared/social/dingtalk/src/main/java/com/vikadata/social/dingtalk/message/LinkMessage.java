package com.vikadata.social.dingtalk.message;

import java.util.HashMap;
import java.util.Map;

/**
 * link message
 */
public class LinkMessage implements Message {

    /**
     * object action_card for the card message
     */
    private final Component link;

    public LinkMessage(Component link) {
        this.link = link;
    }

    @Override
    public String getMsgType() {
        return "link";
    }

    @Override
    public Object getMsgObj() {
        Map<String, Object> map = new HashMap<>(2);
        map.put("msgtype", getMsgType());
        map.put("link", link.toObj());
        return map;
    }
}
