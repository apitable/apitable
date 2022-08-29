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
 * <p>
 * 企微服务商消息扩展
 * </p>
 * @author 刘斌华
 * @date 2022-04-18 18:36:56
 */
@Setter
@Getter
public class WxCpIsvMessage extends WxCpMessage {

    public static final String TEMPLATE_MSG = "template_msg";

    /**
     * 选人sdk或者选人jsapi返回的ticket列表，列表不超过10个。接收者不包含selected_tikcet的操作者，若要发送给操作者，可将操作者填到touser字段。
     */
    private List<String> selectedTicketList;

    /**
     * 消息内容
     */
    private TemplateMsg templateMsg;

    /**
     * 是否仅向未授权的用户发送消息
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
     * 获取应用模板消息 builder
     *
     * @return {@link WxCpIsvMessageTemplateMsgBuilder}
     * @author 刘斌华
     * @date 2022-04-18 18:27:04
     */
    public static WxCpIsvMessageTemplateMsgBuilder TEMPLATEMSG() {

        return new WxCpIsvMessageTemplateMsgBuilder();

    }

    @Setter
    @Getter
    public static class TemplateMsg {

        /**
         * 消息模板 ID
         */
        private String templateId;

        /**
         * 点击消息后的跳转链接
         */
        private String url;

        /**
         * 消息内容的参数值
         */
        private Map<String, String> contentItem;

    }

}
