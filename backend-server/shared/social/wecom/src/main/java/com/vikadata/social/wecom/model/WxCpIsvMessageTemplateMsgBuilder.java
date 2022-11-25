package com.vikadata.social.wecom.model;

import java.util.List;
import java.util.Objects;

import com.google.common.collect.Maps;
import me.chanjar.weixin.cp.bean.messagebuilder.BaseBuilder;

import com.vikadata.social.wecom.model.WxCpIsvMessage.TemplateMsg;

/**
 * Wecom ISV template message builder
 */
public class WxCpIsvMessageTemplateMsgBuilder extends BaseBuilder<WxCpIsvMessageTemplateMsgBuilder> {

    /**
     * The list of tickets returned by the candidate sdk or the candidate jsapi. The list should not exceed 10.
     * The receiver does not contain the operator of the selected tikcet.
     * If you want to send it to the operator, you can fill in the operator in the touser field.
     */
    private List<String> selectedTicketList;

    /**
     * Message content
     */
    private TemplateMsg templateMsg = new TemplateMsg();

    /**
     * Whether to enable ID translation
     */
    private Boolean enableIdTrans;

    /**
     * Whether to send messages only to unauthorized users
     */
    private Boolean onlyUnauth;

    public WxCpIsvMessageTemplateMsgBuilder() {
        this.msgType = WxCpIsvMessage.TEMPLATE_MSG;
    }

    public WxCpIsvMessageTemplateMsgBuilder selectedTicketList(List<String> selectedTicketList) {
        this.selectedTicketList = selectedTicketList;

        return this;
    }

    public WxCpIsvMessageTemplateMsgBuilder templateId(String templateId) {
        templateMsg.setTemplateId(templateId);

        return this;
    }

    public WxCpIsvMessageTemplateMsgBuilder url(String url) {
        templateMsg.setUrl(url);

        return this;
    }

    public WxCpIsvMessageTemplateMsgBuilder contentItem(String key, String value) {

        if (Objects.isNull(templateMsg.getContentItem())) {
            templateMsg.setContentItem(Maps.newHashMapWithExpectedSize(2));
        }
        templateMsg.getContentItem().put(key, value);

        return this;

    }

    public WxCpIsvMessageTemplateMsgBuilder enableIdTrans(Boolean enableIdTrans) {
        this.enableIdTrans = enableIdTrans;

        return this;
    }

    public WxCpIsvMessageTemplateMsgBuilder onlyUnauth(Boolean onlyUnauth) {
        this.onlyUnauth = onlyUnauth;

        return this;
    }

    @Override
    public WxCpIsvMessage build() {

        WxCpIsvMessage wxCpIsvMessage = new WxCpIsvMessage();
        wxCpIsvMessage.setToUser(toUser);
        wxCpIsvMessage.setToParty(toParty);
        wxCpIsvMessage.setToTag(toTag);
        wxCpIsvMessage.setAgentId(agentId);
        wxCpIsvMessage.setMsgType(msgType);
        wxCpIsvMessage.setSelectedTicketList(selectedTicketList);
        wxCpIsvMessage.setTemplateMsg(templateMsg);
        wxCpIsvMessage.setEnableIdTrans(enableIdTrans);
        wxCpIsvMessage.setOnlyUnauth(onlyUnauth);

        return wxCpIsvMessage;

    }

}
