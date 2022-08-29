package com.vikadata.scheduler.bill.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.PlayerNotificationEntity;

/**
 * <p> 
 * 通知中心-通知记录表 Mapper 接口
 * </p> 
 *
 * @author Chambers
 * @date 2021/8/30
 */
public interface PlayerNotificationMapper {

    /**
     * 批量保存通知记录
     *
     * @param entities 实体对象列表
     * @return 执行结果数
     * @author Chambers
     * @date 2021/8/30
     */
    int insertBatch(@Param("entities") List<PlayerNotificationEntity> entities);
}
