package com.vikadata.api.enterprise.social.event.dingtalk;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.date.DatePattern;
import cn.hutool.core.date.DateTime;
import cn.hutool.core.util.StrUtil;
import cn.hutool.core.util.URLUtil;
import cn.hutool.json.JSONUtil;

import com.vikadata.api.shared.component.notification.NotificationTemplateId;
import com.vikadata.api.shared.config.properties.ClientProperties;
import com.vikadata.api.shared.config.properties.ConstProperties;
import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.player.ro.NotificationCreateRo;
import com.vikadata.api.enterprise.social.service.IDingTalkService;
import com.vikadata.api.workspace.observer.remind.NotifyDataSheetMeta;
import com.vikadata.core.util.SpringContextHolder;
import com.vikadata.social.dingtalk.message.ActionCardMessage;
import com.vikadata.social.dingtalk.message.Message;
import com.vikadata.social.dingtalk.message.element.BtnActionCard;
import com.vikadata.social.dingtalk.message.element.BtnActionCard.BtnJson;
import com.vikadata.social.dingtalk.message.element.SingleActionCard;

import static com.vikadata.api.shared.component.notification.NotificationHelper.DINGTALK_ENTRY_URL;

/**
 * <p>
 * Message Card Factory
 * </p>
 */
public class DingTalkCardFactory {
    public static final String DINGTALK_OA_OPEN = "dingtalk://dingtalkclient/action/openapp?corpid={}&container_type=work_platform&app_id=0_{}&redirect_type=jump&redirect_url={}";

    public static Message createEntryCardMsg(String agentId) {
        ConstProperties constProperties = SpringContextHolder.getBean(ConstProperties.class);
        ClientProperties clientProperties = SpringContextHolder.getBean(ClientProperties.class);
        IDingTalkService dingTalkService = SpringContextHolder.getBean(IDingTalkService.class);
        String corpId = dingTalkService.getAgentAppById(agentId).getCorpId();
        BtnActionCard btnActionCard = new BtnActionCard();
        // Vertical arrangement
        btnActionCard.setBtnOrientation("0");
        List<BtnJson> btnJsonList = new ArrayList<>();
        String redirectUrl = StrUtil.format("{}/user/dingtalk_callback?corpId={}&agentId={}&pipeline={}",
                constProperties.getServerDomain(), corpId, agentId, clientProperties.getDatasheet().getPipeline());
        String useUrl = StrUtil.format(DINGTALK_OA_OPEN, corpId, agentId, URLUtil.encodeAll(redirectUrl));
        String helpUrl = StrUtil.format(DINGTALK_OA_OPEN, corpId, agentId, URLUtil.encodeAll("https://vika.cn/help/"));
        btnJsonList.add(BtnJson.builder().title("开始使用").actionUrl(useUrl).build());
        btnJsonList.add(BtnJson.builder().title("查看帮助").actionUrl(helpUrl).build());
        btnActionCard.setBtnJsonList(btnJsonList);
        btnActionCard.setTitle("开始使用");
        btnActionCard.setMarkdown("![](https://s1.vika.cn/space/2021/06/29/9487bd92778c49748aebb74da45c9c8d)  \n  "
                + "### 🎉欢迎使用维格表  \n  "
                + "在这里，你可以收到来自维格表的成员通知、评论通知。也能够进入维格表协同工作、查看信息，随时掌握空间站动态。  \n  "
                + "新一代的团队数据协作与项目管理工具");
        return new ActionCardMessage(btnActionCard);
    }

