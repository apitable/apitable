package com.vikadata.api.modular.social.event.wecom;

import cn.hutool.core.lang.Dict;
import cn.hutool.core.util.StrUtil;
import cn.hutool.core.util.URLUtil;
import cn.hutool.http.HtmlUtil;
import me.chanjar.weixin.cp.bean.article.NewArticle;
import me.chanjar.weixin.cp.bean.message.WxCpMessage;

import com.vikadata.api.util.UrlQueryExtend;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.api.config.properties.ClientProperties;

/**
 * <p>
 * 企业微信消息卡片工厂
 * </p>
 * @author Pengap
 * @date 2021/8/11 17:38:23
 */
public class WeComCardFactory {

    public static final String WECOM_CALLBACK_PATH = "{https_enp_domain}/user/wecom_callback?corpId={corpId}&agentId={agentId}";

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
     * 获取企业微信应用homePagePath
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
     * 成员字段被提及消息
     *
     * @param agentId       企业应用ID
     * @param recordTitle   记录标题
     * @param memberName    @成员名称
     * @param nodeName      datasheet表名
     * @param url           详情Url
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

        // 移除Url comment 参数
        url = UrlQueryExtend.ridUrlParam(url, "comment");
        String callbackUrl = getWecomCallbackPath().concat("&reference={https_enp_domain}").concat(URLUtil.encodeAll(StrUtil.prependIfMissingIgnoreCase(url, "/")));

        return WxCpMessage.TEXTCARD().agentId(agentId)
                .title("有人在记录中提及你")
                .description(StrUtil.format(description, variable))
                .url(callbackUrl)
                .build();
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
