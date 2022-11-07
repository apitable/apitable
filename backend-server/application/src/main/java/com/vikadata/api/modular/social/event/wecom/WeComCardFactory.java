package com.vikadata.api.modular.social.event.wecom;

import cn.hutool.core.lang.Dict;
import cn.hutool.core.util.StrUtil;
import cn.hutool.core.util.URLUtil;
import cn.hutool.http.HtmlUtil;
import me.chanjar.weixin.cp.bean.article.NewArticle;
import me.chanjar.weixin.cp.bean.message.WxCpMessage;

import com.vikadata.api.util.UrlQueryExtend;
import com.vikadata.core.util.SpringContextHolder;
import com.vikadata.api.config.properties.ClientProperties;

/**
 * <p>
 * WeCom Message Card Factory
 * </p>
 */
public class WeComCardFactory {

    public static final String WECOM_CALLBACK_PATH = "{https_enp_domain}/user/wecom_callback?corpId={corpId}&agentId={agentId}";

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

        return WxCpMessage.NEWS().agentId(agentId)
                .addArticle(
                        NewArticle.builder()
                                .title(title)
                                .description(description)
                                .url(getWecomCallbackPath())
                                .picUrl("https://s1.vika.cn/space/2021/06/29/9487bd92778c49748aebb74da45c9c8d")
                                .build()
                )
                .build();
    }

    /**
     * Get WeCom app home Page Path
     */
    public static String getWecomCallbackPath() {
        ClientProperties clientProperties = SpringContextHolder.getBean(ClientProperties.class);
        String redirectUrl = WECOM_CALLBACK_PATH;
        if (StrUtil.isNotBlank(clientProperties.getDatasheet().getPipeline())) {
            redirectUrl = redirectUrl.concat("&pipeline=" + clientProperties.getDatasheet().getPipeline());
        }
        return redirectUrl;
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
    public static WxCpMessage createRecordRemindMemberCardMsg(Integer agentId, String recordTitle, String memberName, String nodeName, String url) {
        String description = "记录：{recordTitle}"
                + "\n"
                + "提及人：{memberName}"
                + "\n"
                + "维格表：{nodeName}";
        Dict variable = Dict.create()
                .set("recordTitle", recordTitle)
                .set("memberName", memberName)
                .set("nodeName", nodeName);

        // Remove Url comment parameter
        url = UrlQueryExtend.ridUrlParam(url, "comment");
        String callbackUrl = getWecomCallbackPath().concat("&reference={https_enp_domain}").concat(URLUtil.encodeAll(StrUtil.prependIfMissingIgnoreCase(url, "/")));

        return WxCpMessage.TEXTCARD().agentId(agentId)
                .title("有人在记录中提及你")
                .description(StrUtil.format(description, variable))
                .url(callbackUrl)
                .build();
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
    public static WxCpMessage createCommentRemindCardMsg(Integer agentId, String recordTitle, String commentContent, String memberName, String nodeName, String url) {
        String description = "记录：{recordTitle}"
                + "\n"
                + "内容：{commentContent}"
                + "\n"
                + "提及人：{memberName}"
                + "\n"
                + "维格表：{nodeName}";
        Dict variable = Dict.create()
                .set("recordTitle", recordTitle)
                .set("commentContent", HtmlUtil.unescape(HtmlUtil.cleanHtmlTag(commentContent)))
                .set("memberName", memberName)
                .set("nodeName", nodeName);

        String callbackUrl = getWecomCallbackPath().concat("&reference={https_enp_domain}").concat(URLUtil.encodeAll(StrUtil.prependIfMissingIgnoreCase(url, "/")));

        return WxCpMessage.TEXTCARD().agentId(agentId)
                .title("有人在评论中提及你")
                .description(StrUtil.format(description, variable))
                .url(callbackUrl)
                .build();
    }

}
