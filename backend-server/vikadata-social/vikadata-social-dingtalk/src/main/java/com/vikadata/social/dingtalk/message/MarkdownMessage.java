package com.vikadata.social.dingtalk.message;

import java.util.HashMap;
import java.util.Map;

/**
 * <p> 
 * Markdown消息
 * </p> 
 * @author zoe zheng 
 * @date 2021/4/21 11:56 上午
 */
public class MarkdownMessage implements Message {

    /**
     * 卡片消息的object action_card
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
