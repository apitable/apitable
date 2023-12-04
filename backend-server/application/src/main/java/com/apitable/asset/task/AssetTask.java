/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.asset.task;

import static com.apitable.core.constants.RedisConstants.GENERAL_STATICS;
import static net.javacrumbs.shedlock.core.LockAssert.assertLocked;

import cn.hutool.core.util.StrUtil;
import com.apitable.asset.entity.AssetEntity;
import com.apitable.asset.mapper.AssetMapper;
import com.apitable.shared.clock.spring.ClockManager;
import com.apitable.starter.oss.core.OssClientTemplate;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;

/**
 * Asset task class.
 */
@Slf4j
@Configuration(proxyBeanMethods = false)
@ConditionalOnProperty(value = "TEST_ENABLED", havingValue = "false", matchIfMissing = true)
public class AssetTask {

    @Autowired(required = false)
    private OssClientTemplate ossTemplate;

    @Resource
    private AssetMapper assetMapper;

    @Resource
    private RedisTemplate<String, Long> redisTemplate;

    @Value("${ASSET_RECYCLE_WAITING_MINUTES:60}")
    private Integer waitingMinutes;

    /**
     * Asset recycle cron.
     * cron: 0 35 * * * ?
     * preview execute desc: ****-04-25 00:35:00, ****-04-25 01:35:00, ****-04-25 02:35:00
     */
    @Scheduled(cron = "${ASSET_RECYCLE_CRON:0 35 * * * ?}")
    @SchedulerLock(name = "assetRecycle", lockAtMostFor = "9m", lockAtLeastFor = "9m")
    public void assetRecycle() {
        assertLocked();
        log.info("Execute Asset Recycle Cron");
        LocalDateTime previousHour =
            ClockManager.me().getLocalDateTimeNow().minusMinutes(waitingMinutes);
        Long beginId = this.getScanBeginIdFromCache();
        while (true) {
            List<AssetEntity> assets = assetMapper.selectByIdGreaterThanEqual(beginId);
            if (assets.isEmpty()) {
                return;
            }
            List<Long> assetIds = new ArrayList<>();
            for (AssetEntity asset : assets) {
                if (previousHour.isBefore(asset.getCreatedAt())) {
                    this.updateScanBeginIdCache(asset.getId());
                    return;
                }
                if (asset.getFileSize() > 0) {
                    continue;
                }
                assetIds.add(asset.getId());
                ossTemplate.delete(asset.getBucketName(), asset.getFileUrl());
            }
            if (assetIds.size() > 0) {
                assetMapper.deleteBatchIds(assetIds);
            }
            beginId = assets.get(assets.size() - 1).getId() + 1;
            this.updateScanBeginIdCache(beginId);
        }
    }

    private Long getScanBeginIdFromCache() {
        String key = StrUtil.format(GENERAL_STATICS, "asset-cron", "scan-begin-id");
        return redisTemplate.opsForValue().get(key);
    }

    private void updateScanBeginIdCache(Long id) {
        String key = StrUtil.format(GENERAL_STATICS, "asset-cron", "scan-begin-id");
        redisTemplate.opsForValue().set(key, id, 30, TimeUnit.DAYS);
    }
}

