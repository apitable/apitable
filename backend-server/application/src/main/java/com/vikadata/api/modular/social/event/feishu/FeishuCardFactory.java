package com.vikadata.api.modular.social.event.feishu;

import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

import com.vikadata.api.config.properties.FeishuAppProperties;
import com.vikadata.core.util.SpringContextHolder;
import com.vikadata.social.core.URIUtil;
import com.vikadata.social.feishu.card.Card;
import com.vikadata.social.feishu.card.CardMessage;
import com.vikadata.social.feishu.card.Config;
import com.vikadata.social.feishu.card.Header;
import com.vikadata.social.feishu.card.Message;
import com.vikadata.social.feishu.card.element.Button;
import com.vikadata.social.feishu.card.module.Action;
import com.vikadata.social.feishu.card.module.Div;
import com.vikadata.social.feishu.card.module.Module;
import com.vikadata.social.feishu.card.objects.Text;

/**
 * Message Card Factory
 */
public class FeishuCardFactory {

    public static Message createV2EntryCardMsg(String appId) {
        String FEISHU_WEB_OPEN = "https://applink.feishu.cn/client/web_app/open?appId=%s";
        String FEISHU_INNER_WEB_VIEW = "https://applink.feishu.cn/client/web_url/open?mode=window&url=%s";
        // Create Card
        Header header = new Header(new Text(Text.Mode.LARK_MD, "**\uD83C\uDF89 欢迎使用维格表**"));
        Card card = new Card(new Config(false), header);
        List<Module> divList = new LinkedList<>();
        divList.add(new Div(new Text(Text.Mode.LARK_MD, "在这里，你可以收到来自维格表的成员通知、评论通知。也能够进入维格表 协同工作、查看信息，随时掌握空间站动态。")));
        divList.add(new Div(new Text(Text.Mode.LARK_MD, "维格表，新一代的团队数据协作与项目管理工具。")));
        Button entryBtn = new Button(new Text(Text.Mode.LARK_MD, "开始使用"))
                .setUrl(String.format(FEISHU_WEB_OPEN, appId))
                .setType(Button.StyleType.PRIMARY);
        FeishuAppProperties feishuAppProperties = SpringContextHolder.getBean(FeishuAppProperties.class);
        divList.add(new Div(new Text(Text.Mode.LARK_MD, String.format("或随时联系\uD83D\uDC49[在线客服](%s)", feishuAppProperties.getHelpDeskUri()))));
        Button helpBtn = new Button(new Text(Text.Mode.LARK_MD, "查看帮助"))
                .setUrl(String.format(FEISHU_INNER_WEB_VIEW, URIUtil.encodeURIComponent(feishuAppProperties.getHelpUri())));
        divList.add(new Action(Arrays.asList(entryBtn, helpBtn)));
        // Set Content Elements
        card.setModules(divList);
        return new CardMessage(card.toObj());
    }

    /**
     * Self built application 《Welcome》 message card
     * Self built applications cannot be accessed using the app link protocol, but only through the authorized address
     * @param appId App ID
     * @return Message
     */
    public static Message createInternalEntryCardMsg(String appId) {
        String appLink = "https://applink.feishu.cn/client/web_app/open?appId=%s";
        // Create Card
        Header header = new Header(new Text(Text.Mode.LARK_MD, "**\uD83C\uDF89 欢迎使用维格表**"));
        Card card = new Card(new Config(false), header);
        List<Module> divList = new LinkedList<>();
        divList.add(new Div(new Text(Text.Mode.LARK_MD, "在这里，你可以收到来自维格表的成员通知、评论通知。也能够进入维格表 协同工作、查看信息，随时掌握空间站动态。")));
        divList.add(new Div(new Text(Text.Mode.LARK_MD, "维格表，新一代的团队数据协作与项目管理工具。")));
        Button entryBtn = new Button(new Text(Text.Mode.LARK_MD, "开始使用"))
                .setUrl(String.format(appLink, appId))
                .setType(Button.StyleType.PRIMARY);
        divList.add(new Action(Collections.singletonList(entryBtn)));
        // Set Content Elements
        card.setModules(divList);
        return new CardMessage(card.toObj());
    }
}
