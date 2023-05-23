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

import static net.javacrumbs.shedlock.core.LockAssert.assertLocked;

import com.apitable.asset.entity.AssetEntity;
import com.apitable.asset.mapper.AssetMapper;
import com.apitable.starter.oss.core.OssClientTemplate;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
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

    @Value("${ASSET_RECYCLE_WAITING_MINUTES:60}")
    private Integer waitingMinutes;

    /**
     * Asset recycle cron.
     * cron: 0 0/10 0 * * ?
     * preview execute desc: ****-04-25 00:00:00, ****-04-25 00:10:00, ****-04-25 00:20:00
     */
    @Scheduled(cron = "${ASSET_RECYCLE_CRON:0 35 * * * ?}")
    @SchedulerLock(name = "assetRecycle", lockAtMostFor = "9m", lockAtLeastFor = "9m")
    public void assetRecycle() {
        assertLocked();
        log.info("Execute Asset Recycle Cron");
        while (true) {
            List<AssetEntity> assets = assetMapper.selectInvalidAsset(waitingMinutes);
            if (assets.isEmpty()) {
                return;
            }
            List<Long> assetIds = new ArrayList<>();
            for (AssetEntity asset : assets) {
                assetIds.add(asset.getId());
                ossTemplate.delete(asset.getBucketName(), asset.getFileUrl());
            }
            assetMapper.deleteBatchIds(assetIds);
        }
    }
}

