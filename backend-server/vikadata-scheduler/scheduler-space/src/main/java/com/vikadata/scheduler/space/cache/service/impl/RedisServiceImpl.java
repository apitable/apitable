package com.vikadata.scheduler.space.cache.service.impl;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import com.xxl.job.core.context.XxlJobHelper;

import com.vikadata.define.constants.RedisConstants;
import com.vikadata.scheduler.space.cache.service.RedisService;
import com.vikadata.scheduler.space.mapper.statistics.StatisticsMapper;
import com.vikadata.scheduler.space.mapper.workspace.DatasheetMetaMapper;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.stereotype.Service;

import static com.vikadata.define.constants.RedisConstants.GENERAL_STATICS;

/**
 * <p>
 * 缓存服务实现类
 * </p>
 *
 * @author Chambers
 * @date 2020/1/14
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

    @Override
    public void delOpenedSheet(Long userId, String spaceId) {
        redisTemplate.delete(RedisConstants.getUserSpaceOpenedSheetKey(userId, spaceId));
    }

    @Override
    public void delUserSpace(Long userId, String spaceId) {
        redisTemplate.delete(RedisConstants.getUserSpaceKey(userId, spaceId));
    }

    @Override
    public Long getYesterdayMaxChangeId() {
        String key = StrUtil.format(GENERAL_STATICS, "changeset", "day-max-id");
        Long id = redisTemplate.opsForValue().get(key);
        if (id != null) {
            Long expire = redisTemplate.getExpire(key);
            // 正常是每天定时触发，昨天的缓存应该剩余一小时，满足才去更新今天最大表ID，防止手动触发多次更新最大表ID
            int timingRemainTime = 3800;
            if (expire == null || expire < timingRemainTime) {
                this.updateChangesetMaxId(key);
            }
            return id;
        }
        this.updateChangesetMaxId(key);
        // 没有缓存时，查询昨天最小的表ID
        LocalDateTime yesterday = LocalDateTime.now(ZoneId.of("+8")).plusDays(-1);
        return datasheetMetaMapper.selectMinIdAfterCreatedAt(yesterday);
    }

    private void updateChangesetMaxId(String key) {
        // 获取现在最大的表ID，保留 25 小时缓存
        Long id = datasheetMetaMapper.selectMaxId();
        redisTemplate.opsForValue().set(key, id, 25, TimeUnit.HOURS);
    }

    @Override
    public String delResourceLock() {
        String lua = "local result = \"\";" +
            "local done = false;" +
            "local cursor = \"0\";" +
            "repeat" +
            "    local sr = redis.call(\"SCAN\", cursor, \"MATCH\", \"lock.*\");" +
            "    cursor = sr[1];" +
            "    redis.replicate_commands()" +
            "    for i, key in ipairs(sr[2]) do" +
            "        if redis.call(\"ttl\", key) == -1 then" +
            "            redis.call(\"del\", key)" +
            "            if string.len(result) == 0 then result = key" +
            "            else result = result..\"\\n\"..key end;" +
            "        end;" +
            "    end;" +
            "    if cursor == \"0\" then" +
            "        done = true" +
            "    end;" +
            "until done;" +
            "return result;";

        RedisScript<String> script = new DefaultRedisScript<>(lua, String.class);
        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();

        return redisTemplate.execute(script, stringRedisSerializer,
                stringRedisSerializer, new ArrayList<>());
    }

    @Override
    public void refreshApiUsageNextMonthMinId() {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM");
        String suffix = now.plusMonths(1).format(dateTimeFormatter);
        String nextMonthKey = StrUtil.format(GENERAL_STATICS, "api-usage-min-id", suffix);
        // 查询最大表ID，更新为下个月的最小表ID
        Long maxId = statisticsMapper.selectApiUsageMaxId();
        XxlJobHelper.log("maxId: {}", maxId);
        if (maxId == null) {
            return;
        }
        // 保存到缓存
        redisTemplate.opsForValue().set(nextMonthKey, maxId, 33, TimeUnit.DAYS);
        XxlJobHelper.log("更新成功");
    }
}
