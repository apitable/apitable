package com.vikadata.scheduler.space.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.date.LocalDateTimeUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;

import com.vikadata.scheduler.space.mapper.developer.ApiStatisticsMapper;
import com.vikadata.scheduler.space.model.ApiRecordDto;
import com.vikadata.scheduler.space.model.SpaceApiStatisticsDto;
import com.vikadata.scheduler.space.model.SpaceApiUsageDto;
import com.vikadata.scheduler.space.pojo.ApiStatisticsDaily;
import com.vikadata.scheduler.space.pojo.ApiStatisticsMonthly;
import com.vikadata.scheduler.space.pojo.ApiUsage;
import com.vikadata.scheduler.space.service.IApiStatisticsService;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.core.constants.DateFormatConstants.NORM_DATE_PATTERN;
import static com.vikadata.core.constants.RedisConstants.GENERAL_STATICS;

/**
 * <p>
 * Api Usage Statistics Service Implement Class
 * <p>
 */
@Service
public class ApiStatisticsServiceImpl implements IApiStatisticsService {

    @Resource
    private ApiStatisticsMapper apiStatisticsMapper;

    @Resource
    private RedisTemplate<String, Long> redisTemplate;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void syncApiUsageDailyData(List<SpaceApiUsageDto> spaceApiUsageDtoList) {
        // build data
        LocalDateTime now = LocalDateTime.now();
        List<ApiStatisticsDaily> apiStatisticsDailyEntities = new ArrayList<>();
        for (SpaceApiUsageDto spaceApiUsageInfo : spaceApiUsageDtoList) {
            if (StrUtil.isBlank(spaceApiUsageInfo.getSpaceId())) {
                continue;
            }
            ApiStatisticsDaily apiStatisticsDailyEntity = new ApiStatisticsDaily();
            apiStatisticsDailyEntity.setId(IdWorker.getId());
            apiStatisticsDailyEntity.setSpaceId(spaceApiUsageInfo.getSpaceId());
            apiStatisticsDailyEntity.setStatisticsTime(spaceApiUsageInfo.getStatisticsTime());
            apiStatisticsDailyEntity.setTotalCount(spaceApiUsageInfo.getTotalCount());
            apiStatisticsDailyEntity.setSuccessCount(spaceApiUsageInfo.getSuccessCount());
            apiStatisticsDailyEntity.setFailureCount(spaceApiUsageInfo.getTotalCount() - spaceApiUsageInfo.getSuccessCount());
            apiStatisticsDailyEntity.setCreatedAt(now);
            apiStatisticsDailyEntities.add(apiStatisticsDailyEntity);
        }
        if (apiStatisticsDailyEntities.isEmpty()) {
            return;
        }
        // Synchronize API daily usage data to the daily statistics table
        List<List<ApiStatisticsDaily>> split = CollUtil.split(apiStatisticsDailyEntities, 1000);
        for (List<ApiStatisticsDaily> list : split) {
            apiStatisticsMapper.insertApiUsageDailyInfo(list);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void syncApiUsageMonthlyData(List<SpaceApiUsageDto> spaceApiUsageDtoList) {
        // build data
        LocalDateTime now = LocalDateTime.now();
        List<ApiStatisticsMonthly> apiStatisticsMonthlyEntities = new ArrayList<>();
        for (SpaceApiUsageDto spaceApiUsageInfo : spaceApiUsageDtoList) {
            if (StrUtil.isBlank(spaceApiUsageInfo.getSpaceId())) {
                continue;
            }
            ApiStatisticsMonthly apiStatisticsMonthlyEntity = new ApiStatisticsMonthly();
            apiStatisticsMonthlyEntity.setId(IdWorker.getId());
            apiStatisticsMonthlyEntity.setSpaceId(spaceApiUsageInfo.getSpaceId());
            apiStatisticsMonthlyEntity.setStatisticsTime(spaceApiUsageInfo.getStatisticsTime());
            apiStatisticsMonthlyEntity.setTotalCount(spaceApiUsageInfo.getTotalCount());
            apiStatisticsMonthlyEntity.setSuccessCount(spaceApiUsageInfo.getSuccessCount());
            apiStatisticsMonthlyEntity.setFailureCount(spaceApiUsageInfo.getTotalCount() - spaceApiUsageInfo.getSuccessCount());
            apiStatisticsMonthlyEntity.setCreatedAt(now);
            apiStatisticsMonthlyEntities.add(apiStatisticsMonthlyEntity);
        }
        // Synchronize API monthly usage information to the monthly statistics table
        List<List<ApiStatisticsMonthly>> split = CollUtil.split(apiStatisticsMonthlyEntities, 1000);
        for (List<ApiStatisticsMonthly> list : split) {
            apiStatisticsMapper.insertApiUsageMonthlyInfo(list);
        }
    }

    @Override
    public void spaceApiUsageDailyStatistics() {
        // Get the time and table ID when statistics started
        SpaceApiStatisticsDto beginDto = this.getDailyStatisticsBeginDate();
        // If the information is empty, it means that there is no data in the API usage meter and statistics table, and end
        if (beginDto == null) {
            return;
        }
        LocalDateTime today = LocalDateTimeUtil.beginOfDay(LocalDateTime.now());
        // start time equal to or later than today, and end
        if (!beginDto.getBeginDate().isBefore(today)) {
            return;
        }

        // Statistics from the start time to yesterday's data
        Long beginId = beginDto.getBeginTableId();
        LocalDateTime endOfDay = LocalDateTimeUtil.endOfDay(beginDto.getBeginDate());
        do {
            // Query the next date of the API usage meter
            // (There is no need for the next day, there may be some days in the middle that there is no call record)
            // Daily statistics for the date when there is a record
            ApiUsage nextDayFirstRecord = apiStatisticsMapper.selectNextDayFirstRecord(beginId, endOfDay);
            boolean flag = nextDayFirstRecord != null;
            // Meetup Query Statistics
            List<SpaceApiUsageDto> spaceApiUsageDtoList = apiStatisticsMapper.selectSpaceApiUsageDaily(beginId, flag ? nextDayFirstRecord.getId() : null);
            // Synchronized to the daily API usage statistics table
            this.syncApiUsageDailyData(spaceApiUsageDtoList);
            if (flag) {
                beginId = nextDayFirstRecord.getId();
                endOfDay = LocalDateTimeUtil.endOfDay(nextDayFirstRecord.getCreatedAt());
            }
            else {
                endOfDay = today;
            }

        } while (endOfDay.isBefore(today));
    }

    private SpaceApiStatisticsDto getDailyStatisticsBeginDate() {
        // Get the last record of the API daily usage statistics table, and start the statistics from the next day (normally, yesterday)
        ApiStatisticsDaily apiStatisticsDailyEntity = apiStatisticsMapper.selectLastApiUsageDailyRecord();
        if (apiStatisticsDailyEntity != null) {
            // Query API usage tables in reverse order, the largest table ID of the day
            Long lastDayMaxId = apiStatisticsMapper.selectMaxIdDaily(apiStatisticsDailyEntity.getStatisticsTime());
            LocalDateTime dateTime = LocalDateTimeUtil.parse(apiStatisticsDailyEntity.getStatisticsTime(), NORM_DATE_PATTERN).plusDays(1);
            return new SpaceApiStatisticsDto(dateTime, lastDayMaxId + 1);
        }
        // Query the first record of the API usage meter, start counting from the first day
        ApiUsage apiUsageEntity = apiStatisticsMapper.selectFirstApiUsageRecord();
        if (apiUsageEntity != null) {
            return new SpaceApiStatisticsDto(LocalDateTimeUtil.beginOfDay(apiUsageEntity.getCreatedAt()), apiUsageEntity.getId());
        }
        return null;
    }

    @Override
    public void spaceApiUsageMonthlyStatistics() throws ParseException {
        // Get the last record of the API monthly usage statistics table
        ApiStatisticsMonthly apiStatisticsMonthlyLastEntity = apiStatisticsMapper.selectLastApiUsageMonthlyRecord();
        // Initialize the API monthly usage statistics table
        if (apiStatisticsMonthlyLastEntity == null) {
            // Query the first record of the API usage meter
            ApiRecordDto firstRecord = apiStatisticsMapper.selectFirstApiRecord();
            // Query the minimum ID of monthly API usage records in segments
            if (firstRecord == null) {
                return;
            }
            List<Long> minApiUsageRecordIds = this.spaceApiUsageMinRecordIds(firstRecord);
            // Query API monthly usage historical data in stages
            List<SpaceApiUsageDto> spaceApiUsageHistoryMonthlyList = new ArrayList<>();
            for (int i = 0; i + 1 < minApiUsageRecordIds.size(); i++) {
                List<SpaceApiUsageDto> spaceApiUsageMonthlyList = apiStatisticsMapper.selectSpaceApiUsageMonthly(minApiUsageRecordIds.get(i), minApiUsageRecordIds.get(i + 1));
                spaceApiUsageHistoryMonthlyList.addAll(spaceApiUsageMonthlyList);
            }
            // Synchronize historical data to API monthly usage statistics table
            this.syncApiUsageMonthlyData(spaceApiUsageHistoryMonthlyList);
        }
        else {
            // Get the month of the previous month
            SimpleDateFormat month = new SimpleDateFormat("yyyy-MM", Locale.CHINA);
            String previousMonth = month.format(DateUtil.lastMonth());
            // Get the statistics time of the last data in the monthly statistics table
            String lastApiUsageMonthlyStatisticsTime = apiStatisticsMonthlyLastEntity.getStatisticsTime();
            if (!previousMonth.equals(lastApiUsageMonthlyStatisticsTime)) {
                // The minimum table ID of the next month after the start month of statistics
                Long beginMinId = this.getNextMonthMinId(month, lastApiUsageMonthlyStatisticsTime);
                // The minimum table ID of the next month after the statistics end month
                Long endMinId = this.getNextMonthMinId(month, previousMonth);
                // Get unstated API monthly usage information and compensation data
                List<SpaceApiUsageDto> unStatisticsApiUsageMonthlyInfoList = apiStatisticsMapper.selectSpaceApiUsageMonthly(beginMinId, endMinId);
                // Synchronize unstated data to the monthly API usage statistics table
                this.syncApiUsageMonthlyData(unStatisticsApiUsageMonthlyInfoList);
            }
        }
    }

    private List<Long> spaceApiUsageMinRecordIds(ApiRecordDto firstRecord) throws ParseException {
        // get current month
        SimpleDateFormat month = new SimpleDateFormat("yyyy-MM", Locale.CHINA);
        // Difference between the first record and the current month
        long betweenMonth = DateUtil.betweenMonth(new Date(), month.parse(firstRecord.getMonthTime()), true);
        // Query the monthly minimum API usage record ID
        List<Long> minApiUsageRecordIds = new ArrayList<>();
        minApiUsageRecordIds.add(firstRecord.getMinId());
        // Month minimum table ID
        Long minId = firstRecord.getMinId();
        for (int i = 0; i < betweenMonth; i++) {
            // next month month date
            String nextMonth = month.format(DateUtil.offsetMonth(month.parse(firstRecord.getMonthTime()), i + 1));
            // Minimum table ID for next month
            minId = apiStatisticsMapper.selectMinIdMonthly(minId, nextMonth);
            minApiUsageRecordIds.add(minId);
        }
        return minApiUsageRecordIds;
    }

    private Long getNextMonthMinId(SimpleDateFormat month, String statistics) throws ParseException {
        // Get the next month's minimum table ID from the cache
        String lastKey = StrUtil.format(GENERAL_STATICS, "api-usage-min-id", DateUtil.offsetMonth(month.parse(statistics), 1));
        Long nextMonthMinId = redisTemplate.opsForValue().get(lastKey);
        if (nextMonthMinId == null) {
            // Query the monthly maximum table ID directly from the database
            return apiStatisticsMapper.selectMaxIdMonthly(statistics) + 1;
        }
        return nextMonthMinId;
    }
}
