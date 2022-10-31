package com.vikadata.social.wecom.model;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import cn.hutool.core.collection.CollUtil;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import lombok.Getter;
import lombok.Setter;
import me.chanjar.weixin.cp.bean.message.WxCpMessage;
import org.apache.commons.lang3.StringUtils;

/**
 * wecom isv message expansion
 */
@Setter
@Getter
public class WxCpIsvMessage extends WxCpMessage {

    public static final String TEMPLATE_MSG = "template_msg";

    /**
     * The list of tickets returned by the candidate sdk or the candidate jsapi.
     * The list should not exceed 10. The receiver does not contain the operator of the selected tikcet.
     * If you want to send it to the operator, you can fill in the operator in the touser field.
     */
    private List<String> selectedTicketList;

    /**
     * Message content
     */
    private TemplateMsg templateMsg;

    /**
     * Whether to send messages only to unauthorized users
     */
    private Boolean onlyUnauth;

    private void handleMsgType(JsonObject messageJson) {

        switch (this.getMsgType()) {
            case TEMPLATE_MSG:
                JsonObject template = new JsonObject();
                template.addProperty("template_id", templateMsg.getTemplateId());
                template.addProperty("url", templateMsg.getUrl());
                if (CollUtil.isNotEmpty(templateMsg.getContentItem())) {
                    JsonArray contentItem = new JsonArray();
                    templateMsg.getContentItem().forEach((key, value) -> {
                        JsonObject item = new JsonObject();
                        item.addProperty("key", key);
                        item.addProperty("value", value);
                        contentItem.add(item);
                    });
                    template.add("content_item", contentItem);
                }
                messageJson.add("template_msg", template);

                break;
            default:
        }

    }

    @Override
    public String toJson() {

        JsonObject messageJson = new JsonObject();

        if (StringUtils.isNotBlank(this.getToUser())) {
            messageJson.addProperty("touser", this.getToUser());
        }

        if (StringUtils.isNotBlank(this.getToParty())) {
            messageJson.addProperty("toparty", this.getToParty());
        }

        if (StringUtils.isNotBlank(this.getToTag())) {
            messageJson.addProperty("totag", this.getToTag());
        }

        if (Objects.nonNull(this.getAgentId())) {
            messageJson.addProperty("agentid", this.getAgentId());
        }

        messageJson.addProperty("msgtype", this.getMsgType());

        if (CollUtil.isNotEmpty(this.getSelectedTicketList())) {
            JsonArray jsonArray = new JsonArray();
            this.getSelectedTicketList().forEach(jsonArray::add);
            messageJson.add("selected_ticket_list", jsonArray);
        }

        this.handleMsgType(messageJson);

        if (this.getEnableIdTrans()) {
            messageJson.addProperty("enable_id_trans", 1);
        }

        if (Objects.nonNull(this.getOnlyUnauth())) {
            messageJson.addProperty("only_unauth", this.getOnlyUnauth());
        }

        return messageJson.toString();

    }

    /**
     * Get app template message builder
     * @return {@link WxCpIsvMessageTemplateMsgBuilder}
     */
    public static WxCpIsvMessageTemplateMsgBuilder TEMPLATEMSG() {

        return new WxCpIsvMessageTemplateMsgBuilder();

    }

    @Setter
    @Getter
    public static class TemplateMsg {

        /**
         * Message template ID
         */
        private String templateId;

        /**
         * Click the jump link after the message
         */
        private String url;

        /**
         * The parameter value of the message content
         */
        private Map<String, String> contentItem;

    }

}
