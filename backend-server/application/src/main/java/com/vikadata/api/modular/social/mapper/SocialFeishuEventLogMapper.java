package com.vikadata.api.modular.social.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SocialFeishuEventLogEntity;

/**
 * Lark Event Log Mapper
 */
public interface SocialFeishuEventLogMapper extends BaseMapper<SocialFeishuEventLogEntity> {

    /**
     * Query total number of UUIDs
     *
     * @param uuid Event unique identifier
     * @return Total
     */
    Integer selectCountByUuid(@Param("uuid") String uuid);

    /**
     * Query by UUID
     *
     * @param uuid Event unique identifier
     * @return Social Lark Event Log Entity
     */
    SocialFeishuEventLogEntity selectByUuid(@Param("uuid") String uuid);

    /**
     * Update event processing status
     *
     * @param uuid Event unique identifier
     * @return Number of execution results
     */
    int updateStatusTrueByUuid(@Param("uuid") String uuid);

    /**
     * Query the latest event type of the tenant
     * @param tenantKey Enterprise ID
     * @param type Event Type
     * @return Social Lark Event Log Entity
     */
    String selectLatestByTenantKeyAndType(@Param("tenantKey") String tenantKey, @Param("type") String type);
}
