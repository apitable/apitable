package com.vikadata.api.enterprise.social.event.wecom;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.List;
import java.util.Objects;

import cn.hutool.core.lang.Dict;
import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.core.util.URLUtil;
import cn.hutool.http.HtmlUtil;
import me.chanjar.weixin.cp.bean.article.NewArticle;
import me.chanjar.weixin.cp.bean.message.WxCpMessage;

import com.vikadata.api.shared.util.UrlQueryExtend;
import com.vikadata.social.wecom.model.WxCpIsvMessage;

/**
 * <p>
 * WeCom Third Party Service Provider Message Card
 * </p>
 */
public final class WeComIsvCardFactory {

    private WeComIsvCardFactory() {
        // default constructor
    }

    public static final String WECOM_ISV_LOGIN_PATH = "{https_enp_domain}/user/wecom_shop/social_login?suiteid={suiteId}";

    public static final String WECOM_ISV_INVITE_CALLBACK_PATH = "{https_enp_domain}/user/wecom/invite_response?suiteid={suiteId}";

    public static final String WECOM_OAUTH_PATH = "https://open.weixin.qq.com/connect/oauth2/authorize?appid={suiteId}&redirect_uri={redirect_uri}&response_type=code&scope=snsapi_privateinfo&state={suiteId}#wechat_redirect";

    /**
     * Welcome Message
     *
     * @param agentId   Enterprise application ID
     */
    public static WxCpMessage createWelcomeMsg(Integer agentId) {

        String title = "欢迎使用维格表！";
        String description = "在这里，你可以收到来自 维格表 的成员通知、评论通知。"
                + "\n\n"
                + "也能够进入 维格表 协同工作、查看信息，随时掌握空间站动态！"
                + "\n\n"
                + "点击本卡片，马上前往 维格表✨";

        WxCpMessage wxCpMessage = WxCpMessage.NEWS()
                .agentId(agentId)
                .addArticle(NewArticle.builder()
                        .title(title)
                        .description(description)
                        .url(WECOM_ISV_LOGIN_PATH)
                        .picUrl("https://s1.vika.cn/space/2021/06/29/9487bd92778c49748aebb74da45c9c8d")
                        .build())
                .build();
        // Enable duplicate message check to prevent users from receiving multiple notifications during enterprise authorized installation
        wxCpMessage.setEnableDuplicateCheck(true);
        wxCpMessage.setDuplicateCheckInterval(10);

        return wxCpMessage;

    }

    /**
     * Member field mentioned message
     *
     * @param agentId       Enterprise application ID
     * @param recordTitle   Record Title
     * @param memberName    @Member Name
     * @param nodeName      datasheet name
     * @param url           Details Url
     */
    public static WxCpMessage createRecordRemindMemberCardMsg(Integer agentId, String recordTitle,
            String memberName, Boolean memberNameModified, String nodeName, String url) {

        // When the member name has not been modified, the openId needs to be translated
        boolean isTransId = Objects.nonNull(memberNameModified) && !memberNameModified;
        String description = "记录：{recordTitle}"
                + "\n"
                + "提及人：" + (isTransId ? "$userName={memberName}$" : "{memberName}")
                + "\n"
                + "维格表：{nodeName}";
        Dict variable = Dict.create()
                .set("recordTitle", recordTitle)
                .set("memberName", memberName)
                .set("nodeName", nodeName);

        // Remove Url comment parameter
        url = UrlQueryExtend.ridUrlParam(url, "comment");
        String callbackUrl = WECOM_ISV_LOGIN_PATH
                .concat("&reference={https_enp_domain}")
                .concat(URLUtil.encodeAll(CharSequenceUtil.prependIfMissingIgnoreCase(url, "/")));

        WxCpMessage wxCpMessage = WxCpMessage.TEXTCARD()
                .agentId(agentId)
                .title("有人在记录中提及你")
                .description(StrUtil.format(description, variable))
                .url(callbackUrl)
                .build();
        wxCpMessage.setEnableIdTrans(true);

        return wxCpMessage;

    }

    /**
     * Comments mention information
     *
     * @param agentId           Enterprise application ID
     * @param recordTitle       Record Title
     * @param commentContent    Comments
     * @param memberName        @Member Name
     * @param nodeName          datasheet name
     * @param url               Details Url
     */
    public static WxCpMessage createCommentRemindCardMsg(Integer agentId, String recordTitle,
            String commentContent, String memberName, Boolean memberNameModified, String nodeName, String url) {

        // When the member name has not been modified, the openId needs to be translated
        boolean isTransId = Objects.nonNull(memberNameModified) && !memberNameModified;
        String description = "记录：{recordTitle}"
                + "\n"
                + "内容：{commentContent}"
                + "\n"
                + "提及人：" + (isTransId ? "$userName={memberName}$" : "{memberName}")
                + "\n"
                + "维格表：{nodeName}";
        Dict variable = Dict.create()
                .set("recordTitle", recordTitle)
                .set("commentContent", HtmlUtil.unescape(HtmlUtil.cleanHtmlTag(commentContent)))
                .set("memberName", memberName)
                .set("nodeName", nodeName);

        String callbackUrl = WECOM_ISV_LOGIN_PATH
                .concat("&reference={https_enp_domain}")
                .concat(URLUtil.encodeAll(CharSequenceUtil.prependIfMissingIgnoreCase(url, "/")));

        WxCpMessage wxCpMessage = WxCpMessage.TEXTCARD()
                .agentId(agentId)
                .title("有人在评论中提及你")
                .description(StrUtil.format(description, variable))
                .url(callbackUrl)
                .build();
        wxCpMessage.setEnableIdTrans(true);

        return wxCpMessage;

    }

    /**
     * Member Mode Invitation Message
     *
     * @param agentId           Enterprise application ID
     * @param templateId        Message template ID
     * @param selectedTickets   Selected member tickets
     * @param memberName        Member Name
     * @param memberNameModified Whether the member name has been modified
     */
    public static WxCpIsvMessage createMemberInviteTemplateMsg(String suiteId, Integer agentId, String templateId, List<String> selectedTickets,
            String memberName, Boolean memberNameModified, String redirectUrlDomain) {

        Dict variable = Dict.create()
                .set("suiteId", suiteId)
                .set("https_enp_domain", redirectUrlDomain);
        String redirectUri;
        try {
            redirectUri = URLEncoder.encode(StrUtil.format(WECOM_ISV_INVITE_CALLBACK_PATH, variable), "UTF-8");
            variable.set("redirect_uri", redirectUri);
        }
        catch (UnsupportedEncodingException ex) {
            throw new IllegalArgumentException(ex);
        }

        // When the member name has not been modified, the openId needs to be translated
        boolean isTransId = Objects.nonNull(memberNameModified) && !memberNameModified;
        String oauthUrl = StrUtil.format(WECOM_OAUTH_PATH, variable);

        return WxCpIsvMessage.TEMPLATEMSG()
                .agentId(agentId)
                .selectedTicketList(selectedTickets)
                .templateId(templateId)
                .url(oauthUrl)
                .contentItem("邀请人", isTransId ? "$userName=" + memberName + "$" : memberName)
                .enableIdTrans(true)
                .onlyUnauth(true)
                .build();

    }

}
