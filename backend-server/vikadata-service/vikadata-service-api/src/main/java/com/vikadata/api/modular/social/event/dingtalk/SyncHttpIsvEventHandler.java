package com.vikadata.api.modular.social.event.dingtalk;

import java.util.Comparator;
import java.util.List;
import java.util.concurrent.locks.Lock;
import java.util.stream.Collectors;

import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventHandler;
import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventListener;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.define.constants.RedisConstants;
import com.vikadata.social.dingtalk.DingTalkServiceProvider;
import com.vikadata.social.dingtalk.config.DingTalkRedisOperations;
import com.vikadata.social.dingtalk.enums.DingTalkBizType;
import com.vikadata.social.dingtalk.event.BaseSyncHttpBizData;
import com.vikadata.social.dingtalk.event.SyncHttpPushHighEvent;
import com.vikadata.social.dingtalk.event.SyncHttpPushMediumEvent;

import org.springframework.beans.factory.annotation.Autowired;

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
public class SyncHttpIsvEventHandler {
    @Autowired(required = false)
    private DingTalkRedisOperations dingTalkRedisOperations;

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
        // 先根据bizType排序,从小到大,因为需要优先级
        List<BaseSyncHttpBizData> bizDataList = event.getBizData().stream().sorted(Comparator.comparing(BaseSyncHttpBizData::getBizType)).collect(Collectors.toList());
        for (BaseSyncHttpBizData bizData : bizDataList) {
            if (!DingTalkBizType.hasValue(bizData.getBizType())) {
                log.error("收到未定的bizType处理事件:{}", bizData.getBizType());
                // 不管，进行下一个
                continue;
            }
            String lockKey = RedisConstants.getDingTalkSyncHttpEventLockKey(bizData.getSubscribeId(),
                    bizData.getCorpId(), bizData.getBizId(), bizData.getBizType());
            // 60s
            Lock lock = dingTalkRedisOperations.getLock(lockKey);
            boolean locked = false;
            try {
                // 就算接收到了数据，同一时间只能一个客户端处理
                locked = lock.tryLock();
                if (locked) {
                    JSONObject eventData = JSONUtil.parseObj(bizData.getBizData());
                    eventData.set(EVENT_CALLBACK_TYPE_KEY, event.getEventType());
                    dingtalkServiceProvider.handleIsvAppEventNotify(bizData.getBizId(), eventData, bizData.getCorpId(), suiteId);
                }
            }
            catch (Exception e) {
                log.error("处理SyncAction异常:{}:{}", bizData.getBizId(), bizData.getBizType(), e);
            }
            finally {
                if (locked) {
                    lock.unlock();
                }
            }
        }
        // 钉钉的事件推送不会重复
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
            if (!DingTalkBizType.hasValue(bizData.getBizType())) {
                log.error("收到未定的bizType处理事件:{}", bizData.getBizType());
                return null;
            }
            String lockKey = RedisConstants.getDingTalkSyncHttpEventLockKey(bizData.getSubscribeId(),
                    bizData.getCorpId(), bizData.getBizId(), bizData.getBizType());
            // 60s
            Lock lock = dingTalkRedisOperations.getLock(lockKey);
            boolean locked = false;
            try {
                // 就算接收到了数据，同一时间只能一个客户端处理
                locked = lock.tryLock();
                if (locked) {
                    JSONObject eventData = JSONUtil.parseObj(bizData.getBizData());
                    eventData.set(EVENT_CALLBACK_TYPE_KEY, event.getEventType());
                    dingtalkServiceProvider.handleIsvAppEventNotify(bizData.getBizId(), eventData, bizData.getCorpId(), suiteId);
                }
            }
            catch (Exception e) {
                log.error("处理SyncAction异常:{}:{}", bizData.getBizId(), bizData.getBizType(), e);
            }
            finally {
                if (locked) {
                    lock.unlock();
                }
            }
        }
        // 钉钉的事件推送不会重复
        return DING_TALK_CALLBACK_SUCCESS;
    }
}
