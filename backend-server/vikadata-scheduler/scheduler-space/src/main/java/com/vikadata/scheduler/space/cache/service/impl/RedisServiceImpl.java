package com.vikadata.scheduler.space.cache.service.impl;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import com.xxl.job.core.context.XxlJobHelper;

import com.vikadata.core.constants.RedisConstants;
import com.vikadata.scheduler.space.cache.service.RedisService;
import com.vikadata.scheduler.space.mapper.statistics.StatisticsMapper;
import com.vikadata.scheduler.space.mapper.workspace.DatasheetMetaMapper;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.stereotype.Service;

import static com.vikadata.core.constants.RedisConstants.GENERAL_STATICS;

/**
 * <p>
 * Redis Service Implement Class
 * </p>
 */
@Service
public class RedisServiceImpl implements RedisService {

    @Resource
    private RedisTemplate<String, Long> redisTemplate;

    @Resource
    private DatasheetMetaMapper datasheetMetaMapper;

    @Resource
    private StatisticsMapper statisticsMapper;

    @Override
    public void delActiveSpace(Long userId) {
        redisTemplate.delete(RedisConstants.getUserActiveSpaceKey(userId));
    }

    /**
     * Normally, it is triggered every day, and yesterday's cache should have one hour remaining.
     * Only update the maximum table ID today if the conditions are met,
     * to prevent manual triggering of multiple updates of the maximum table ID
     */
    @Override
    public Long getYesterdayMaxChangeId() {
        String key = StrUtil.format(GENERAL_STATICS, "changeset", "day-max-id");
        Long id = redisTemplate.opsForValue().get(key);
        if (id != null) {
            Long expire = redisTemplate.getExpire(key);
            int timingRemainTime = 3800;
            if (expire == null || expire < timingRemainTime) {
                this.updateChangesetMaxId(key);
            }
            return id;
        }
        this.updateChangesetMaxId(key);
        // when there is no cache, query the smallest table ID from yesterday
        LocalDateTime yesterday = LocalDateTime.now(ZoneId.of("+8")).plusDays(-1);
        return datasheetMetaMapper.selectMinIdAfterCreatedAt(yesterday);
    }

    private void updateChangesetMaxId(String key) {
        // get the current largest table ID, keep the cache for 25 hours
        Long id = datasheetMetaMapper.selectMaxId();
        redisTemplate.opsForValue().set(key, id, 25, TimeUnit.HOURS);
    }

    @Override
    public void refreshApiUsageNextMonthMinId() {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM");
        String suffix = now.plusMonths(1).format(dateTimeFormatter);
        String nextMonthKey = StrUtil.format(GENERAL_STATICS, "api-usage-min-id", suffix);
        // Query the maximum table ID and update it to the minimum table ID of the next month
        Long maxId = statisticsMapper.selectApiUsageMaxId();
        XxlJobHelper.log("maxId: {}", maxId);
        if (maxId == null) {
            return;
        }
        redisTemplate.opsForValue().set(nextMonthKey, maxId, 33, TimeUnit.DAYS);
        XxlJobHelper.log("Update Success.");
    }
}
