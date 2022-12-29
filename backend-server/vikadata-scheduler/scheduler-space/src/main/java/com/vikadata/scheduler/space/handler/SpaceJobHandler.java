package com.vikadata.scheduler.space.handler;

import java.text.ParseException;

import javax.annotation.Resource;

import com.xxl.job.core.context.XxlJobHelper;
import com.xxl.job.core.handler.annotation.XxlJob;

import com.vikadata.scheduler.space.cache.service.RedisService;
import com.vikadata.scheduler.space.service.IApiStatisticsService;
import com.vikadata.scheduler.space.service.ISpaceAssetService;
import com.vikadata.scheduler.space.service.ISpaceService;

import org.springframework.stereotype.Component;

/**
 * <p>
 * Space Job Handler
 * </p>
 */
@Component
public class SpaceJobHandler {

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private ISpaceAssetService iSpaceAssetService;

    @Resource
    private RedisService redisService;

    @Resource
    private IApiStatisticsService apiStatisticsService;

    @XxlJob(value = "delSpaceJobHandler")
    public void execute() {
        String param = XxlJobHelper.getJobParam();
        XxlJobHelper.log("Delete Space. param:{}", param);
        iSpaceService.delSpace(param);
    }

    @XxlJob(value = "refCountingJobHandler")
    public void refCounting() {
        String param = XxlJobHelper.getJobParam();
        XxlJobHelper.log("Ref Counting. param:{}", param);
        iSpaceAssetService.referenceCounting(param);
    }

    @XxlJob(value = "refreshApiUsageNextMonthIdHandler")
    public void refreshApiUsageNextMonthMinId() {
        redisService.refreshApiUsageNextMonthMinId();
    }

    @XxlJob(value = "spaceApiUsageDailyStatistics")
    public void spaceApiUsageDailyStatistics() {
        apiStatisticsService.spaceApiUsageDailyStatistics();
    }

    @XxlJob(value = "spaceApiUsageMonthlyStatistics")
    public void spaceApiUsageMonthlyStatistics() throws ParseException {
        apiStatisticsService.spaceApiUsageMonthlyStatistics();
    }
}
