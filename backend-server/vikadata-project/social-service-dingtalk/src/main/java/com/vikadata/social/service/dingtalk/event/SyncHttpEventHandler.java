package com.vikadata.social.service.dingtalk.event;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventHandler;
import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventListener;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.social.dingtalk.DingTalkServiceProvider;
import com.vikadata.social.dingtalk.enums.DingTalkBizType;
import com.vikadata.social.dingtalk.event.BaseSyncHttpBizData;
import com.vikadata.social.dingtalk.event.SyncHttpPushHighEvent;
import com.vikadata.social.dingtalk.event.SyncHttpPushMediumEvent;
import com.vikadata.social.service.dingtalk.component.TaskManager;
import com.vikadata.social.service.dingtalk.service.IDingTalkOpenSyncBizDataMediumService;
import com.vikadata.social.service.dingtalk.service.IDingTalkOpenSyncBizDataService;

import static com.vikadata.social.dingtalk.DingTalkServiceProvider.EVENT_CALLBACK_TYPE_KEY;
import static com.vikadata.social.dingtalk.constants.DingTalkConst.DING_TALK_CALLBACK_SUCCESS;

/**
 * <p>
 * 事件订阅 -- 高优先级数据，激活应用等
 * 事件订阅 -- 普通优先级数据，例如通讯录变更
 * </p>
 * @author zoe zheng
 * @date 2021/9/2 4:13 下午
 */
@DingTalkEventHandler
@Slf4j
public class SyncHttpEventHandler {
    @Resource
    private IDingTalkOpenSyncBizDataService iDingTalkOpenSyncBizDataService;

    @Resource
    private IDingTalkOpenSyncBizDataMediumService iDingTalkOpenSyncBizDataMediumService;

    /**
     * 处理 高优先级数据，激活应用等
     *
     * @param event 事件内容
     * @return 响应内容
     */
    @DingTalkEventListener
    public Object onSyncHttpPushHighEvent(String suiteId, SyncHttpPushHighEvent event) {
        log.info("收到ISV钉钉推送事件[{}]", event.getEventType());
        DingTalkServiceProvider dingtalkServiceProvider = SpringContextHolder.getBean(DingTalkServiceProvider.class);
        // 先根据bizType排序,从小到大
        List<BaseSyncHttpBizData> bizDataList = event.getBizData().stream().sorted(Comparator.comparing(BaseSyncHttpBizData::getBizType)).collect(Collectors.toList());
        for (BaseSyncHttpBizData bizData : bizDataList) {
            // 异步创建,防止影响性能
            TaskManager.me().execute(() -> iDingTalkOpenSyncBizDataService.create(bizData.getSubscribeId(),
                    bizData.getCorpId(), bizData.getBizType(), bizData.getBizId(), bizData.getBizData()));
            if (!DingTalkBizType.hasValue(bizData.getBizType())) {
                log.error("收到未定的bizType处理事件:{}", bizData.getBizType());
                continue;
            }
            JSONObject eventData = JSONUtil.parseObj(bizData.getBizData());
            eventData.set(EVENT_CALLBACK_TYPE_KEY, event.getEventType());
            try {
                dingtalkServiceProvider.handleIsvAppEventNotify(suiteId, eventData, bizData.getCorpId(), suiteId);
            }
            catch (Exception e) {
                log.error("处理SyncAction异常:{}:{}", bizData.getBizId(), bizData.getBizType(), e);
            }
        }
        // 钉钉的事件推送不会重复 无论如何都返回true 保证服务稳定性，业务异常交给下层服务处理
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * 普通优先级数据，例如通讯录变更
     *
     * @param event 事件内容
     * @return 响应内容
     */
    @DingTalkEventListener
    public Object onSyncHttpPushMediumEvent(String suiteId, SyncHttpPushMediumEvent event) {
        log.info("收到钉钉推送事件{}", event.getEventType());
        DingTalkServiceProvider dingtalkServiceProvider = SpringContextHolder.getBean(DingTalkServiceProvider.class);
        for (BaseSyncHttpBizData bizData : event.getBizData()) {
            // 异步创建,防止影响性能,高优先级和中等优先级与钉钉保持一致分开存储
            TaskManager.me().execute(() -> iDingTalkOpenSyncBizDataMediumService.create(bizData.getSubscribeId(),
                    bizData.getCorpId(), bizData.getBizType(), bizData.getBizId(), bizData.getBizData()));
            if (!DingTalkBizType.hasValue(bizData.getBizType())) {
                log.error("收到未定的bizType处理事件:{}", bizData.getBizType());
                return null;
            }
            JSONObject eventData = JSONUtil.parseObj(bizData.getBizData());
            eventData.set(EVENT_CALLBACK_TYPE_KEY, event.getEventType());
            try {
                dingtalkServiceProvider.handleIsvAppEventNotify(bizData.getBizId(), eventData, bizData.getCorpId(), suiteId);
            }
            catch (Exception e) {
                log.error("处理SyncAction异常:{}:{}", bizData.getBizId(), bizData.getBizType(), e);
            }
        }
        // 钉钉的事件推送不会重复
        return DING_TALK_CALLBACK_SUCCESS;
    }
}
