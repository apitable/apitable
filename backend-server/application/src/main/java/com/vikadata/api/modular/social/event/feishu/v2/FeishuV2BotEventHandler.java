package com.vikadata.api.modular.social.event.feishu.v2;

import javax.annotation.Resource;

import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.social.service.IFeishuEventService;
import com.vikadata.api.modular.social.service.IFeishuInternalEventService;
import com.vikadata.api.modular.social.service.ISocialFeishuEventLogService;
import com.vikadata.boot.autoconfigure.social.feishu.annotation.FeishuEventHandler;
import com.vikadata.boot.autoconfigure.social.feishu.annotation.FeishuEventListener;
import com.vikadata.social.feishu.event.bot.AddBotEvent;
import com.vikadata.social.feishu.event.bot.FileMessageEvent;
import com.vikadata.social.feishu.event.bot.ImageMessageEvent;
import com.vikadata.social.feishu.event.bot.MergeForwardMessageEvent;
import com.vikadata.social.feishu.event.bot.P2pChatCreateEvent;
import com.vikadata.social.feishu.event.bot.PostMessageEvent;
import com.vikadata.social.feishu.event.bot.TextMessageEvent;

/**
 * Lark
 * Event Subscription - Robot Events
 */
@Slf4j
@FeishuEventHandler
public class FeishuV2BotEventHandler {

    @Resource
    private ISocialFeishuEventLogService iSocialFeishuEventLogService;

    @Resource
    private IFeishuEventService iFeishuEventService;

    @Resource
    private IFeishuInternalEventService iFeishuInternalEventService;

    @FeishuEventListener
    public Object onP2pChatCreateEvent(P2pChatCreateEvent event) {
        log.info("Received event [The session between user and robot is created for the first time] ：{}", JSONUtil.toJsonStr(event));
        iSocialFeishuEventLogService.create(event);
        if (event.getAppInstanceId() != null) {
            iFeishuInternalEventService.handleP2pChatCreateEvent(event);
        }
        else {
            iFeishuEventService.handleP2pChatCreateEvent(event);
        }
        return null;
    }

    @FeishuEventListener
    public Object onAddBotEvent(AddBotEvent event) {
        log.info("Received event [Robots enter the group] ：{}", JSONUtil.toJsonStr(event));
        iSocialFeishuEventLogService.create(event);
        if (event.getAppInstanceId() != null) {
            iFeishuInternalEventService.handleAddBotEvent(event);
        }
        else {
            iFeishuEventService.handleAddBotEvent(event);
        }
        return null;
    }

    @FeishuEventListener
    public Object onTextMessageEvent(TextMessageEvent event) {
        log.info("Robot receives user message [Text Message] : {}", JSONUtil.toJsonStr(event));
        iSocialFeishuEventLogService.create(event);
        if (event.getAppInstanceId() != null) {
            iFeishuInternalEventService.handleMessageEvent(event);
        }
        else {
            iFeishuEventService.handleMessageEvent(event);
        }
        return null;
    }

    @FeishuEventListener
    public Object onPostMessageEvent(PostMessageEvent event) {
        log.info("Robot receives user message [Rich text and post messages] : {}", JSONUtil.toJsonStr(event));
        iSocialFeishuEventLogService.create(event);
        if (event.getAppInstanceId() != null) {
            iFeishuInternalEventService.handleMessageEvent(event);
        }
        else {
            iFeishuEventService.handleMessageEvent(event);
        }
        return null;
    }

    @FeishuEventListener
    public Object onImageMessageEvent(ImageMessageEvent event) {
        log.info("Robot receives user message [Picture Message] : {}", JSONUtil.toJsonStr(event));
        iSocialFeishuEventLogService.create(event);
        if (event.getAppInstanceId() != null) {
            iFeishuInternalEventService.handleMessageEvent(event);
        }
        else {
            iFeishuEventService.handleMessageEvent(event);
        }
        return null;
    }

    @FeishuEventListener
    public Object onFileMessageEvent(FileMessageEvent event) {
        log.info("Robot receives user message [File Message] : {}", JSONUtil.toJsonStr(event));
        iSocialFeishuEventLogService.create(event);
        if (event.getAppInstanceId() != null) {
            iFeishuInternalEventService.handleMessageEvent(event);
        }
        else {
            iFeishuEventService.handleMessageEvent(event);
        }
        return null;
    }

    @FeishuEventListener
    public Object onMergeForwardMessageEvent(MergeForwardMessageEvent event) {
        log.info("Robot receives user message [Merge and forward message content] : {}", JSONUtil.toJsonStr(event));
        iSocialFeishuEventLogService.create(event);
        if (event.getAppInstanceId() != null) {
            iFeishuInternalEventService.handleMessageEvent(event);
        }
        else {
            iFeishuEventService.handleMessageEvent(event);
        }
        return null;
    }
}