    public static Message createRecordRemindMemberCardMsg(String agentId, String recordTitle, String memberName,
            String nodeName, String uri) {
        IDingTalkService dingTalkService = SpringContextHolder.getBean(IDingTalkService.class);
        String corpId = dingTalkService.getAgentAppById(agentId).getCorpId();
        ConstProperties constProperties = SpringContextHolder.getBean(ConstProperties.class);
        SingleActionCard singleActionCard = new SingleActionCard();
        singleActionCard.setTitle("🔔成员通知");
        singleActionCard.setSingleTitle("进入查看");
        String entryUrl = StrUtil.format(DINGTALK_ENTRY_URL, constProperties.getServerDomain(), corpId, agentId);
        String url = entryUrl.concat("&reference=" + constProperties.getServerDomain() + uri);
        singleActionCard.setSingleUrl(StrUtil.format(DINGTALK_OA_OPEN, corpId, agentId,
                URLUtil.encodeAll(url)));
        String pattern = DatePattern.CHINESE_DATE_PATTERN + " " + DatePattern.NORM_TIME_PATTERN;
        String operateAt = LocalDateTime.now().format(DateTimeFormatter.ofPattern(pattern));
        String markdownTextTmpl = "### 🔔有人在记录中提及你  \n  "
                + "**记录:** <font color=black>%s</font>  \n  "
                + "**提及人:** <font color=black>%s</font>  \n  "
                + "**维格表:** <font color=black>%s</font>  \n  "
                + "**操作时间:** <font color=black>%s</font>";
        singleActionCard.setMarkdown(String.format(markdownTextTmpl, recordTitle, memberName, nodeName, operateAt));
        return new ActionCardMessage(singleActionCard);
    }

    public static Message createCommentRemindCardMsg(String agentId, String recordTitle, String commentContent,
            String memberName, String nodeName, String uri) {
        ConstProperties constProperties = SpringContextHolder.getBean(ConstProperties.class);
        IDingTalkService dingTalkService = SpringContextHolder.getBean(IDingTalkService.class);
        String corpId = dingTalkService.getAgentAppById(agentId).getCorpId();
        SingleActionCard singleActionCard = new SingleActionCard();
        singleActionCard.setTitle("🔔评论通知");
        singleActionCard.setSingleTitle("进入查看");
        String entryUrl = StrUtil.format(DINGTALK_ENTRY_URL, constProperties.getServerDomain(), corpId, agentId);
        String url = entryUrl.concat("&reference=" + constProperties.getServerDomain() + uri);
        singleActionCard.setSingleUrl(StrUtil.format(DINGTALK_OA_OPEN, corpId, agentId,
                URLUtil.encodeAll(url)));
        String pattern = DatePattern.CHINESE_DATE_PATTERN + " " + DatePattern.NORM_TIME_PATTERN;
        String operateAt = LocalDateTime.now().format(DateTimeFormatter.ofPattern(pattern));
        String markdownTextTmpl = "### 🔔有人在评论中@你  \n  "
                + "**记录:** <font color=black>%s</font>  \n  "
                + "**内容:** <font color=black>%s</font>  \n  "
                + "**评论人:** <font color=black>%s</font>  \n  "
                + "**维格表:** <font color=black>%s</font>  \n  "
                + "**操作时间:** <font color=black>%s</font>";
        singleActionCard.setMarkdown(String.format(markdownTextTmpl, recordTitle, commentContent, memberName, nodeName, operateAt));
        return new ActionCardMessage(singleActionCard);
    }

    public static HashMap<String, String> createIsvEntryCardData(String suiteId, String authCorpId, String appId) {
        String pipeline = getPipeline();
        String redirectUrl = StrUtil.format("/user/dingtalk/social_bind_space?corpId={}&suiteId={}&pipeline={}", authCorpId, suiteId, pipeline);
        HashMap<String, String> data = new HashMap<>();
        data.put("pipeline", pipeline);
        data.put("domain", getServerDomain());
        data.put("appId", appId);
        data.put("corpId", authCorpId);
        data.put("suiteId", suiteId);
        data.put("redirectUrl", getIsvPcRedirectUrl(redirectUrl));
        return data;
    }

