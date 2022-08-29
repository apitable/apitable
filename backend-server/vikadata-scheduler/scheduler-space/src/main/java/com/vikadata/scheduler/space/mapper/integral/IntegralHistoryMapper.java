package com.vikadata.scheduler.space.mapper.integral;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.IntegralHistoryEntity;
import com.vikadata.scheduler.space.model.IntegralStaticsDto;

/**
 * <p>
 * 积分历史记录 Mapper
 * </p>
 *
 * @author Chambers
 * @date 2021/7/11
 */
public interface IntegralHistoryMapper {

    /**
     * 查询积分统计DTO
     *
     * @param beginTime 开始时间
     * @param endTime   结束时间
     * @return IntegralStaticsDto
     * @author Chambers
     * @date 2021/7/11
     */
    IntegralStaticsDto selectDto(@Param("beginTime") LocalDateTime beginTime, @Param("endTime") LocalDateTime endTime);

    /**
     * 查找V币积分覆盖问题用户
     *
     * @return 数据异常用户ID
     * @author liuzijing
     * @date 2022/4/7
     */
    List<Long> selectIntegralCoverUser();

    /**
     * 根据用户ID查找此用户的积分变更记录
     *
     * @return IntegralHistoryEntities 积分系统-积分变更历史表
     * @author liuzijing
     * @date 2022/4/7
     */
    List<IntegralHistoryEntity> selectIntegralCoverUserRecordByUserId(@Param("userId") Long userId);

    /**
     * 更新清洗后的数据
     *
     * @return 执行结果数
     * @author liuzijing
     * @date 2022/4/12
     */
    int updateIntegralRecord(@Param("id")Long id, @Param("originIntegral")Integer originIntegral, @Param("totalIntegral")Integer totalIntegral);

}
