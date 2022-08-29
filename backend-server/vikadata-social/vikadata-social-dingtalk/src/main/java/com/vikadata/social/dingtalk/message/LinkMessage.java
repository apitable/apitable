package com.vikadata.social.dingtalk.message;

import java.util.HashMap;
import java.util.Map;

/**
 * <p> 
 * 链接消息
 * </p> 
 * @author zoe zheng 
 * @date 2021/4/21 11:56 上午
 */
public class LinkMessage implements Message {

    /**
     * 卡片消息的object action_card
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