    public static HashMap<String, String> createIsvRecordRemindMemberData(String authCorpId, String appId,
            NotifyDataSheetMeta meta, String memberName, String nodeName, String uri) {
        HashMap<String, String> data = new HashMap<>();
        data.put("corpId", authCorpId);
        data.put("appId", appId);
        data.put("redirectUrl", getIsvPcRedirectUrl(uri));
        data.put("domain", getServerDomain());
        data.put("nodeId", meta.getNodeId());
        data.put("viewId", meta.getViewId());
        data.put("recordId", meta.getRecordId());
        data.put("notifyId", StrUtil.blankToDefault(meta.getNotifyId(), ""));
        data.put("recordTitle", meta.getRecordTitle());
        data.put("memberName", memberName);
        data.put("nodeName", nodeName);
        data.put("operateAt", meta.getCreatedAt());
        return data;
    }

    public static HashMap<String, String> createIsvCommentRemindData(String authCorpId, String appId,
            NotifyDataSheetMeta meta, String memberName, String nodeName, String commentContent, String uri) {
        HashMap<String, String> data = createIsvRecordRemindMemberData(authCorpId, appId, meta, memberName, nodeName, uri);
        data.put("commentContent", commentContent);
        return data;
    }

    public static String getIsvPcRedirectUrl(String uri) {
        ConstProperties constProperties = SpringContextHolder.getBean(ConstProperties.class);
        return URLUtil.encodeAll(constProperties.getServerDomain() + uri);
    }

    public static String getServerDomain() {
        ConstProperties constProperties = SpringContextHolder.getBean(ConstProperties.class);
        return URLUtil.url(constProperties.getServerDomain()).getHost();
    }

    public static String getPipeline() {
        ClientProperties clientProperties = SpringContextHolder.getBean(ClientProperties.class);
        return StrUtil.blankToDefault(clientProperties.getDatasheet().getPipeline(), "");
    }

    public static NotificationCreateRo createActivityNotifyBody() {
        NotificationCreateRo ro = new NotificationCreateRo();
        ro.setTemplateId(NotificationTemplateId.SERVER_PRE_PUBLISH.getValue());
        ro.setSocialPlatformType(SocialPlatformType.DINGTALK.getValue());
        Map<String, Object> toast = new HashMap<>();
        toast.put("title", "🎁双11年度钜惠限时购！");
        toast.put("content", "欢迎来到维格星球，「vika维格表」是新一代的数据生产力平台。<br>"
                + "双11年度钜惠，升级维格表空间站等级，满2000减1000，满1000减500 ，满1年送3个月 。<br>"
                + "活动有效期，即日起至2021年11月11日24:00，赶紧升级订阅吧～");
        toast.put("closable", true);
        toast.put("btnText", "立即前往");
        toast.put("onBtnClick", CollUtil.toList("window_open_url()"));
        toast.put("destroyPrev", false);
        toast.put("showVikaby", true);
        toast.put("duration", 0);
        toast.put("onClose", new ArrayList<>());
        toast.put("url", "http://h5.dingtalk.com/open-purchase/mobileUrl.html?redirectUrl=https%3A%2F%2Fh5.dingtalk.com%2Fopen-market%2Fshare.html%3FshareGoodsCode%3DD34E5A30A9AC7FC6CA73DEEEDFCEC860C2F97D997C85C521B71035D4F4F2DADF5E69AE3825326C7F%26token%3D65482d6a78796151887e033769bebfd8%26shareUid%3DBCB170692B0B56DA0C22819901B68B80&dtaction=os");
        Map<String, Object> extras = new HashMap<>();
        extras.put("toast", toast);
        extras.put("socialPlatformType", SocialPlatformType.DINGTALK.getValue());
        extras.put("channel", "vikaby_dialog, notification_center");
        Map<String, Object> body = new HashMap<>();
        body.put("extras", extras);
        body.put("needVersionCompare", false);
        ro.setBody(JSONUtil.parseObj(body));
        DateTime dateTime = new DateTime("2021-11-11 23:59:59", DatePattern.NORM_DATETIME_FORMAT);
        ro.setExpireAt(String.valueOf(dateTime.getTime()));
        return ro;
    }
}
