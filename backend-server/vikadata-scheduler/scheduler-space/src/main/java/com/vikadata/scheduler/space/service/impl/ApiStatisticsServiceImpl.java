package com.vikadata.scheduler.space.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.date.LocalDateTimeUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;

import com.vikadata.entity.ApiStatisticsDailyEntity;
import com.vikadata.entity.ApiStatisticsMonthlyEntity;
import com.vikadata.entity.ApiUsageEntity;
import com.vikadata.scheduler.space.mapper.developer.ApiStatisticsMapper;
import com.vikadata.scheduler.space.model.ApiRecordDto;
import com.vikadata.scheduler.space.model.SpaceApiStatisticsDto;
import com.vikadata.scheduler.space.model.SpaceApiUsageDto;
import com.vikadata.scheduler.space.service.IApiStatisticsService;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.define.constants.DateFormatConstants.NORM_DATE_PATTERN;
import static com.vikadata.define.constants.RedisConstants.GENERAL_STATICS;

/**
 * <p>
 * API用量统计接口实现类
 * <p>
 *
 * @author liuzijing
 * @date 2022/06/01
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
        // 构建数据
        LocalDateTime now = LocalDateTime.now();
        List<ApiStatisticsDailyEntity> apiStatisticsDailyEntities = new ArrayList<>();
        for (SpaceApiUsageDto spaceApiUsageInfo : spaceApiUsageDtoList) {
            if (StrUtil.isBlank(spaceApiUsageInfo.getSpaceId())) {
                continue;
            }
            ApiStatisticsDailyEntity apiStatisticsDailyEntity = new ApiStatisticsDailyEntity();
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
        // 同步API日用量数据至日统计表中
        List<List<ApiStatisticsDailyEntity>> split = CollUtil.split(apiStatisticsDailyEntities, 1000);
        for (List<ApiStatisticsDailyEntity> list : split) {
            apiStatisticsMapper.insertApiUsageDailyInfo(list);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void syncApiUsageMonthlyData(List<SpaceApiUsageDto> spaceApiUsageDtoList) {
        // 构建数据
        LocalDateTime now = LocalDateTime.now();
        List<ApiStatisticsMonthlyEntity> apiStatisticsMonthlyEntities = new ArrayList<>();
        for (SpaceApiUsageDto spaceApiUsageInfo : spaceApiUsageDtoList) {
            if (StrUtil.isBlank(spaceApiUsageInfo.getSpaceId())) {
                continue;
            }
            ApiStatisticsMonthlyEntity apiStatisticsMonthlyEntity = new ApiStatisticsMonthlyEntity();
            apiStatisticsMonthlyEntity.setId(IdWorker.getId());
            apiStatisticsMonthlyEntity.setSpaceId(spaceApiUsageInfo.getSpaceId());
            apiStatisticsMonthlyEntity.setStatisticsTime(spaceApiUsageInfo.getStatisticsTime());
            apiStatisticsMonthlyEntity.setTotalCount(spaceApiUsageInfo.getTotalCount());
            apiStatisticsMonthlyEntity.setSuccessCount(spaceApiUsageInfo.getSuccessCount());
            apiStatisticsMonthlyEntity.setFailureCount(spaceApiUsageInfo.getTotalCount() - spaceApiUsageInfo.getSuccessCount());
            apiStatisticsMonthlyEntity.setCreatedAt(now);
            apiStatisticsMonthlyEntities.add(apiStatisticsMonthlyEntity);
        }
        // 同步API月用量信息到月统计表中
        List<List<ApiStatisticsMonthlyEntity>> split = CollUtil.split(apiStatisticsMonthlyEntities, 1000);
        for (List<ApiStatisticsMonthlyEntity> list : split) {
            apiStatisticsMapper.insertApiUsageMonthlyInfo(list);
        }
    }

    @Override
    public void spaceApiUsageDailyStatistics() {
        // 获取开始统计的时间和表ID
        SpaceApiStatisticsDto beginDto = this.getDailyStatisticsBeginDate();
        // 信息为空，代表API用量表与统计表都没有数据，直接结束
        if (beginDto == null) {
            return;
        }
        LocalDateTime today = LocalDateTimeUtil.beginOfDay(LocalDateTime.now());
        // 开始时间等于或晚于今天，直接结束
        if (!beginDto.getBeginDate().isBefore(today)) {
            return;
        }

        // 统计从开始时间到昨天的数据
        Long beginId = beginDto.getBeginTableId();
        LocalDateTime endOfDay = LocalDateTimeUtil.endOfDay(beginDto.getBeginDate());
        do {
            // 查询API用量表的下一个日期（不用次日，中间可能有某几天没有调用记录），对存在记录的日期逐日统计
            ApiUsageEntity nextDayFirstRecord = apiStatisticsMapper.selectNextDayFirstRecord(beginId, endOfDay);
            boolean flag = nextDayFirstRecord != null;
            // 聚会查询统计数据
            List<SpaceApiUsageDto> spaceApiUsageDtoList = apiStatisticsMapper.selectSpaceApiUsageDaily(beginId, flag ? nextDayFirstRecord.getId() : null);
            // 同步至API用量日统计表
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
        // 获取API日用量统计表最后一条记录，从第二天开始统计（正常是昨天）
        ApiStatisticsDailyEntity apiStatisticsDailyEntity = apiStatisticsMapper.selectLastApiUsageDailyRecord();
        if (apiStatisticsDailyEntity != null) {
            // 倒序查询API用量表，当天最大的表ID
            Long lastDayMaxId = apiStatisticsMapper.selectMaxIdDaily(apiStatisticsDailyEntity.getStatisticsTime());
            LocalDateTime dateTime = LocalDateTimeUtil.parse(apiStatisticsDailyEntity.getStatisticsTime(), NORM_DATE_PATTERN).plusDays(1);
            return new SpaceApiStatisticsDto(dateTime, lastDayMaxId + 1);
        }
        // 查询API用量表第一条记录，从第一天开始统计
        ApiUsageEntity apiUsageEntity = apiStatisticsMapper.selectFirstApiUsageRecord();
        if (apiUsageEntity != null) {
            return new SpaceApiStatisticsDto(LocalDateTimeUtil.beginOfDay(apiUsageEntity.getCreatedAt()), apiUsageEntity.getId());
        }
        return null;
    }

    @Override
    public void spaceApiUsageMonthlyStatistics() throws ParseException {
        // 获取API月用量统计表最后一条记录
        ApiStatisticsMonthlyEntity apiStatisticsMonthlyLastEntity = apiStatisticsMapper.selectLastApiUsageMonthlyRecord();
        // 初始化API月用量统计表
        if (apiStatisticsMonthlyLastEntity == null) {
            // 查询API用量表第一条记录
            ApiRecordDto firstRecord = apiStatisticsMapper.selectFirstApiRecord();
            // 分段查询每月API用量记录最小ID
            if (firstRecord == null) {
                return;
            }
            List<Long> minApiUsageRecordIds = this.spaceApiUsageMinRecordIds(firstRecord);
            // 分段查询API月用量历史数据
            List<SpaceApiUsageDto> spaceApiUsageHistoryMonthlyList = new ArrayList<>();
            for (int i = 0; i + 1 < minApiUsageRecordIds.size(); i++) {
                List<SpaceApiUsageDto> spaceApiUsageMonthlyList = apiStatisticsMapper.selectSpaceApiUsageMonthly(minApiUsageRecordIds.get(i), minApiUsageRecordIds.get(i + 1));
                spaceApiUsageHistoryMonthlyList.addAll(spaceApiUsageMonthlyList);
            }
            // 同步历史数据至API月用量统计表中
            this.syncApiUsageMonthlyData(spaceApiUsageHistoryMonthlyList);
        }
        else {
            // 获取上一个月月份
            SimpleDateFormat month = new SimpleDateFormat("yyyy-MM");
            String previousMonth = month.format(DateUtil.lastMonth());
            // 获取月统计表中最后一条数据的统计时间
            String lastApiUsageMonthlyStatisticsTime = apiStatisticsMonthlyLastEntity.getStatisticsTime();
            if (!previousMonth.equals(lastApiUsageMonthlyStatisticsTime)) {
                // 统计开始月份下一个月最小表ID
                Long beginMinId = this.getNextMonthMinId(month, lastApiUsageMonthlyStatisticsTime);
                // 统计结束月份下一个月最小表ID
                Long endMinId = this.getNextMonthMinId(month, previousMonth);
                // 获取未统计API月用量信息，补偿数据
                List<SpaceApiUsageDto> unStatisticsApiUsageMonthlyInfoList = apiStatisticsMapper.selectSpaceApiUsageMonthly(beginMinId, endMinId);
                // 同步未统计数据至API用量统计月表中
                this.syncApiUsageMonthlyData(unStatisticsApiUsageMonthlyInfoList);
            }
        }
    }

    @Override
    public List<Long> spaceApiUsageMinRecordIds(ApiRecordDto firstRecord) throws ParseException {
        // 获取当前月份
        SimpleDateFormat month = new SimpleDateFormat("yyyy-MM");
        // 第一条记录与当前月份差
        long betweenMonth = DateUtil.betweenMonth(new Date(), month.parse(firstRecord.getMonthTime()), true);
        // 查询每月最小Api用量记录ID
        List<Long> minApiUsageRecordIds = new ArrayList<>();
        minApiUsageRecordIds.add(firstRecord.getMinId());
        // 月最小表ID
        Long minId = firstRecord.getMinId();
        for (int i = 0; i < betweenMonth; i++) {
            // 下一个月月份日期
            String nextMonth = month.format(DateUtil.offsetMonth(month.parse(firstRecord.getMonthTime()), i + 1));
            // 下一个月最小表ID
            minId = apiStatisticsMapper.selectMinIdMonthly(minId, nextMonth);
            minApiUsageRecordIds.add(minId);
        }
        return minApiUsageRecordIds;
    }

    @Override
    public Long getNextMonthMinId(SimpleDateFormat month, String statistics) throws ParseException {
        // 从缓存中获取下个月最小表ID
        String lastKey = StrUtil.format(GENERAL_STATICS, "api-usage-min-id", DateUtil.offsetMonth(month.parse(statistics), 1));
        Long nextMonthMinId = redisTemplate.opsForValue().get(lastKey);
        if (nextMonthMinId == null) {
            // 从数据库直接查询月最大表ID
            return apiStatisticsMapper.selectMaxIdMonthly(statistics) + 1;
        }
        return nextMonthMinId;
    }
}
