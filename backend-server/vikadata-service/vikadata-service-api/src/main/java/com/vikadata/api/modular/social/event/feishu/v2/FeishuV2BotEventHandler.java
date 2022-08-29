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
 * 飞书
 * 事件订阅 - 机器人事件
 *
 * @author Shawn Deng
 * @date 2020-11-26 19:05:29
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
        log.info("收到事件 [用户和机器人的会话首次被创建] ：{}", JSONUtil.toJsonStr(event));
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
        log.info("收到事件 [机器人进群] ：{}", JSONUtil.toJsonStr(event));
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
        log.info("机器人收到用户消息 [文本消息] : {}", JSONUtil.toJsonStr(event));
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
        log.info("机器人收到用户消息 [富文本和 post 消息] : {}", JSONUtil.toJsonStr(event));
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
        log.info("机器人收到用户消息 [图片消息] : {}", JSONUtil.toJsonStr(event));
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
        log.info("机器人收到用户消息 [文件消息] : {}", JSONUtil.toJsonStr(event));
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
        log.info("机器人收到用户消息 [合并转发消息内容] : {}", JSONUtil.toJsonStr(event));
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
