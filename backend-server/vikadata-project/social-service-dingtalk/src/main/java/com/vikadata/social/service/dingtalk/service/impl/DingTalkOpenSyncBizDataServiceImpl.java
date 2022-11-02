package com.vikadata.social.service.dingtalk.service.impl;

import java.util.List;
import java.util.concurrent.locks.Lock;

import javax.annotation.Resource;

import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.core.constants.RedisConstants;
import com.vikadata.social.dingtalk.config.DingTalkRedisOperations;
import com.vikadata.social.service.dingtalk.entity.DingTalkOpenSyncBizDataEntity;
import com.vikadata.social.service.dingtalk.mapper.DingTalkOpenSyncBizDataMapper;
import com.vikadata.social.service.dingtalk.model.dto.SocialTenantBizDataDto;
import com.vikadata.social.service.dingtalk.service.IDingTalkOpenSyncBizDataService;

import org.springframework.stereotype.Service;

/**
 * Third Party Integration - High Priority Data Service Class
 */
@Service
@Slf4j
public class DingTalkOpenSyncBizDataServiceImpl extends ServiceImpl<DingTalkOpenSyncBizDataMapper,
        DingTalkOpenSyncBizDataEntity> implements IDingTalkOpenSyncBizDataService {

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
                DingTalkOpenSyncBizDataEntity entity = new DingTalkOpenSyncBizDataEntity();
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
            log.error("Write push data exception:{}:{}", bizId, bizType, e);
        }
        finally {
            if (locked) {
                lock.unlock();
            }
        }
        return false;
    }

    @Override
    public List<SocialTenantBizDataDto> getBySubscribeIdAndBizTypes(String subscribeId,
            String corpId, List<Integer> bizType) {
        return baseMapper.selectBySubscribeIdAndCorpIdAndBizTypes(subscribeId, corpId, bizType);
    }
}
