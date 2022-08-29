package com.vikadata.scheduler.space.mapper.developer;


import java.time.LocalDateTime;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.ApiStatisticsDailyEntity;
import com.vikadata.entity.ApiStatisticsMonthlyEntity;
import com.vikadata.entity.ApiUsageEntity;
import com.vikadata.scheduler.space.model.ApiRecordDto;
import com.vikadata.scheduler.space.model.SpaceApiUsageDto;

/**
 * <p>
 * API用量统计 Mapper 接口
 * </p>
 *
 * @author liuzijing
 * @date 2022/6/1
 */
public interface ApiStatisticsMapper {

    /**
     * 查询API用量表的第一条记录
     *
     * @return ApiUsageEntity
     * @author Chambers
     * @date 2022/7/19
     */
    ApiUsageEntity selectFirstApiUsageRecord();

    /**
     * 查询指定ID和创建时间次日之后的第一条记录
     *
     * @param id        表ID
     * @param createdAt 创建时间
     * @return ApiUsageEntity
     * @author Chambers
     * @date 2022/7/19
     */
    ApiUsageEntity selectNextDayFirstRecord(@Param("id") Long id, @Param("createdAt") LocalDateTime createdAt);

    /**
     * 查询日度最大表ID
     *
     * @param statisticsTime 统计时间
     * @return Long
     * @author liuzijing
     * @date 2022/6/8
     */
    Long selectMaxIdDaily(@Param("statisticsTime") String statisticsTime);

    /**
     * 查询月度最大表ID
     *
     * @param statisticsTime 统计时间
     * @return Long
     * @author liuzijing
     * @date 2022/6/8
     */
    Long selectMaxIdMonthly(@Param("statisticsTime") String statisticsTime);

    /**
     * 查询API用量表第一条数据
     *
     * @return ApiRecordDto
     * @author liuzijing
     * @date 2022/6/7
     */
    ApiRecordDto selectFirstApiRecord();

    /**
     * 查询每月API用量最小记录ID
     *
     * @param id api用量记录ID
     * @param monthTime 统计时间
     * @return id
     * @author liuzijing
     * @date 2022/6/2
     */
    Long selectMinIdMonthly(@Param("id") Long id, @Param("monthTime") String monthTime);

    /**
     * 查询空间站每日API用量信息
     *
     * @param beginId 统计开始ID
     * @param endId 统计结束ID
     * @return SpaceApiUsageDto
     * @author liuzijing
     * @date 2022/5/25
     */
    List<SpaceApiUsageDto> selectSpaceApiUsageDaily(@Param("beginId") Long beginId, @Param("endId") Long endId);

    /**
     * 查询空间站每月API用量信息
     *
     * @param beginId 统计开始ID
     * @param endId 统计结束ID
     * @return SpaceApiUsageDto
     * @author liuzijing
     * @date 2022/5/25
     */
    List<SpaceApiUsageDto> selectSpaceApiUsageMonthly(@Param("beginId") Long beginId, @Param("endId") Long endId);

    /**
     * 查询API用量日统计表中最后一条记录
     *
     * @return ApiStatisticsDailyEntity
     * @author liuzijing
     * @date 2022/5/26
     */
    ApiStatisticsDailyEntity selectLastApiUsageDailyRecord();

    /**
     * 查询API用量月统计表中最后一条记录
     *
     * @return ApiStatisticsMonthlyEntity
     * @author liuzijing
     * @date 2022/5/26
     */
    ApiStatisticsMonthlyEntity selectLastApiUsageMonthlyRecord();

    /**
     * 批量插入API日用量数据
     *
     * @param apiStatisticsDailyEntities api日用量实体
     * @return 影响行数
     * @author liuzijing
     * @date 2022/5/26
     */
    int insertApiUsageDailyInfo(@Param("apiStatisticsDailyEntities") List<ApiStatisticsDailyEntity> apiStatisticsDailyEntities);

    /**
     * 批量插入API月用量数据
     *
     * @param apiStatisticsMonthlyEntities api月用量实体
     * @return 影响行数
     * @author liuzijing
     * @date 2022/5/26
     */
    int insertApiUsageMonthlyInfo(@Param("apiStatisticsMonthlyEntities") List<ApiStatisticsMonthlyEntity> apiStatisticsMonthlyEntities);
}
