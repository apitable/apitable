package com.vikadata.social.dingtalk.message;

import java.util.HashMap;
import java.util.Map;

/**
 * Card message
 */
public class ActionCardMessage implements Message {
    public static final String ACTION_CARD_MSG_TYPE = "action_card";

    /**
     * object action_card for the card message
     */
    private Component actionCard;

    public ActionCardMessage() {
    }

    public ActionCardMessage(Component actionCard) {
        this.actionCard = actionCard;
    }

    public Component getActionCard() {
        return actionCard;
    }

    public void setActionCard(Component actionCard) {
        this.actionCard = actionCard;
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
