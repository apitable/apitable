package com.vikadata.api.cache.service.impl;

import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.cache.service.UserActiveSpaceService;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.define.constants.RedisConstants;

import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 用户激活空间 服务接口
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/15 15:49
 */
@Service
@Slf4j
public class UserActiveSpaceRedisServiceImpl implements UserActiveSpaceService {

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @Resource
    private MemberMapper memberMapper;

    /**
     * 存储时间，单位：天
     */
    private static final int TIMEOUT = 7;

    @Override
    public void save(Long userId, String spaceId) {
        log.info("保存覆盖用户最后工作的空间ID");
        // 缓存保存记录，过期自动获取
        BoundValueOperations<String, String> opts = redisTemplate.boundValueOps(RedisConstants.getUserActiveSpaceKey(userId));
        opts.set(spaceId, TIMEOUT, TimeUnit.DAYS);
    }

    @Override
    public String getLastActiveSpace(Long userId) {
        log.info("查询用户的最后工作的空间ID");
        BoundValueOperations<String, String> opts = redisTemplate.boundValueOps(RedisConstants.getUserActiveSpaceKey(userId));
        String spaceId = opts.get();
        if (StrUtil.isBlank(spaceId)) {
            spaceId = memberMapper.selectActiveSpaceByUserId(userId);
            if (StrUtil.isBlank(spaceId)) {
                //将空间列表第一个作为新的活跃空间
                spaceId = memberMapper.getFirstSpaceIdByUserId(userId);
            }
        }
        return spaceId;
    }

    @Override
    public void delete(Long userId) {
        redisTemplate.delete(RedisConstants.getUserActiveSpaceKey(userId));
    }
}
