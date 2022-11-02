package com.vikadata.social.service.dingtalk.service.impl;

import java.util.concurrent.locks.Lock;

import javax.annotation.Resource;

import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.core.constants.RedisConstants;
import com.vikadata.social.dingtalk.config.DingTalkRedisOperations;
import com.vikadata.social.service.dingtalk.entity.DingTalkOpenSyncBizDataMediumEntity;
import com.vikadata.social.service.dingtalk.mapper.DingTalkOpenSyncBizDataMediumMapper;
import com.vikadata.social.service.dingtalk.service.IDingTalkOpenSyncBizDataMediumService;

import org.springframework.stereotype.Service;

/**
 * Third Party Integration - Medium Priority Data Service Class
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
            // Even if data is received, only one client can process it at the same time
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
            log.error("Medium priority data exception for write push: {}:{}", bizId, bizType, e);
        }
        finally {
            if (locked) {
                lock.unlock();
            }
        }
        return false;
    }
}
