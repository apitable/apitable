package com.vikadata.social.dingtalk.message;

import java.util.HashMap;
import java.util.Map;

/**
 * Markdown messages
 */
public class MarkdownMessage implements Message {

    /**
     * object action_card for the card message
     */
    private final Component markdown;

    public MarkdownMessage(Component markdown) {
        this.markdown = markdown;
    }

    @Override
    public String getMsgType() {
        return "markdown";
    }

    @Override
    public Object getMsgObj() {
        Map<String, Object> map = new HashMap<>(2);
        map.put("msgtype", getMsgType());
        map.put("markdown", markdown.toObj());
        return map;
    }
}
