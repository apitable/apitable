package com.vikadata.api.cache.service.impl;

import java.util.List;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.cache.service.SpaceCapacityCacheService;
import com.vikadata.api.modular.space.mapper.SpaceAssetMapper;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import static com.vikadata.define.constants.RedisConstants.GENERAL_STATICS;

/**
 * <p>
 * 空间容量缓存实现类
 * </p>
 *
 * @author Chambers
 * @date 2021/10/28
 */
@Slf4j
@Service
public class SpaceCapacityCacheServiceImpl implements SpaceCapacityCacheService {

    @Resource
    private SpaceAssetMapper spaceAssetMapper;

    @Resource
    private RedisTemplate<String, Number> redisTemplate;

    /**
     * 存储时间，单位：分钟
     */
    private static final int TIMEOUT = 30;

    @Override
    public long getSpaceCapacity(String spaceId) {
        String key = StrUtil.format(GENERAL_STATICS, "space:capacity", spaceId);
        Number number = redisTemplate.opsForValue().get(key);
        if (number != null) {
            return number.longValue();
        }
        List<Integer> fileSizes = spaceAssetMapper.selectFileSizeBySpaceId(spaceId);
        long statics = fileSizes.stream().filter(Objects::nonNull).mapToLong(Integer::intValue).sum();
        // 保存缓存
        redisTemplate.opsForValue().set(key, statics, TIMEOUT, TimeUnit.MINUTES);
        return statics;
    }

    @Override
    public void del(String spaceId) {
        // String key = StrUtil.format(GENERAL_STATICS, "space:capacity", spaceId);
        // redisTemplate.delete(key);
    }

}
