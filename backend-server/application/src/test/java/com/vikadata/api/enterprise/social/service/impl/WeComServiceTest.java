package com.vikadata.api.enterprise.social.service.impl;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.json.JSONUtil;
import lombok.SneakyThrows;
import me.chanjar.weixin.cp.api.WxCpService;
import me.chanjar.weixin.cp.bean.message.WxCpMessage;
import me.chanjar.weixin.cp.bean.message.WxCpMessageSendResult;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.enterprise.social.event.wecom.WeComCardFactory;
import com.vikadata.api.enterprise.social.service.IWeComService;
import com.vikadata.api.shared.util.UrlQueryExtend;
import com.vikadata.social.wecom.WeComConfig;
import com.vikadata.social.wecom.WeComConfig.OperateEnpDdns;
import com.vikadata.social.wecom.WeComTemplate;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;

@Disabled("no assertion")
public class WeComServiceTest {

    private static WeComConfig weComConfig;

    private static WxCpService service;

    private static WeComTemplate weComTemplate;

    private final static String corpld = "wwc6fc45007ec95bf0";

    private final static Integer agentId = 1000002;

    private final static String agentSecret = "GXH2C1YOIa3_6ulUxIb-Z5gwuM1h5p0qFXk1et5cMZY";

    static {
        OperateEnpDdns operateEnpDdns = new OperateEnpDdns();
        operateEnpDdns.setApiHost("https://inner.vika.ltd");
        operateEnpDdns.setApiHost("/ddns");

        weComConfig = new WeComConfig("memory", "vikadata");
        weComConfig.setOperateEnpDdns(operateEnpDdns);

        weComTemplate = new WeComTemplate(weComConfig);

        service = weComTemplate.addService(corpld, agentId, agentSecret);
    }

    @SneakyThrows
    @Test
    public void sendMessage() {
        WxCpMessage message = WeComCardFactory.createWelcomeMsg(agentId);
        message.setToUser("@all");

        WxCpMessageSendResult send = service.getMessageService().send(message);
        System.out.println(JSONUtil.toJsonPrettyStr(send));
    }

    @SneakyThrows
    @Test
    public void sendRecordRemindMemberCardMsg() {
        WxCpMessage message = WeComCardFactory.createRecordRemindMemberCardMsg(agentId, "test record one", "Pengap", "test enterprise wechat messages",
                "https://integration.vika.ltd");
        message.setToUser("PengAnPing");

        WxCpMessageSendResult send = service.getMessageService().send(message);
        System.out.println(JSONUtil.toJsonPrettyStr(send));
    }

    @SneakyThrows
    @Test
    public void sendCommentRemindCardMsg() {
        WxCpMessage message = WeComCardFactory.createCommentRemindCardMsg(agentId, "test record one", "  Test enterprise WeChat comment messages&nbsp;", "Pengap",
                "test enterprise wechat messages", "https://integration.vika.ltd");
        message.setToUser("null");

        WxCpMessageSendResult send = service.getMessageService().send(message);
        System.out.println(JSONUtil.toJsonPrettyStr(send));
    }

    @Test
    public void removeUrlPath() {
        String paht = "/workbench/dst/dw/ssd?comment=1&notifyId=222";

        System.out.println(
                UrlQueryExtend.ridUrlParam(paht, "comment1")
        );
    }

    @Disabled("no assertion")
    @SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
    public static class InternalTest {
        @Resource
        private IWeComService iWeComService;

        @SneakyThrows
        @Test
        public void serviceToSendRecordRemindMemberCardMsg() {
            WxCpMessage recordRemindMemberMsg = WeComCardFactory.createRecordRemindMemberCardMsg(agentId, "Test Record", "Member name", "test title", "/workbench/dstD8sjYBArvfS6qv4/viwMsGBk1UBPr/rec43LVF10W5w?notifyId=b2c6c854a97c4b82be198c423902d144");
            iWeComService.sendMessageToUserPrivate(corpld, agentId, "spcH5N5x2572s", CollUtil.toList("PengAnPing"), recordRemindMemberMsg);
        }

        @Test
        public void createFixedMenuTest() {
            iWeComService.createFixedMenu(corpld, agentId, "spcH5N5x2572s");
        }

    }

}
