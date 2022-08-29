package com.vikadata.social.dingtalk.message;

import java.util.HashMap;
import java.util.Map;

/**
 * <p> 
 * 卡片消息
 * </p> 
 * @author zoe zheng 
 * @date 2021/4/21 11:56 上午
 */
public class ActionCardMessage implements Message {
    public static final String ACTION_CARD_MSG_TYPE = "action_card";

    /**
     * 卡片消息的object action_card
     */
    private Component actionCard;

    public ActionCardMessage() {
    }

    public ActionCardMessage(Component actionCard) {
        this.actionCard = actionCard;
    }

    public void setActionCard(Component actionCard) {
        this.actionCard = actionCard;
    }

    public Component getActionCard() {
        return actionCard;
    }

    @Override
    public String getMsgType() {
        return ACTION_CARD_MSG_TYPE;
    }

    @Override
    public Object getMsgObj() {
        Map<String, Object> map = new HashMap<>(2);
        map.put("msgtype", getMsgType());
        map.put("action_card", actionCard.toObj());
        return map;
    }
}
