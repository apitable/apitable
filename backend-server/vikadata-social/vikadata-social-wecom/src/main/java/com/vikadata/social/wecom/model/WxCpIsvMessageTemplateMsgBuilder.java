package com.vikadata.social.wecom.model;

import java.util.List;
import java.util.Objects;

import com.google.common.collect.Maps;
import me.chanjar.weixin.cp.bean.messagebuilder.BaseBuilder;

import com.vikadata.social.wecom.model.WxCpIsvMessage.TemplateMsg;

/**
 * <p>
 * 企微服务商模板消息 builder
 * </p>
 * @author 刘斌华
 * @date 2022-04-18 18:37:11
 */
public class WxCpIsvMessageTemplateMsgBuilder extends BaseBuilder<WxCpIsvMessageTemplateMsgBuilder> {

    /**
     * 选人sdk或者选人jsapi返回的ticket列表，列表不超过10个。接收者不包含selected_tikcet的操作者，若要发送给操作者，可将操作者填到touser字段。
     */
    private List<String> selectedTicketList;

    /**
     * 消息内容
     */
    private TemplateMsg templateMsg = new TemplateMsg();

    /**
     * 是否启用 ID 转译
     */
    private Boolean enableIdTrans;

    /**
     * 是否仅向未授权的用户发送消息
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
