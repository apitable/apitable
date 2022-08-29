package com.vikadata.social.service.dingtalk.service.impl;

import java.util.concurrent.locks.Lock;

import javax.annotation.Resource;

import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.define.constants.RedisConstants;
import com.vikadata.social.dingtalk.config.DingTalkRedisOperations;
import com.vikadata.social.service.dingtalk.entity.DingTalkOpenSyncBizDataMediumEntity;
import com.vikadata.social.service.dingtalk.mapper.DingTalkOpenSyncBizDataMediumMapper;
import com.vikadata.social.service.dingtalk.service.IDingTalkOpenSyncBizDataMediumService;

import org.springframework.stereotype.Service;

/**
 * <p> 
 * 第三方集成 - 中优先级数据服务类
 * </p> 
 * @author zoe zheng 
 * @date 2021/10/25 15:30
 */
@Service
@Slf4j
public class DingTalkOpenSyncBizDataMediumServiceImpl extends ServiceImpl<DingTalkOpenSyncBizDataMediumMapper,
        DingTalkOpenSyncBizDataMediumEntity> implements IDingTalkOpenSyncBizDataMediumService {

    @Resource
    private DingTalkRedisOperations dingTalkRedisOperations;

    @Override
    public Boolean create(String subscribeId, String corpId, Integer bizType, String bizId, String bizData) {
        String lockKey = RedisConstants.getDingTalkSyncHttpEventLockKey(subscribeId, corpId, bizId, bizType);
        // 60s
        Lock lock = dingTalkRedisOperations.getLock(lockKey);
        boolean locked = false;
        try {
            // 就算接收到了数据，同一时间只能一个客户端处理
            locked = lock.tryLock();
            if (locked) {
                DingTalkOpenSyncBizDataMediumEntity entity = new DingTalkOpenSyncBizDataMediumEntity();
                entity.setId(IdWorker.getId());
                entity.setCorpId(corpId);
                entity.setSubscribeId(subscribeId);
                entity.setBizId(bizId);
                entity.setBizData(bizData);
                entity.setBizType(bizType);
                int result = baseMapper.insert(entity);
                return SqlHelper.retBool(result);
            }
        }
        catch (Exception e) {
            log.error("写入推送的中优先级数据异常:{}:{}", bizId, bizType, e);
        }
        finally {
            if (locked) {
                lock.unlock();
            }
        }
        return false;
    }
}
