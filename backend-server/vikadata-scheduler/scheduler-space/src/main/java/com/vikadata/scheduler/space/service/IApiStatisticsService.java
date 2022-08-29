package com.vikadata.scheduler.space.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;

import com.vikadata.scheduler.space.model.ApiRecordDto;
import com.vikadata.scheduler.space.model.SpaceApiUsageDto;

/**
 * <p>
 * API用量统计接口
 * </p>
 *
 * @author liuzijing
 * @date 2022/6/1
 */
public interface IApiStatisticsService {

    /**
     * 同步API日用量数据
     *
     * @author liuzijing
     * @date 2022/5/27
     */
    void syncApiUsageDailyData(List<SpaceApiUsageDto> spaceApiUsageDtoList);

    /**
     * 同步API月用量数据
     *
     * @author liuzijing
     * @date 2022/5/27
     */
    void syncApiUsageMonthlyData(List<SpaceApiUsageDto> spaceApiUsageDtoList);

    /**
     * 空间API日用量统计
     *
     * @author liuzijing
     * @date 2022/5/22
     */
    void spaceApiUsageDailyStatistics();

    /**
     * 空间API月用量统计
     *
     * @author liuzijing
     * @date 2022/5/22
     */
    void spaceApiUsageMonthlyStatistics() throws ParseException;

    /**
     * 分段查询每月API用量记录最小ID
     *
     * @author liuzijing
     * @date 2022/6/7
     */
    List<Long> spaceApiUsageMinRecordIds(ApiRecordDto firstRecord) throws ParseException;

    /**
     * 获取统计表中月记录的最小表ID
     *
     * @author liuzijing
     * @date 2022/6/8
     */
    Long getNextMonthMinId(SimpleDateFormat month, String statistics) throws ParseException;
}

