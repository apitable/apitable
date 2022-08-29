package com.vikadata.api.modular.social.event.wecom;

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

import com.vikadata.api.util.UrlQueryExtend;
import com.vikadata.social.wecom.model.WxCpIsvMessage;

/**
 * <p>
 * 企业微信第三方服务商消息卡片
 * </p>
 * @author 刘斌华
 * @date 2022-01-21 14:53:58
 */
public final class WeComIsvCardFactory {

    private WeComIsvCardFactory() {
        // default constructor
    }

    public static final String WECOM_ISV_LOGIN_PATH = "{https_enp_domain}/user/wecom_shop/social_login?suiteid={suiteId}";

    public static final String WECOM_ISV_INVITE_CALLBACK_PATH = "{https_enp_domain}/user/wecom/invite_response?suiteid={suiteId}";

    public static final String WECOM_OAUTH_PATH = "https://open.weixin.qq.com/connect/oauth2/authorize?appid={suiteId}&redirect_uri={redirect_uri}&response_type=code&scope=snsapi_privateinfo&state={suiteId}#wechat_redirect";

    /**
     * 欢迎使用消息
     *
     * @param agentId   企业应用ID
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
        // 开启重复消息检查，防止企业授权安装时用户收到多条通知
        wxCpMessage.setEnableDuplicateCheck(true);
        wxCpMessage.setDuplicateCheckInterval(10);

        return wxCpMessage;

    }

    /**
     * 成员字段被提及消息
     *
     * @param agentId       企业应用ID
     * @param recordTitle   记录标题
     * @param memberName    @成员名称
     * @param nodeName      datasheet表名
     * @param url           详情Url
     */
    public static WxCpMessage createRecordRemindMemberCardMsg(Integer agentId, String recordTitle,
            String memberName, Boolean memberNameModified, String nodeName, String url) {

        // 没有修改过成员名称时，需要对 openId 转译
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

        // 移除Url comment 参数
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
     * 评论提及消息
     *
     * @param agentId           企业应用ID
     * @param recordTitle       记录标题
     * @param commentContent    评论内容
     * @param memberName        @成员名称
     * @param nodeName          datasheet表名
     * @param url               详情Url
     */
    public static WxCpMessage createCommentRemindCardMsg(Integer agentId, String recordTitle,
            String commentContent, String memberName, Boolean memberNameModified, String nodeName, String url) {

        // 没有修改过成员名称时，需要对 openId 转译
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
     * 成员模式邀请消息
     *
     * @param agentId           企业应用ID
     * @param templateId        消息模板 ID
     * @param selectedTickets   选择的成员票据
     * @param memberName        成员名称
     * @param memberNameModified 成员名称是否已修改
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

        // 没有修改过成员名称时，需要对 openId 转译
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
